from flask import Flask, request, jsonify
from flask_cors import CORS 
from datetime import datetime

app = Flask(__name__)
CORS(app)
global schedules
schedules = []
@app.route('/feed', methods=['POST'])
def feed():
    print('FEEDING')
    response = jsonify(status='success')
    return response, 200

@app.route('/schedule', methods=['POST'])
def update_schedules():
    data = request.get_json()
    print(data['schedules'])
    # convert string like '6:00 PM', '8:00 AM' to time
    global schedules
    schedules = []
    for schedule in data['schedules']:
        schedules.append(datetime.strptime(schedule, '%I:%M %p').time())
    response = jsonify(status='success')
    print(schedules)
    return response, 200

if __name__ == '__main__':
    app.run(debug=True)
