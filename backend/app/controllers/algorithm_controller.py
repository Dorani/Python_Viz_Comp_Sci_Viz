from flask import Blueprint, jsonify, request
from flask_socketio import emit
from app.services.algorithm_service import AlgorithmService
import threading
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

bp = Blueprint('algorithm', __name__)

@bp.route('/api/algorithms', methods=['GET'])
def get_algorithms():
    algorithms = AlgorithmService.get_algorithms()
    return jsonify(algorithms)

def execute_algorithm_thread(algorithm_name, input_data, socketio):
    try:
        if not algorithm_name:
            raise ValueError("Algorithm name is required.")

        if not isinstance(input_data, list):
            raise ValueError("Invalid input. Please provide a list of numbers.")
        
        input_list = [int(x) for x in input_data if isinstance(x, (int, float))]
        
        if not input_list:
            raise ValueError("Invalid input. Please provide a list of numbers.")

        for step in AlgorithmService.execute_algorithm(algorithm_name, input_list):
            if step is None:  # Algorithm was stopped or completed
                break
            logger.debug(f"Emitting step: {step}")
            socketio.emit('algorithm_step', step)
        
        logger.debug("Algorithm completed")
        socketio.emit('algorithm_complete', {'message': 'Algorithm execution completed'})
    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        socketio.emit('error', {'message': str(e)})
    except Exception as e:
        logger.error(f"Exception: {str(e)}")
        socketio.emit('error', {'message': f"An error occurred: {str(e)}"})

def register_socketio_events(socketio):
    @socketio.on('connect')
    def handle_connect():
        logger.debug('Client connected')

    @socketio.on('disconnect')
    def handle_disconnect():
        logger.debug('Client disconnected')

    @socketio.on('execute_algorithm')
    def handle_execute_algorithm(data):
        logger.debug(f'Received execute_algorithm request: {data}')
        algorithm_name = data.get('name')
        input_data = data.get('input')
        thread = threading.Thread(target=execute_algorithm_thread, args=(algorithm_name, input_data, socketio))
        thread.start()

    @socketio.on('stop_algorithm')
    def handle_stop_algorithm():
        logger.debug('Received stop_algorithm request')
        AlgorithmService.stop_algorithm()
        socketio.emit('algorithm_stopped', {'message': 'Algorithm execution stopped'})