"""
Nurse Model — Extended profile for users with 'nurse' role.
"""

from models import db


class Nurse(db.Model):
    __tablename__ = "nurses"

    nurse_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False, unique=True)
    specialization = db.Column(db.String(100), nullable=True, default="General Care")
    experience = db.Column(db.Integer, nullable=True, default=0)  # years
    availability = db.Column(db.Boolean, default=True)
    hourly_rate = db.Column(db.Float, nullable=True, default=50.0)
    bio = db.Column(db.Text, nullable=True)

    # Relationships
    bookings = db.relationship("Booking", backref="nurse", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        """Serialize nurse profile with user info."""
        # Calculate average rating from completed bookings
        avg_rating = 0
        review_count = 0
        for booking in self.bookings:
            if booking.review:
                avg_rating += booking.review.rating
                review_count += 1
        if review_count > 0:
            avg_rating = round(avg_rating / review_count, 1)

        return {
            "nurse_id": self.nurse_id,
            "user_id": self.user_id,
            "specialization": self.specialization,
            "experience": self.experience,
            "availability": self.availability,
            "hourly_rate": self.hourly_rate,
            "bio": self.bio,
            "full_name": self.user.full_name if self.user else None,
            "email": self.user.email if self.user else None,
            "phone": self.user.phone if self.user else None,
            "avg_rating": avg_rating,
            "review_count": review_count,
        }
