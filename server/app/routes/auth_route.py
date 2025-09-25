from flask import Blueprint
from services.auth_service import get_auth_url

authorize_bp = Blueprint('auth', __name__)

@authorize_bp.route('/auth')
def authorize():
    auth_url = get_auth_url()
    return auth_url
