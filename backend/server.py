from flask import Flask, request, jsonify
from detoxify import Detoxify

app = Flask(__name__)

# Load the Detoxify model
detoxify_model = Detoxify('original')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Run Detoxify model
    result = detoxify_model.predict(text)
    
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
