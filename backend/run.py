from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from app import create_app
from app.controllers.algorithm_controller import register_socketio_events

app = create_app()
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000", allow_credentials=True)

register_socketio_events(socketio)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)