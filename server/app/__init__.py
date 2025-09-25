# server/app/__init__.py
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    from .auth_routes import auth_bp

    app.register_blueprint(auth_bp, url_prefix='/api/spotify')

    return app
