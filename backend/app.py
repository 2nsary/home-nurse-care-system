"""
Home Nurse Care System — Flask Application Entry Point.
Initializes Flask app, registers blueprints, and runs the development server.
"""

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db


def create_app():
    """Application factory — creates and configures the Flask app."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)
    JWTManager(app)

    # Register controller blueprints
    from controllers.auth_controller import auth_bp
    from controllers.patient_controller import patient_bp
    from controllers.nurse_controller import nurse_bp
    from controllers.booking_controller import booking_bp
    from controllers.payment_controller import payment_bp
    from controllers.review_controller import review_bp
    from controllers.admin_controller import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(patient_bp)
    app.register_blueprint(nurse_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(admin_bp)

    # Create database tables on first request
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    print("\n  Home Nurse Care System API")
    print("  Running on http://127.0.0.1:5000\n")
    app.run(debug=True, port=5000)
