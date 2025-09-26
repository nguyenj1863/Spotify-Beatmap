import os 
import requests

# Retrieve Spotify client credentials from environment variables.
# These should be set in your environment before running the application.
CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')

def get_access_token(code: str, code_verifier: str) -> dict:
    """
    Exchange an authorization code and code verifier for an access token from Spotify.

    :param code: The authorization code received from Spotify's authorization flow.
    :type code: str
    :param code_verifier: The code verifier used in the PKCE flow.
    :type code_verifier: str
    :return: The JSON response containing the access token and related information.
    :rtype: dict
    :raises HTTPError: If the request to Spotify's token endpoint fails.

    This function implements the final step of the OAuth 2.0 Authorization Code Flow with PKCE.
    It should be called after the user has authorized the application and you have received
    an authorization code. The code_verifier must match the one used to generate the code_challenge
    during the initial authorization request.
    """
    url = 'https://accounts.spotify.com/api/token'
    data = {
        'client_id': CLIENT_ID,  # Spotify application client ID
        'grant_type': 'authorization_code',  # OAuth2 grant type
        'code': code,  # Authorization code received from Spotify
        'redirect_uri': REDIRECT_URI,  # Must match the redirect URI used in the authorization request
        'code_verifier': code_verifier,  # PKCE code verifier
    }

    # Make a POST request to Spotify's token endpoint to exchange the code for an access token.
    # If the request fails (e.g., invalid code or verifier), an HTTPError will be raised.
    resp = requests.post(url, data=data, timeout=15)
    resp.raise_for_status()
    
    # Return the JSON response, which includes the access token, refresh token, and expiration.
    return resp.json()