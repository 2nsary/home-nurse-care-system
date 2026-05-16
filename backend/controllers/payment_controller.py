"""
Payment Controller — Process and track payments for bookings.
Endpoints:
  POST /api/payments       — Process payment for a booking
  GET  /api/payments       — List payment history
  GET  /api/payments/<id>  — Get payment details
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User
from models.payment import Payment
from models.booking import Booking
from utils.decorators import role_required

payment_bp = Blueprint("payment", __name__, url_prefix="/api/payments")


@payment_bp.route("", methods=["POST"])
@jwt_required()
@role_required("patient")
def process_payment():
    """Process payment for a booking (simulated)."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or not user.patient:
        return jsonify({"error": "Patient profile not found."}), 404

    data = request.get_json()

    booking_id = data.get("booking_id")
    if not booking_id:
        return jsonify({"error": "'booking_id' is required."}), 400

    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found."}), 404

    if booking.patient_id != user.patient.patient_id:
        return jsonify({"error": "You can only pay for your own bookings."}), 403

    if booking.payment:
        return jsonify({"error": "Payment already exists for this booking."}), 409

    if booking.status not in ("accepted", "completed"):
        return jsonify({"error": "Booking must be accepted before payment."}), 400

    # Calculate amount based on nurse hourly rate and duration
    amount = (booking.nurse.hourly_rate or 50) * (booking.duration_hours or 1)

    payment = Payment(
        booking_id=booking.booking_id,
        amount=data.get("amount", amount),
        payment_method=data.get("payment_method", "credit_card"),
        payment_status="completed",  # Simulated — instant success
    )
    db.session.add(payment)
    db.session.commit()

    return jsonify({
        "message": "Payment processed successfully.",
        "payment": payment.to_dict(),
    }), 201


@payment_bp.route("", methods=["GET"])
@jwt_required()
def list_payments():
    """List payments for the current user."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found."}), 404

    if user.role == "patient" and user.patient:
        bookings = Booking.query.filter_by(patient_id=user.patient.patient_id).all()
        payments = [b.payment.to_dict() for b in bookings if b.payment]
    elif user.role == "nurse" and user.nurse:
        bookings = Booking.query.filter_by(nurse_id=user.nurse.nurse_id).all()
        payments = [b.payment.to_dict() for b in bookings if b.payment]
    elif user.role == "admin":
        payments = [p.to_dict() for p in Payment.query.all()]
    else:
        payments = []

    return jsonify(payments), 200


@payment_bp.route("/<int:payment_id>", methods=["GET"])
@jwt_required()
def get_payment(payment_id):
    """Get a single payment's details."""
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Payment not found."}), 404
    return jsonify(payment.to_dict()), 200
