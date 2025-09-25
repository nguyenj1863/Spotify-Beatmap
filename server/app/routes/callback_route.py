from flask import Blueprint

callback_bp = Blueprint('callback', __name__)

@callback_bp.route('/callback')
def callback():
    return "Callback endpoint"