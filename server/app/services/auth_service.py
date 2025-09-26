import os
import base64
import hashlib
import secrets
from flask import session
from urllib.parse import urlencode

SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')

SCOPE = 'user-read-private user-read-email'
AUTH_BASE = 'https://accounts.spotify.com/authorize'

def _pcke_from_verifier(verifier: str) -> str:
    digest = hashlib.sha256(verifier.encode('ascii')).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b'=').decode('ascii')

def _make_code_verifier(n_bytes: int = 64) -> str:
    return base64.urlsafe_b64encode(os.urandom(n_bytes)).rstrip(b'=').decode('ascii')

def get_auth_url() -> str:
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_REDIRECT_URI:
        raise ValueError("Missing Spotify client ID or redirect URI")
    
    state = secrets.token_urlsafe(16)
    code_verifier = _make_code_verifier()
    code_challenge = _pcke_from_verifier(code_verifier)

    session['oauth_state'] = state
    session['pkce_code_verifier'] = code_verifier

    params = {
        'response_type': 'code',
        'client_id': SPOTIFY_CLIENT_ID,
        'scope': SCOPE,
        'code_challenge_method': 'S256',
        'code_challenge': code_challenge,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
    }
    
    auth_url = f"{AUTH_BASE}?{urlencode(params)}"

    return auth_url

