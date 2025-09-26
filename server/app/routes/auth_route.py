from flask import Blueprint, redirect
from app.services.auth_service import get_auth_url

# Define a Flask Blueprint for authentication-related routes.
authorize_bp = Blueprint('auth', __name__)

@authorize_bp.route('/auth')
def authorize():
    """
    Flask route to initiate the Spotify OAuth 2.0 Authorization Code Flow with PKCE.

    :return: A redirect response to the Spotify authorization URL.
    :rtype: Response

    This endpoint generates the Spotify authorization URL using the helper function
    from the auth_service module and redirects the user to Spotify's login/consent page.
    """
    auth_url = get_auth_url()  # Generate the authorization URL with PKCE and state
    return redirect(auth_url)  # Redirect the user to Spotify for authentication
