import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity


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

print(df.columns)


# Select audio features
features = df[FEATURES]

print("Selected features:")
print(features.head())


# Scale features
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

print("\nScaled feature matrix shape:")
print(scaled_features.shape)


# Create similarity matrix
similarity_matrix = cosine_similarity(scaled_features)


def recommend_song(song_name, n=5):

    # Find song index using track_name column
    song_indices = df[df["track_name"] == song_name].index

    if len(song_indices) == 0:
        return "Song not found in dataset"

    song_index = song_indices[0]

    # Similarity scores
    scores = list(enumerate(similarity_matrix[song_index]))

    # Sort highest similarity first
    scores = sorted(
        scores,
        key=lambda x: x[1],
        reverse=True
    )

    recommendations = []

    for index, score in scores[1:n+1]:
        recommendations.append(df.iloc[index]["track_name"])

    return recommendations


# Show available songs for testing
print("\nSample songs:")
print(df["track_name"].head(10))


# Test recommendation
print("\nRecommendations:")
print(recommend_song(df["track_name"].iloc[0]))