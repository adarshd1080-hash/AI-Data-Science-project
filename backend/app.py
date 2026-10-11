
import sys
import os

# Allow Python to import modules from the project root
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from flask import Flask, request, jsonify
from flask_cors import CORS

from chatbot import detect_mood

from recommendation.recommendation import (
    recommend_by_mood,
    recommend_song,
    search_song,
    explorer_songs,
    get_genres,
    df
)

app = Flask(__name__)
CORS(app)


# ==========================================
# Home
# ==========================================

@app.route("/")
def home():
    return "MoodTune AI Backend Running Successfully!"


# ==========================================
# Chatbot Recommendations
# ==========================================

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json(silent=True) or {}

    message = str(data.get("message", "")).strip()
    mode = str(data.get("mode", "Match My Mood")).strip()

    if not message:
        return jsonify({"error": "Please enter a message."}), 400

    try:
        # Detect the user's emotion
        mood = detect_mood(message)

        # Generate songs for the selected mode
        songs = recommend_by_mood(
            mood,
            n=5,
            mode=mode
        )

        return jsonify({
            "mood": mood,
            "mode": mode,
            "songs": songs
        })

    except Exception as error:
        app.logger.exception("Recommendation failed")
        return jsonify({
            "error": "Unable to generate recommendations.",
            "details": str(error)
        }), 500


# ==========================================
# Recommend Similar Songs
# ==========================================

@app.route("/recommend-song", methods=["POST"])
def recommend_song_api():
    data = request.get_json(silent=True) or {}
    song_name = str(data.get("song", "")).strip()

    if not song_name:
        return jsonify([])

    try:
        return jsonify(recommend_song(song_name))
    except Exception:
        app.logger.exception("Similar-song recommendation failed")
        return jsonify({"error": "Could not find similar songs."}), 500


# ==========================================
# Search Songs
# ==========================================

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify([])

    return jsonify(search_song(query))


# ==========================================
# Explorer Songs
# ==========================================

@app.route("/explorer", methods=["GET"])
def explorer():
    return jsonify(explorer_songs())


# ==========================================
# Genres
# ==========================================

@app.route("/genres", methods=["GET"])
def genres():
    return jsonify(get_genres())


# ==========================================
# Genre Filter
# ==========================================

@app.route("/genre/<genre>", methods=["GET"])
def genre_filter(genre):
    songs = df[
        df["track_genre"].astype(str).str.lower() == genre.lower()
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
# Run Backend
# ==========================================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
