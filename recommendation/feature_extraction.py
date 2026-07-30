import pandas as pd
from sklearn.preprocessing import StandardScaler

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

print("Dataset loaded successfully!")

# Select audio features
features = df[FEATURES]

print("\nSelected Features:")
print(features.head())

# Scale features
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

print("\nScaled Feature Matrix Shape:")
print(scaled_features.shape)

# These variables can be imported into recommendation.py