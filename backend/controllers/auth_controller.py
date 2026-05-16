"""
Auth Controller — Handles user registration, login, and profile retrieval.
Endpoints:
  POST /api/auth/register  — Register a new patient or nurse
  POST /api/auth/login     — Authenticate and receive JWT
  GET  /api/auth/me        — Get current authenticated user profile
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db
from models.user import User
from models.patient import Patient
from models.nurse import Nurse

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user (patient or nurse)."""
    data = request.get_json()

    # --- Validation ---
    required = ["full_name", "email", "password", "role"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required."}), 400

    if data["role"] not in ("patient", "nurse"):
        return jsonify({"error": "Role must be 'patient' or 'nurse'."}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered."}), 409

    # --- Create User ---
    user = User(
        full_name=data["full_name"],
        email=data["email"],
        phone=data.get("phone", ""),
        role=data["role"],
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.flush()  # get user_id before creating profile

    # --- Create role-specific profile ---
    if data["role"] == "patient":
        patient = Patient(
            user_id=user.user_id,
            address=data.get("address", ""),
            date_of_birth=data.get("date_of_birth", ""),
        )
        db.session.add(patient)
    elif data["role"] == "nurse":
        nurse = Nurse(
            user_id=user.user_id,
            specialization=data.get("specialization", "General Care"),
            experience=data.get("experience", 0),
            hourly_rate=data.get("hourly_rate", 50.0),
            bio=data.get("bio", ""),
        )
        db.session.add(nurse)

    db.session.commit()

    # Generate JWT token
    access_token = create_access_token(identity=str(user.user_id))

    return jsonify({
        "message": "Registration successful.",
        "access_token": access_token,
        "user": user.to_dict(),
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and return JWT token."""
    data = request.get_json()

    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    access_token = create_access_token(identity=str(user.user_id))

    return jsonify({
        "message": "Login successful.",
        "access_token": access_token,
        "user": user.to_dict(),
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    """Get current authenticated user profile."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if not user:
        return jsonify({"error": "User not found."}), 404

    result = user.to_dict()

    # Attach role-specific profile
    if user.role == "patient" and user.patient:
        result["profile"] = user.patient.to_dict()
    elif user.role == "nurse" and user.nurse:
        result["profile"] = user.nurse.to_dict()

    return jsonify(result), 200
