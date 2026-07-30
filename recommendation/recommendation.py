import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity


# Audio features used for recommendation
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

# Load dataset
df = pd.read_csv("dataset/spotify_20000.csv")

# Prepare features
features = df[FEATURES]

scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

# Create similarity matrix
similarity_matrix = cosine_similarity(scaled_features)


def recommend_song(song_name, n=5):
    """
    Recommend songs similar to the given song.
    """

    song_indices = df[df["track_name"].str.lower() == song_name.lower()].index.tolist()

    if len(song_indices) == 0:
        return "Song not found in dataset."

    song_index = song_indices[0]

    similarity_scores = list(enumerate(similarity_matrix[song_index]))

    similarity_scores.sort(key=lambda x: x[1], reverse=True)

    recommendations = []

    for index, score in similarity_scores[1:n+1]:
        recommendations.append({
            "Track": df.iloc[index]["track_name"],
            "Artist": df.iloc[index]["artists"],
            "Genre": df.iloc[index]["track_genre"],
            "Similarity Score": round(score, 3)
        })

    return recommendations




   