import os
import base64
import hashlib
from urllib.parse import urlencode

SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')

SCOPE = 'user-read-private user-read-email'
AUTH_BASE = 'https://accounts.spotify.com/authorize'

def make_pkce_pair(n_bytes: int = 64):
    verifier = base64.urlsafe_b64encode(os.urandom(n_bytes)).rstrip(b'=').decode('ascii')
    digest = hashlib.sha256(verifier.encode('ascii')).digest()
    challenge = base64.urlsafe_b64encode(digest).rstrip(b'=').decode('ascii')
    return verifier, challenge

CODE_VERIFIER, CODE_CHALLENGE = make_pkce_pair()

params = {
    'response_type': 'code',
    'client_id': SPOTIFY_CLIENT_ID,
    'scope': SCOPE,
    'code_challenge_method': 'S256',
    'code_challenge': CODE_CHALLENGE,
    'redirect_uri': SPOTIFY_REDIRECT_URI,
}

AUTH_URL = f"{AUTH_BASE}?{urlencode(params)}"

def get_auth_url() -> str:
    return AUTH_URL

