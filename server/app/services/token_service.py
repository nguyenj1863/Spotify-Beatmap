import os 
import requests

CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')

def get_access_token(code: str, code_verifier: str) -> dict:
    url = 'https://accounts.spotify.com/api/token'
    data = {
        'client_id': CLIENT_ID,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'code_verifier': code_verifier,
    }

    resp = requests.post(url, data=data, timeout=15)
    resp.raise_for_status()
    return resp.json()