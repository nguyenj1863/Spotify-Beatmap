from flask import Blueprint, request, session, jsonify
from app.services.token_service import get_access_token

# Define a Flask Blueprint for the OAuth callback route.
callback_bp = Blueprint('callback', __name__)

@callback_bp.route('/callback')
def callback():
    """
    Flask route to handle the Spotify OAuth 2.0 callback.

    :return: A JSON response containing the access and refresh tokens, or an error message.
    :rtype: Response

    This endpoint is called by Spotify after the user authorizes the application.
    It retrieves the authorization code and PKCE code verifier from the request/session,
    exchanges them for access and refresh tokens, and returns the tokens as JSON.
    """
    code = request.args.get('code')  # Authorization code returned by Spotify
    code_verifier = session.pop('pkce_code_verifier', None)  # Retrieve and remove code verifier from session
    
    if not code:
        # If the code is missing, return an error response.
        return jsonify({"error": "Missing code"}), 400
    if not code_verifier:
        # If the code verifier is missing, return an error response.
        return jsonify({"error": "Missing code_verifier"}), 400
    
    # Exchange the authorization code and code verifier for tokens.
    tokens = get_access_token(code, code_verifier)

    # Return the tokens as a JSON response.
    return jsonify(tokens)