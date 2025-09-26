from flask import Blueprint, redirect
from app.services.auth_service import get_auth_url

authorize_bp = Blueprint('auth', __name__)

@authorize_bp.route('/auth')
def authorize():
    auth_url = get_auth_url()
    return redirect(auth_url)
