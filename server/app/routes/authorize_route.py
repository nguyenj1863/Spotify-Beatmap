from flask import Blueprint

authorize_bp = Blueprint('authorize', __name__)

@authorize_bp.route('/authorize', methods=['GET'])
def authorize():
    return "Authorization endpoint"
