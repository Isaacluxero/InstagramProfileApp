from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from helper_files.CommentsHelper import detect_emotions_for_comments_from_db

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/predict', methods=['GET'])
def predict():
    """
    Endpoint to predict emotions from comments stored in the database.
    It triggers the Detoxify model to analyze and classify emotions
    for each comment. In case of an error, an appropriate error message 
    is returned to the client.

    Returns:
        jsonify: A JSON response containing the predicted emotion results 
                 or an error message in case of failure.
    """
    try:
        # Run Detoxify model to detect emotions in comments
        result = detect_emotions_for_comments_from_db()
        return jsonify(result)
    except Exception as error:
        # Log error and send internal server error message to the client
        print(f"Error occurred during emotion detection: {error}")
        return jsonify({"message": "Internal server error while detecting emotions"}), 500

if __name__ == "__main__":
    # Define the port number for Flask app
    port = 3002
    print(f"Flask app is running on port {port}")
    try:
        # Run Flask app, listening for incoming connections on all network interfaces
        app.run(debug=True, host='0.0.0.0', port=port)
    except Exception as error:
        # Log any error that occurs during app startup
        print(f"Failed to start Flask app: {error}")
