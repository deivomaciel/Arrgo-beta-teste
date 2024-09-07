from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from threading import Thread
from classes.MessageAnnouncer import MessageAnnouncer
from classes.UserManager import UserManager

app = Flask(__name__)
CORS(app)

messageAnnouncer = MessageAnnouncer()
userManager = UserManager()

def format_sse(data: str, event=None):
    message = f'data: {data}\n\n'
    if event is not None:
        message = f'event: {event}\n{message}'
    return message


def send_message(message_type, data_message: str, user_id: int) -> None:
    object = {
        'id': user_id,
        'message': f'{message_type}|--|{data_message}'
    }
    
    message = format_sse(data=object)
    messageAnnouncer.announce(message)
    

@app.route('/')
def home():
    Thread(target=send_message('rqqwe', '12'), daemon=True).start()
    return 'ok'


@app.route('/get-code')
def get_code():
    user = userManager.get_code()
    return jsonify(user)


@app.route('/send-code', methods=['POST'])
def send_code():
    if request.is_json:
        data = request.get_json()
        totp_code = data['code']
        user_id = userManager.generate_id()

        user = list(filter(lambda user: user['code'] == totp_code, userManager.users))
        if len(user) == 0: return jsonify({'error': True, 'message': 'Code not found!'}), 403

        destiny_user = user[0]

        Thread(target=send_message('user_id', user_id, destiny_user['id']), daemon=True).start()
        userManager.remove_user(destiny_user)
        
        return jsonify({'error': False, 'destiny_id': destiny_user['id'], 'user_id': user_id})
    else:
        return jsonify({'data': 'Body not found!'}), 415


@app.route('/send-message', methods=['POST'])
def send_message_rote():
    if request.is_json:
        data = request.get_json()
        message = data['message']
        destiny_id = data['id']
        
        Thread(target=send_message(f'message', message, destiny_id), daemon=True).start()
        print(f'Message to {destiny_id}')
        return jsonify({'error': False, 'destiny_id': destiny_id, 'message': message})

    else:
        return jsonify({'data': 'Body not found!'}), 415
        

@app.route('/listen', methods=['GET'])
def listen():
    def stream():
        messages = messageAnnouncer.listen()
        while True:
            message = messages.get()
            yield message
    return Response(stream(), mimetype='text/event-stream')


if __name__ == '__main__':
    app.run(host='localhost', port=3001)
