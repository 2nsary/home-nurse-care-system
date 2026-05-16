"""
Admin Controller — System administration endpoints.
Endpoints:
  GET    /api/admin/users       — List all users
  DELETE /api/admin/users/<id>  — Remove a user
  GET    /api/admin/stats       — System statistics
  GET    /api/admin/reports     — Report data
"""

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import db
from models.user import User
from models.patient import Patient
from models.nurse import Nurse
from models.booking import Booking
from models.payment import Payment
from models.review import Review
from utils.decorators import role_required

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@role_required("admin")
def list_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@admin_bp.route("/users/<int:uid>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_user(uid):
    user = User.query.get(uid)
    if not user:
        return jsonify({"error": "User not found."}), 404
    if user.role == "admin":
        return jsonify({"error": "Cannot delete admin accounts."}), 403
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully."}), 200


@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_stats():
    total_users = User.query.count()
    total_patients = Patient.query.count()
    total_nurses = Nurse.query.count()
    total_bookings = Booking.query.count()
    pending = Booking.query.filter_by(status="pending").count()
    accepted = Booking.query.filter_by(status="accepted").count()
    completed = Booking.query.filter_by(status="completed").count()
    cancelled = Booking.query.filter_by(status="cancelled").count()
    total_revenue = db.session.query(db.func.sum(Payment.amount)).filter_by(payment_status="completed").scalar() or 0

    return jsonify({
        "total_users": total_users,
        "total_patients": total_patients,
        "total_nurses": total_nurses,
        "total_bookings": total_bookings,
        "pending_bookings": pending,
        "accepted_bookings": accepted,
        "completed_bookings": completed,
        "cancelled_bookings": cancelled,
        "total_revenue": total_revenue,
    }), 200


@admin_bp.route("/reports", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_reports():
    bookings = Booking.query.order_by(Booking.created_at.desc()).limit(50).all()
    return jsonify([b.to_dict() for b in bookings]), 200
