from transformers import pipeline
import sqlite3
import json
import os
from dotenv import load_dotenv

load_dotenv()
INSTA_USER_ID = os.getenv('INSTA_USER_ID')

# Initialize the emotion detection model using a pre-trained DistilRoBERTa-based classifier
emotion_model = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

def get_all_comments(db_file):
    """
    Retrieves all comments from the SQLite database for a given Instagram user.

    Parameters:
        db_file (str): The path to the SQLite database file.
        insta_user_id (str): The Instagram user ID whose comments should be retrieved.

    Returns:
        list: A list of comment texts.

    Process:
    1. Establish a connection to the SQLite database.
    2. Execute an SQL query to fetch non-null comments from the user's table.
    3. Parse the JSON-formatted comments stored in the database.
    4. Extract and return individual comment texts.
    5. Handle database errors gracefully and ensure the connection is closed.
    """
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()    
    query = f"SELECT comments FROM user{INSTA_USER_ID} WHERE comments IS NOT NULL;"
    
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        comments = []
        for row in rows:
            comments_section = json.loads(row[0])  
            for post in comments_section:
                comment = post['text']
                comments.append(comment)
        
        return comments
    except sqlite3.Error as err:
        print("Database error:", err)
        return []
    finally:
        conn.close()

def detect_emotions_for_comments_from_db():
    """
    Detects emotions for all comments retrieved from the database.

    Returns:
        list: A list of detected emotion labels for each comment.

    Process:
    1. Calls `get_all_comments()` to fetch comments from the database.
    2. Uses the pre-trained DistilRoBERTa emotion detection model to classify each comment.
    3. Extracts the predicted emotion label for each comment and returns them as a list.
    4. If no comments are found, returns an empty list.
    """
    comments = get_all_comments('instagram_data.sqlite')
    if not comments:
        return []
    
    emotions = [emotion_model(comment)[0]['label'] for comment in comments]
    
    return emotions
