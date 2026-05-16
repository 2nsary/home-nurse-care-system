"""
Booking Controller — Create, list, and manage booking requests.
Endpoints:
  POST /api/bookings              — Create a new booking (patient)
  GET  /api/bookings              — List bookings (role-based filtering)
  GET  /api/bookings/<id>         — Get single booking details
  PUT  /api/bookings/<id>/status  — Update booking status (accept/reject/cancel/complete)
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User
from models.booking import Booking
from models.nurse import Nurse
from utils.decorators import role_required

booking_bp = Blueprint("booking", __name__, url_prefix="/api/bookings")


@booking_bp.route("", methods=["POST"])
@jwt_required()
@role_required("patient")
def create_booking():
    """Create a new booking request."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or not user.patient:
        return jsonify({"error": "Patient profile not found."}), 404

    data = request.get_json()

    # Validate required fields
    required = ["nurse_id", "booking_date", "booking_time"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required."}), 400

    # Check nurse exists and is available
    nurse = Nurse.query.get(data["nurse_id"])
    if not nurse:
        return jsonify({"error": "Nurse not found."}), 404
    if not nurse.availability:
        return jsonify({"error": "This nurse is currently unavailable."}), 400

    booking = Booking(
        patient_id=user.patient.patient_id,
        nurse_id=nurse.nurse_id,
        booking_date=data["booking_date"],
        booking_time=data["booking_time"],
        duration_hours=data.get("duration_hours", 1),
        notes=data.get("notes", ""),
        status="pending",
    )
    db.session.add(booking)
    db.session.commit()

    return jsonify({
        "message": "Booking created successfully.",
        "booking": booking.to_dict(),
    }), 201


@booking_bp.route("", methods=["GET"])
@jwt_required()
def list_bookings():
    """List bookings based on user role."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found."}), 404

    if user.role == "patient" and user.patient:
        bookings = Booking.query.filter_by(patient_id=user.patient.patient_id).order_by(Booking.created_at.desc()).all()
    elif user.role == "nurse" and user.nurse:
        bookings = Booking.query.filter_by(nurse_id=user.nurse.nurse_id).order_by(Booking.created_at.desc()).all()
    elif user.role == "admin":
        bookings = Booking.query.order_by(Booking.created_at.desc()).all()
    else:
        bookings = []

    return jsonify([b.to_dict() for b in bookings]), 200


@booking_bp.route("/<int:booking_id>", methods=["GET"])
@jwt_required()
def get_booking(booking_id):
    """Get a single booking's details."""
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found."}), 404
    return jsonify(booking.to_dict()), 200


@booking_bp.route("/<int:booking_id>/status", methods=["PUT"])
@jwt_required()
def update_booking_status(booking_id):
    """Update booking status (accept, reject, cancel, complete)."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found."}), 404

    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found."}), 404

    data = request.get_json()
    new_status = data.get("status", "").lower()

    valid_transitions = {
        "pending": ["accepted", "rejected", "cancelled"],
        "accepted": ["completed", "cancelled"],
    }

    allowed = valid_transitions.get(booking.status, [])
    if new_status not in allowed:
        return jsonify({"error": f"Cannot change status from '{booking.status}' to '{new_status}'."}), 400

    # Authorization checks
    if new_status in ("accepted", "rejected", "completed"):
        # Only the assigned nurse can accept/reject/complete
        if user.role != "nurse" or not user.nurse or user.nurse.nurse_id != booking.nurse_id:
            if user.role != "admin":
                return jsonify({"error": "Only the assigned nurse can perform this action."}), 403
    if new_status == "cancelled":
        # Patient or admin can cancel
        if user.role == "patient" and user.patient and user.patient.patient_id != booking.patient_id:
            return jsonify({"error": "You can only cancel your own bookings."}), 403

    booking.status = new_status
    db.session.commit()

    return jsonify({
        "message": f"Booking status updated to '{new_status}'.",
        "booking": booking.to_dict(),
    }), 200
