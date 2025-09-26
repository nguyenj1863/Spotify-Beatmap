# server/app/__init__.py
from flask import Flask
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.secret_key = os.getenv("SECRET_KEY")
    
    from app.routes import init_routes
    init_routes(app)

    return app
