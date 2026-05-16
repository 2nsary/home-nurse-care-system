"""
Database Seeder — Populates the database with sample data for testing.
Run:  python seed.py
"""

from app import create_app
from models import db
from models.user import User
from models.patient import Patient
from models.nurse import Nurse
from models.booking import Booking
from models.payment import Payment
from models.review import Review

app = create_app()

with app.app_context():
    # Clear existing data
    db.drop_all()
    db.create_all()

    # ── Admin ──
    admin = User(full_name="Admin User", email="admin@homenurse.com", phone="0100000000", role="admin")
    admin.set_password("admin123")
    db.session.add(admin)

    # ── Nurses ──
    nurses_data = [
        {"name": "Sarah Johnson", "email": "sarah@homenurse.com", "phone": "0111111111",
         "spec": "Elderly Care", "exp": 8, "rate": 65.0, "bio": "Specialized in geriatric and elderly home care with 8 years of experience."},
        {"name": "Ahmed Hassan", "email": "ahmed@homenurse.com", "phone": "0122222222",
         "spec": "Pediatric Care", "exp": 5, "rate": 55.0, "bio": "Expert in pediatric nursing and child healthcare services."},
        {"name": "Fatma Ali", "email": "fatma@homenurse.com", "phone": "0133333333",
         "spec": "Post-Surgery Care", "exp": 10, "rate": 80.0, "bio": "Experienced in post-operative care and rehabilitation nursing."},
        {"name": "Mohamed Nabil", "email": "mohamed@homenurse.com", "phone": "0144444444",
         "spec": "General Care", "exp": 3, "rate": 45.0, "bio": "Providing compassionate general home nursing care."},
        {"name": "Nour Ibrahim", "email": "nour@homenurse.com", "phone": "0155555555",
         "spec": "Chronic Disease Management", "exp": 7, "rate": 70.0, "bio": "Specialized in diabetes, hypertension, and chronic disease management."},
    ]

    nurse_objects = []
    for nd in nurses_data:
        u = User(full_name=nd["name"], email=nd["email"], phone=nd["phone"], role="nurse")
        u.set_password("nurse123")
        db.session.add(u)
        db.session.flush()
        n = Nurse(user_id=u.user_id, specialization=nd["spec"], experience=nd["exp"],
                  hourly_rate=nd["rate"], bio=nd["bio"], availability=True)
        db.session.add(n)
        db.session.flush()
        nurse_objects.append(n)

    # ── Patients ──
    patients_data = [
        {"name": "Omar Khaled", "email": "omar@patient.com", "phone": "0166666666",
         "addr": "123 Nile Street, Cairo", "dob": "1985-03-15"},
        {"name": "Mona Saeed", "email": "mona@patient.com", "phone": "0177777777",
         "addr": "456 Corniche Road, Alexandria", "dob": "1990-07-22"},
        {"name": "Youssef Tarek", "email": "youssef@patient.com", "phone": "0188888888",
         "addr": "789 Garden City, Giza", "dob": "1978-11-05"},
    ]

    patient_objects = []
    for pd in patients_data:
        u = User(full_name=pd["name"], email=pd["email"], phone=pd["phone"], role="patient")
        u.set_password("patient123")
        db.session.add(u)
        db.session.flush()
        p = Patient(user_id=u.user_id, address=pd["addr"], date_of_birth=pd["dob"])
        db.session.add(p)
        db.session.flush()
        patient_objects.append(p)

    # ── Bookings ──
    bookings_data = [
        {"pi": 0, "ni": 0, "date": "2026-05-20", "time": "09:00", "dur": 3, "status": "completed"},
        {"pi": 0, "ni": 2, "date": "2026-05-22", "time": "14:00", "dur": 2, "status": "accepted"},
        {"pi": 1, "ni": 1, "date": "2026-05-25", "time": "10:00", "dur": 2, "status": "pending"},
        {"pi": 1, "ni": 3, "date": "2026-05-18", "time": "08:00", "dur": 4, "status": "completed"},
        {"pi": 2, "ni": 4, "date": "2026-05-28", "time": "11:00", "dur": 1, "status": "pending"},
        {"pi": 2, "ni": 0, "date": "2026-05-15", "time": "16:00", "dur": 2, "status": "completed"},
    ]

    booking_objects = []
    for bd in bookings_data:
        b = Booking(patient_id=patient_objects[bd["pi"]].patient_id,
                    nurse_id=nurse_objects[bd["ni"]].nurse_id,
                    booking_date=bd["date"], booking_time=bd["time"],
                    duration_hours=bd["dur"], status=bd["status"],
                    notes="Sample booking for testing.")
        db.session.add(b)
        db.session.flush()
        booking_objects.append(b)

    # ── Payments for completed bookings ──
    for b in booking_objects:
        if b.status == "completed":
            nurse = Nurse.query.get(b.nurse_id)
            amt = (nurse.hourly_rate or 50) * (b.duration_hours or 1)
            pay = Payment(booking_id=b.booking_id, amount=amt,
                          payment_method="credit_card", payment_status="completed")
            db.session.add(pay)

    # ── Reviews for completed bookings ──
    reviews = [
        {"bi": 0, "rating": 5, "comment": "Sarah was wonderful! Very professional and caring."},
        {"bi": 3, "rating": 4, "comment": "Mohamed did a great job. Would recommend."},
        {"bi": 5, "rating": 5, "comment": "Excellent service from Sarah again. Very attentive."},
    ]
    for rv in reviews:
        r = Review(booking_id=booking_objects[rv["bi"]].booking_id,
                   rating=rv["rating"], comment=rv["comment"])
        db.session.add(r)

    db.session.commit()
    print("Database seeded successfully!")
    print(f"  Admin:    admin@homenurse.com / admin123")
    print(f"  Nurses:   sarah@homenurse.com / nurse123  (and 4 more)")
    print(f"  Patients: omar@patient.com / patient123  (and 2 more)")
