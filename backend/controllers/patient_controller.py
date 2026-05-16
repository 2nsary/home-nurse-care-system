"""
Patient Controller — Manages patient profile operations.
Endpoints:
  GET  /api/patients/profile  — Get current patient's profile
  PUT  /api/patients/profile  — Update patient profile
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User
from models.patient import Patient
from utils.decorators import role_required

patient_bp = Blueprint("patient", __name__, url_prefix="/api/patients")


@patient_bp.route("/profile", methods=["GET"])
@jwt_required()
@role_required("patient")
def get_profile():
    """Get the current patient's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or not user.patient:
        return jsonify({"error": "Patient profile not found."}), 404

    return jsonify(user.patient.to_dict()), 200


@patient_bp.route("/profile", methods=["PUT"])
@jwt_required()
@role_required("patient")
def update_profile():
    """Update the current patient's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or not user.patient:
        return jsonify({"error": "Patient profile not found."}), 404

    data = request.get_json()

    # Update user fields
    if data.get("full_name"):
        user.full_name = data["full_name"]
    if data.get("phone"):
        user.phone = data["phone"]

    # Update patient-specific fields
    if data.get("address"):
        user.patient.address = data["address"]
    if data.get("date_of_birth"):
        user.patient.date_of_birth = data["date_of_birth"]

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully.",
        "profile": user.patient.to_dict(),
    }), 200
