import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

# ==========================
# Load Dataset
# ==========================

df = pd.read_csv("dataset/spotify_20000.csv")

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

# ==========================
# Feature Scaling
# ==========================

features = df[FEATURES]

scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

# ==========================
# Cosine Similarity
# ==========================

similarity_matrix = cosine_similarity(scaled_features)

# ==========================
# Mood to Genre Mapping
# ==========================

MOOD_GENRES = {

    "Happy": [
        "pop",
        "dance",
        "party",
        "happy"
    ],

    "Sad": [
        "sad",
        "acoustic",
        "piano"
    ],

    "Stressed": [
        "study",
        "sleep",
        "ambient",
        "chill"
    ],

    "Relax": [
        "sleep",
        "ambient",
        "new-age"
    ],

    "Energetic": [
        "edm",
        "dance"
    ],

    "Romantic": [
        "romance",
        "r-n-b"
    ],

    "Focus": [
        "study",
        "classical",
        "piano"
    ]
}

# ==========================
# Recommend Similar Songs
# ==========================

def recommend_song(song_name, n=5):

    song_indices = df[df["track_name"] == song_name].index

    if len(song_indices) == 0:
        return []

    song_index = song_indices[0]

    scores = list(enumerate(similarity_matrix[song_index]))

    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    recommendations = []

    for index, score in scores[1:n+1]:

        recommendations.append({

            "Song": df.iloc[index]["track_name"],
            "Artist": df.iloc[index]["artists"],
            "Genre": df.iloc[index]["track_genre"]

        })

    return recommendations

# ==========================
# Recommend by Mood
# ==========================

def recommend_by_mood(mood, n=5):

    genres = MOOD_GENRES.get(mood)

    if genres is None:
        return []

    songs = df[df["track_genre"].isin(genres)]

    songs = songs.sort_values(
        by="popularity",
        ascending=False
    )

    recommendations = []

    for _, row in songs.head(n).iterrows():

        recommendations.append({

            "Song": row["track_name"],
            "Artist": row["artists"],
            "Genre": row["track_genre"]

        })

    return recommendations


# ==========================
# Testing
# ==========================

if __name__ == "__main__":

    print("Dataset Loaded Successfully!")
    print("Total Songs:", len(df))

    print("\nHappy Mood Recommendations\n")

    songs = recommend_by_mood("Happy")

    for song in songs:

        print(f"{song['Song']} - {song['Artist']} ({song['Genre']})")