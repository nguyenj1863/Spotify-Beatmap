import os
import base64
import hashlib
import secrets
from flask import session
from urllib.parse import urlencode

# Retrieve Spotify client credentials from environment variables.
SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')

# Define the required Spotify OAuth scopes for this application.
SCOPE = 'user-read-private user-read-email'
AUTH_BASE = 'https://accounts.spotify.com/authorize'

def _pcke_from_verifier(verifier: str) -> str:
    """
    Create a code challenge from a code verifier using SHA256 and base64-url encoding.

    :param verifier: The PKCE code verifier.
    :type verifier: str
    :return: The code challenge to send to Spotify.
    :rtype: str

    This function implements the S256 transformation required by the PKCE extension to OAuth 2.0.
    """
    digest = hashlib.sha256(verifier.encode('ascii')).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b'=').decode('ascii')

def _make_code_verifier(n_bytes: int = 64) -> str:
    """
    Generate a secure random code verifier for PKCE.

    :param n_bytes: Number of random bytes to use for the verifier (default: 64).
    :type n_bytes: int
    :return: A base64-url encoded code verifier string.
    :rtype: str

    The code verifier is a cryptographically random string used in the PKCE flow.
    """
    return base64.urlsafe_b64encode(os.urandom(n_bytes)).rstrip(b'=').decode('ascii')

def get_auth_url() -> str:
    """
    Generate the Spotify authorization URL for the OAuth 2.0 Authorization Code Flow with PKCE.

    :return: The full Spotify authorization URL to redirect the user to.
    :rtype: str
    :raises ValueError: If the Spotify client ID or redirect URI is missing.

    This function generates a unique state and code verifier for each authorization request,
    stores them in the Flask session, and constructs the authorization URL with the required
    parameters. The code challenge is derived from the code verifier using the S256 method.
    """
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_REDIRECT_URI:
        raise ValueError("Missing Spotify client ID or redirect URI")
    
    # Generate a random state parameter for CSRF protection.
    state = secrets.token_urlsafe(16)
    # Generate a PKCE code verifier and corresponding code challenge.
    code_verifier = _make_code_verifier()
    code_challenge = _pcke_from_verifier(code_verifier)

    # Store state and code verifier in the session for later validation.
    session['oauth_state'] = state
    session['pkce_code_verifier'] = code_verifier

    # Prepare the query parameters for the authorization URL.
    params = {
        'response_type': 'code',
        'client_id': SPOTIFY_CLIENT_ID,
        'scope': SCOPE,
        'code_challenge_method': 'S256',
        'code_challenge': code_challenge,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
    }
    
    # Construct the full authorization URL.
    auth_url = f"{AUTH_BASE}?{urlencode(params)}"

    return auth_url

