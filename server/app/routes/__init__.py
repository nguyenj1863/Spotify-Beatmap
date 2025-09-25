from flask import Blueprint
from .auth_route import authorize_bp
from .callback_route import callback_bp

def init_routes(app):
    api=Blueprint('api', __name__, url_prefix='/api/spotify')
    for bp in [authorize_bp, callback_bp]:
        api.register_blueprint(bp)
    app.register_blueprint(api)