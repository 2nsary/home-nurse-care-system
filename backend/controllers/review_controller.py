"""
Review Controller — Submit and retrieve reviews for completed bookings.
Endpoints:
  POST /api/reviews              — Submit review for a completed booking
  GET  /api/reviews/nurse/<id>   — Get all reviews for a nurse
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User
from models.booking import Booking
from models.review import Review
from utils.decorators import role_required

review_bp = Blueprint("review", __name__, url_prefix="/api/reviews")


@review_bp.route("", methods=["POST"])
@jwt_required()
@role_required("patient")
def submit_review():
    """Submit a review for a completed booking."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or not user.patient:
        return jsonify({"error": "Patient profile not found."}), 404

    data = request.get_json()

    booking_id = data.get("booking_id")
    rating = data.get("rating")
    comment = data.get("comment", "")

    if not booking_id or not rating:
        return jsonify({"error": "'booking_id' and 'rating' are required."}), 400

    if not (1 <= int(rating) <= 5):
        return jsonify({"error": "Rating must be between 1 and 5."}), 400

    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found."}), 404

    if booking.patient_id != user.patient.patient_id:
        return jsonify({"error": "You can only review your own bookings."}), 403

    if booking.status != "completed":
        return jsonify({"error": "You can only review completed bookings."}), 400

    if booking.review:
        return jsonify({"error": "Review already submitted for this booking."}), 409

    review = Review(
        booking_id=booking.booking_id,
        rating=int(rating),
        comment=comment,
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({
        "message": "Review submitted successfully.",
        "review": review.to_dict(),
    }), 201


@review_bp.route("/nurse/<int:nurse_id>", methods=["GET"])
def get_nurse_reviews(nurse_id):
    """Get all reviews for a specific nurse."""
    bookings = Booking.query.filter_by(nurse_id=nurse_id).all()
    reviews = [b.review.to_dict() for b in bookings if b.review]
    return jsonify(reviews), 200
