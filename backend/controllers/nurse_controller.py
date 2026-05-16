"""
Nurse Controller — Nurse listing, search, profile management, and availability.
Endpoints:
  GET  /api/nurses              — List/search nurses (public)
  GET  /api/nurses/<id>         — Get nurse profile by ID (public)
  PUT  /api/nurses/profile      — Update own nurse profile
  PUT  /api/nurses/availability — Toggle own availability
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User
from models.nurse import Nurse
from utils.decorators import role_required

nurse_bp = Blueprint("nurse", __name__, url_prefix="/api/nurses")


@nurse_bp.route("", methods=["GET"])
def list_nurses():
    """List all nurses with optional search/filter."""
    specialization = request.args.get("specialization", "").strip()
    available_only = request.args.get("available", "").lower() == "true"
    search = request.args.get("search", "").strip()

    query = Nurse.query

    if specialization:
        query = query.filter(Nurse.specialization.ilike(f"%{specialization}%"))
    if available_only:
        query = query.filter(Nurse.availability == True)
    if search:
        # Search by nurse name via join
        query = query.join(User).filter(User.full_name.ilike(f"%{search}%"))

    nurses = query.all()
    return jsonify([n.to_dict() for n in nurses]), 200


@nurse_bp.route("/<int:nurse_id>", methods=["GET"])
def get_nurse(nurse_id):
    """Get a single nurse's full profile."""
    nurse = Nurse.query.get(nurse_id)
    if not nurse:
        return jsonify({"error": "Nurse not found."}), 404
    return jsonify(nurse.to_dict()), 200


@nurse_bp.route("/profile", methods=["PUT"])
@jwt_required()
@role_required("nurse")
def update_profile():
    """Update the current nurse's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or not user.nurse:
        return jsonify({"error": "Nurse profile not found."}), 404

    data = request.get_json()

    # Update user fields
    if data.get("full_name"):
        user.full_name = data["full_name"]
    if data.get("phone"):
        user.phone = data["phone"]

    # Update nurse-specific fields
    if data.get("specialization"):
        user.nurse.specialization = data["specialization"]
    if data.get("experience") is not None:
        user.nurse.experience = data["experience"]
    if data.get("hourly_rate") is not None:
        user.nurse.hourly_rate = data["hourly_rate"]
    if data.get("bio") is not None:
        user.nurse.bio = data["bio"]

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully.",
        "profile": user.nurse.to_dict(),
    }), 200


@nurse_bp.route("/availability", methods=["PUT"])
@jwt_required()
@role_required("nurse")
def toggle_availability():
    """Toggle nurse availability status."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or not user.nurse:
        return jsonify({"error": "Nurse profile not found."}), 404

    data = request.get_json()
    if "availability" in data:
        user.nurse.availability = bool(data["availability"])
    else:
        # Toggle if no explicit value provided
        user.nurse.availability = not user.nurse.availability

    db.session.commit()

    return jsonify({
        "message": f"Availability set to {'Available' if user.nurse.availability else 'Unavailable'}.",
        "availability": user.nurse.availability,
    }), 200
