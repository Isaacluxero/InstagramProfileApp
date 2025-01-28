import tensorflow_hub as hub
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def categorize_hashtags(hashtags):
    # Predefined categories and their descriptions
    categories = {
        "Lifestyle": "Keywords related to daily life, routine, and lifestyle.",
        "Fitness": "Keywords related to health, gym, and workout.",
        "Food": "Keywords related to food, cooking, and recipes.",
        "Travel": "Keywords related to travel, vacation, and wanderlust."
    }

    # Load the Universal Sentence Encoder model
    print("Loading Universal Sentence Encoder model...")
    model = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

    # Generate embeddings for category descriptions and hashtags
    category_keys = list(categories.keys())
    category_descriptions = list(categories.values())
    category_embeddings = model(category_descriptions)
    hashtag_embeddings = model(hashtags)

    # Match hashtags to categories based on cosine similarity
    categorized_hashtags = {key: [] for key in category_keys}
    for i, hashtag_embedding in enumerate(hashtag_embeddings):
        similarities = cosine_similarity(
            [hashtag_embedding.numpy()],
            category_embeddings.numpy()
        )[0]
        best_match_idx = np.argmax(similarities)
        best_category = category_keys[best_match_idx]
        categorized_hashtags[best_category].append(hashtags[i])

    return categorized_hashtags

# Example Usage
hashtags = ["#gym", "#recipe", "#beach", "#yoga", "#wanderlust", "#healthyfood"]
categorized = categorize_hashtags(hashtags)
print("Categorized Hashtags:", categorized)
     