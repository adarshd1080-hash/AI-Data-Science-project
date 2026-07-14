import pandas as pd

def load_dataset():
    df = pd.read_csv("dataset/spotify_20000.csv")
    return df


if __name__ == "__main__":
    songs = load_dataset()
    print("Dataset loaded successfully!")
    print(f"Number of songs: {len(songs)}")

    import pandas as pd

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

def load_dataset():
    df = pd.read_csv("dataset/spotify_20000.csv")
    return df


if __name__ == "__main__":
    df = load_dataset()

    print("Selected features:")
    print(df[FEATURES].head())

    import pandas as pd
from sklearn.preprocessing import StandardScaler

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

def load_dataset():
    df = pd.read_csv("dataset/spotify_20000.csv")
    return df


def prepare_features(df):
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(df[FEATURES])
    return scaled_features


if __name__ == "__main__":
    df = load_dataset()

    print("Selected features:")
    print(df[FEATURES].head())

    scaled_features = prepare_features(df)

    print("\nScaled feature matrix shape:")
    print(scaled_features.shape)