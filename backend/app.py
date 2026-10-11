import sys
import os

# Allow importing files from project root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask, request, jsonify
from flask_cors import CORS

from chatbot import detect_mood

from recommendation.recommendation import (
    recommend_by_mood,
    recommend_by_option,
    recommend_song,
    search_song,
    explorer_songs,
    get_genres,
    OPTION_GENRES,
    df
)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response



# ==========================================
# Home
# ==========================================

@app.route("/")
def home():
    return "MoodTune AI Backend Running Successfully!"


# ==========================================
# Chatbot Recommendation
# ==========================================

@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    message = data.get("message", "").strip()
    clean_msg = message.lower()

    # If the user typed an option directly
    for opt_name in OPTION_GENRES.keys():
        if opt_name.lower() in clean_msg or clean_msg == opt_name.lower():
            songs = recommend_by_option(opt_name)
            return jsonify({
                "mood": opt_name,
                "is_option": True,
                "songs": songs
            })

    mood = detect_mood(message)
    songs = recommend_by_mood(mood)

    return jsonify({
        "mood": mood,
        "is_option": False,
        "songs": songs
    })



# ==========================================
# Chatbot Sub-Option Recommendation
# ==========================================

@app.route("/recommend-option", methods=["POST"])
def recommend_option_api():

    data = request.get_json()

    if not data:
        return jsonify([])

    option = data.get("option", "")
    mood = data.get("mood", "")

    songs = recommend_by_option(option, mood)

    return jsonify(songs)


# ==========================================
# Recommend Similar Songs
# ==========================================

@app.route("/recommend-song", methods=["POST"])
def recommend_song_api():

    data = request.get_json()

    if not data:
        return jsonify([])

    song_name = data.get("song", "")

    songs = recommend_song(song_name)

    return jsonify(songs)


# ==========================================
# Search Songs
# ==========================================

@app.route("/search", methods=["GET"])
def search():

    query = request.args.get("q", "").lower()
    genre = request.args.get("genre", "").lower()

    results = df.copy()

    # Search by song OR artist
    if query:

        results = results[
            results["track_name"].str.lower().str.contains(query, na=False)
            |
            results["artists"].str.lower().str.contains(query, na=False)
        ]

    # Filter by genre
    if genre and genre != "all genres":

        results = results[
            results["track_genre"].str.lower() == genre
        ]

    results = results.sort_values(
        by="popularity",
        ascending=False
    ).head(20)

    songs = []

    for _, row in results.iterrows():

        songs.append({

            "Song": row["track_name"],
            "Artist": row["artists"],
            "Genre": row["track_genre"]

        })

    return jsonify(songs)


# ==========================================
# Explorer Songs
# ==========================================

@app.route("/explorer", methods=["GET"])
def explorer():

    songs = explorer_songs()

    return jsonify(songs)


# ==========================================
# Genres
# ==========================================

@app.route("/genres", methods=["GET"])
def genres():

    return jsonify(get_genres())


# ==========================================
# Mood Recommendation API
# ==========================================

# ==========================================
# Genre Filter
# ==========================================

@app.route("/genre/<genre>", methods=["GET"])
def genre_filter(genre):

    songs = df[
        df["track_genre"].str.lower() == genre.lower()
    ]

    results = []

    for _, row in songs.head(20).iterrows():

        results.append({

            "Song": row["track_name"],
            "Artist": row["artists"],
            "Genre": row["track_genre"]

        })

    return jsonify(results)
# ==========================================
# Mood Recommendation API
# ==========================================

@app.route("/mood/<mood>", methods=["GET"])
def mood_api(mood):

    songs = recommend_by_mood(mood)

    return jsonify(songs)
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)