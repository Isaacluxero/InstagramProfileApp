from flask import Flask, request, jsonify
from helper_files.HashTagsHelper import categorize_hashtags
app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_data():
    data = request.json
    result = categorize_hashtags(data['input'])
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(port=5000)