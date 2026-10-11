import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import os

# ==========================================
# Load Dataset
# ==========================================

DATASET_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "dataset",
    "spotify_20000.csv"
)

df = pd.read_csv(DATASET_PATH)

# Remove missing values
df = df.dropna()

# ==========================================
# Features
# ==========================================

FEATURES = [
    "danceability",
    "energy",
    "loudness",
    "speechiness",
    "acousticness",
    "instrumentalness",
    "liveness",
    "valence",
    "tempo"
]

# ==========================================
# Scale Features
# ==========================================

scaler = StandardScaler()

scaled_features = scaler.fit_transform(df[FEATURES])

similarity_matrix = cosine_similarity(scaled_features)

# ==========================================
# Mood Mapping
# ==========================================

# ==========================================
# Mood Mapping
# ==========================================

MOOD_GENRES = {
    "Happy": ["happy", "pop", "dance"],
    "Sad": ["sad", "acoustic"],
    "Relax": ["chill", "sleep", "acoustic"],
    "Energetic": ["edm", "electronic", "rock", "dance"],
    "Romantic": ["romance", "r-n-b", "pop"],
    "Stressed": ["chill", "sleep", "classical"],
    "Focus": ["classical", "chill", "acoustic"]
}

# Sub-option mappings for chatbot choices
OPTION_GENRES = {
    # Sad options
    "Match My Mood": ["sad"],
    "Cheer Me Up": ["happy", "dance", "pop"],
    "Help Me Relax": ["sleep", "chill"],

    # Happy options
    "Keep the Vibes Going": ["happy"],
    "Dance Playlist": ["dance", "house", "edm"],
    "Trending Songs": ["pop"],

    # Relax options
    "Nature Sounds": ["acoustic", "chill"],
    "Piano Music": ["classical"],
    "Sleep Playlist": ["sleep"],

    # Energetic options
    "Workout Songs": ["rock", "metal"],
    "Party Playlist": ["dance", "house", "hip-hop"],
    "EDM Mix": ["edm", "electronic"],

    # Romantic options
    "Love Songs": ["romance"],
    "Soft Pop": ["pop", "acoustic"],
    "R&B Collection": ["r-n-b", "blues"],

    # Stressed options
    "Relax Me": ["sleep", "chill"],
    "Focus Better": ["classical"],
    "Calm Playlist": ["acoustic"],

    # Focus options
    "Study Playlist": ["classical"],
    "Instrumental": ["classical", "acoustic"],
    "Lo-Fi": ["chill"]
}

# ==========================================
# Recommend By Mood
# ==========================================

def recommend_by_mood(mood, n=5):
    genres = MOOD_GENRES.get(mood)
    if genres is None:
        genres = ["pop", "dance"]

    songs = df[df["track_genre"].isin(genres)].copy()
    songs = songs.drop_duplicates(subset=["track_name", "artists"])
    songs = songs.sort_values(by="popularity", ascending=False)

    recommendations = []
    for _, row in songs.head(n).iterrows():
        recommendations.append({
            "Song": row["track_name"],
            "Artist": row["artists"],
            "Genre": row["track_genre"]
        })

    return recommendations


# ==========================================
# Recommend By Specific Chatbot Option
# ==========================================

def recommend_by_option(option, mood=None, n=5):
    genres = OPTION_GENRES.get(option)
    if not genres and mood:
        genres = MOOD_GENRES.get(mood)
    if not genres:
        genres = ["pop", "dance", "happy"]

    songs = df[df["track_genre"].isin(genres)].copy()
    songs = songs.drop_duplicates(subset=["track_name", "artists"])
    songs = songs.sort_values(by="popularity", ascending=False)

    recommendations = []
    for _, row in songs.head(n).iterrows():
        recommendations.append({
            "Song": row["track_name"],
            "Artist": row["artists"],
            "Genre": row["track_genre"]
        })

    return recommendations



# ==========================================
# Recommend Similar Songs
# ==========================================

def recommend_song(song_name, n=5):

    song = df[df["track_name"].str.lower() == song_name.lower()]

    if len(song) == 0:
        return []

    index = song.index[0]

    similarity_scores = list(
        enumerate(similarity_matrix[index])
    )

    similarity_scores = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    recommendations = []

    for i in similarity_scores[1:n+1]:

        row = df.iloc[i[0]]

        recommendations.append({

            "Song": row["track_name"],
            "Artist": row["artists"],
            "Genre": row["track_genre"]

        })

    return recommendations


# ==========================================
# Search Songs
# ==========================================

def search_song(query):

    songs = df[
        df["track_name"]
        .str.lower()
        .str.contains(query.lower())
    ]

    results = []

    for _, row in songs.head(20).iterrows():

        results.append({

            "Song": row["track_name"],
            "Artist": row["artists"],
            "Genre": row["track_genre"]

        })

    return results


# ==========================================
# Explorer Songs
# ==========================================

def explorer_songs(limit=100):

    songs = []

    for _, row in df.head(limit).iterrows():

        songs.append({

            "Song": row["track_name"],
            "Artist": row["artists"],
            "Genre": row["track_genre"]

        })

    return songs


# ==========================================
# Genres
# ==========================================

def get_genres():

    return sorted(
        df["track_genre"]
        .dropna()
        .unique()
        .tolist()
    )


# ==========================================
# Test
# ==========================================

if __name__ == "__main__":

    print("Dataset Loaded Successfully")

    print()

    songs = recommend_song("Perfect")

    for song in songs:

        print(song)