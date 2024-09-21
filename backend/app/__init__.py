from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})
    
    from .controllers.algorithm_controller import bp as algorithm_bp, register_socketio_events
    app.register_blueprint(algorithm_bp)

    socketio.init_app(app, cors_allowed_origins="http://localhost:3000", async_mode='threading')
    register_socketio_events(socketio)

    return app