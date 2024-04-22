from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

global schedules
schedules = []
@app.route('/api/feed', methods=['POST'])
def feed():
    print('FEEDING')
    response = jsonify(status='success')
    return response, 200

@app.route('/api/schedule', methods=['POST'])
def update_schedules():
    data = request.get_json()
    print(data['schedules'])
    # convert string like '6:00 PM', '8:00 AM' to time
    global schedules
    schedules = []
    for schedule in data['schedules']:
        schedules.append(datetime.strptime(schedule, '%I:%M %p').time())
    response = jsonify(status='success')
    # print(schedules)
    return response, 200

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=5432)