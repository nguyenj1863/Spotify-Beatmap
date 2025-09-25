from flask import Blueprint, request

callback_bp = Blueprint('callback', __name__)

@callback_bp.route('/callback', methods=['POST', 'GET'])
def callback():
    code = request.args.get('code')
    state = request.args.get('state')
    error = request.args.get('error')
    if(error):
        return f"Error: {error}", 400
    return "Callback endpoint"