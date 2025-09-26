from flask import Blueprint, request, session, jsonify
from app.services.token_service import get_access_token

callback_bp = Blueprint('callback', __name__)

@callback_bp.route('/callback')
def callback():
    code = request.args.get('code')
    code_verifier = session.pop('pkce_code_verifier', None)
    
    if not code:
        return jsonify({"error": "Missing code"}), 400
    if not code_verifier:
        return jsonify({"error": "Missing code_verifier"}), 400
    
    tokens = get_access_token(code, code_verifier)

    return jsonify(tokens)