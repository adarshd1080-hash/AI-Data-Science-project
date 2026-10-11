
import os
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity


# ==================================================
# 1. LOAD DATASET
# ==================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "spotify_20000.csv")

if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(
        f"Dataset not found: {DATASET_PATH}. "
        "Make sure spotify_20000.csv is inside the dataset folder."
    )

df = pd.read_csv(DATASET_PATH)
df.columns = df.columns.str.strip()

REQUIRED_COLUMNS = ["track_name", "artists", "track_genre"]

for column in REQUIRED_COLUMNS:
    if column not in df.columns:
        raise ValueError(
            f"Missing column '{column}'. Available columns: {list(df.columns)}"
        )

for column in REQUIRED_COLUMNS:
    df[column] = df[column].fillna("").astype(str).str.strip()

if "popularity" not in df.columns:
    df["popularity"] = 0

df["popularity"] = pd.to_numeric(
    df["popularity"], errors="coerce"
).fillna(0)


# ==================================================
# 2. PREPARE AUDIO FEATURES
# ==================================================

POSSIBLE_FEATURES = [
    "danceability",
    "energy",
    "key",
    "loudness",
    "mode",
    "speechiness",
    "acousticness",
    "instrumentalness",
    "liveness",
    "valence",
    "tempo",
    "duration_ms",
    "time_signature",
]

FEATURES = [
    column for column in POSSIBLE_FEATURES if column in df.columns
]

scaled_features = None

if FEATURES:
    for column in FEATURES:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    df[FEATURES] = df[FEATURES].fillna(
        df[FEATURES].median()
    ).fillna(0)

    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(df[FEATURES])


# ==================================================
# 3. FORMAT SONGS FOR THE FRONTEND
# ==================================================

def format_songs(songs, n=5):
    """Convert dataset rows to the JSON format used by the frontend."""

    if songs is None or len(songs) == 0:
        return []

    results = []

    for _, song in songs.head(n).iterrows():
        results.append({
            "Song": str(song["track_name"]),
            "Artist": str(song["artists"]),
            "Genre": str(song["track_genre"]),
        })

    return results


# ==================================================
# 4. SEARCH SONGS
# ==================================================

def search_song(query):
    """
    Search by song title or artist.
    Exact title matches appear first, followed by partial matches.
    """

    query = str(query).strip()

    if not query:
        return []

    query_lower = query.casefold()

    title_lower = df["track_name"].str.casefold()
    artist_lower = df["artists"].str.casefold()

    title_mask = title_lower.str.contains(
        query_lower, regex=False, na=False
    )
    artist_mask = artist_lower.str.contains(
        query_lower, regex=False, na=False
    )

    matches = df[title_mask | artist_mask].copy()

    if matches.empty:
        return []

    titles = matches["track_name"].str.casefold()
    artists = matches["artists"].str.casefold()

    matches["_rank"] = 4

    matches.loc[
        artists.str.contains(query_lower, regex=False, na=False),
        "_rank"
    ] = 3

    matches.loc[
        titles.str.contains(query_lower, regex=False, na=False),
        "_rank"
    ] = 2

    matches.loc[
        titles.str.startswith(query_lower, na=False),
        "_rank"
    ] = 1

    matches.loc[titles == query_lower, "_rank"] = 0

    matches = matches.sort_values(
        by=["_rank", "popularity"],
        ascending=[True, False],
        kind="stable"
    )

    matches = matches.drop_duplicates(
        subset=["track_name", "artists"]
    )

    return format_songs(matches.drop(columns=["_rank"]), 20)


# ==================================================
# 5. RECOMMEND SONGS FROM SEARCH
# ==================================================

def recommend_song(song_name, n=5):
    """
    Return matching titles first.
    If no title matches, return songs by matching artists.
    """

    query = str(song_name).strip()

    if not query:
        return []

    title_matches = df[
        df["track_name"].str.contains(
            query, case=False, na=False, regex=False
        )
    ].copy()

    if not title_matches.empty:
        query_lower = query.casefold()
        titles = title_matches["track_name"].str.casefold()

        title_matches["_rank"] = 2

        title_matches.loc[
            titles.str.startswith(query_lower, na=False),
            "_rank"
        ] = 1

        title_matches.loc[titles == query_lower, "_rank"] = 0

        title_matches = title_matches.sort_values(
            by=["_rank", "popularity"],
            ascending=[True, False],
            kind="stable"
        )

        title_matches = title_matches.drop_duplicates(
            subset=["track_name", "artists"]
        )

        return format_songs(
            title_matches.drop(columns=["_rank"]), n
        )

    # If no title matches, search the artist names
    artist_matches = df[
        df["artists"].str.contains(
            query, case=False, na=False, regex=False
        )
    ].copy()

    if artist_matches.empty:
        return []

    artist_matches = artist_matches.sort_values(
        by="popularity",
        ascending=False,
        kind="stable"
    )

    artist_matches = artist_matches.drop_duplicates(
        subset=["track_name", "artists"]
    )

    return format_songs(artist_matches, n)


# ==================================================
# 6. RECOMMEND SIMILAR SONGS
# ==================================================

def recommend_similar_songs(song_name, n=5):
    """Recommend songs with similar audio features."""

    query = str(song_name).strip()

    if not query:
        return []

    exact_matches = df[
        df["track_name"].str.casefold() == query.casefold()
    ]

    if exact_matches.empty:
        return recommend_song(query, n)

    if scaled_features is None:
        return recommend_song(query, n)

    reference_position = df.index.get_loc(exact_matches.index[0])

    scores = cosine_similarity(
        scaled_features[reference_position:reference_position + 1],
        scaled_features
    )[0]

    ranked_positions = scores.argsort()[::-1]
    results = []

    for position in ranked_positions:
        if position == reference_position:
            continue

        results.append(df.iloc[position])

        if len(results) >= n:
            break

    return format_songs(pd.DataFrame(results), n)


# ==================================================
# 7. MOOD GENRE MAPPING
# ==================================================

MOOD_GENRES = {
    "Happy": [
        "happy", "pop", "dance", "disco", "party"
    ],
    "Sad": [
        "sad", "acoustic", "blues", "soul", "piano"
    ],
    "Energetic": [
        "metal", "rock", "punk", "techno",
        "edm", "heavy-metal", "drum-and-bass"
    ],
    "Stressed": [
        "ambient", "classical", "sleep", "study",
        "piano", "acoustic", "chill"
    ],
    "Relax": [
        "ambient", "chill", "sleep", "study",
        "acoustic", "classical", "piano"
    ],
    "Romantic": [
        "romance", "love", "soul", "r-n-b",
        "jazz", "acoustic"
    ],
}


# ==================================================
# 8. MOOD-BASED RECOMMENDATIONS WITH CHATBOT MODES
# ==================================================

def recommend_by_mood(mood, n=5, mode="Match My Mood"):
    """
    Generate recommendations for the chatbot.

    Match My Mood: use the detected mood.
    Cheer Me Up: recommend Happy songs.
    Help Me Relax: recommend Relax songs.
    """

    mood = str(mood).strip()
    mode = str(mode).strip().casefold()

    if not mood:
        return []

    mood_aliases = {
        "joy": "Happy",
        "happiness": "Happy",
        "happy": "Happy",
        "sadness": "Sad",
        "sad": "Sad",
        "anger": "Energetic",
        "angry": "Energetic",
        "fear": "Stressed",
        "stressed": "Stressed",
        "surprise": "Happy",
        "love": "Romantic",
        "romantic": "Romantic",
        "neutral": "Relax",
        "relaxed": "Relax",
        "relax": "Relax",
    }

    normalized_mood = mood_aliases.get(mood.casefold(), mood)

    if mode == "cheer me up":
        normalized_mood = "Happy"
    elif mode == "help me relax":
        normalized_mood = "Relax"

    matched_mood = next(
        (
            name for name in MOOD_GENRES
            if name.casefold() == normalized_mood.casefold()
        ),
        None
    )

    if matched_mood is None:
        return get_popular_songs(n)

    preferred_genres = MOOD_GENRES[matched_mood]
    genre_column = df["track_genre"].str.casefold()

    mask = genre_column.apply(
        lambda genre: any(
            preferred.casefold() in genre
            for preferred in preferred_genres
        )
    )

    songs = df[mask].copy()

    if songs.empty:
        return get_popular_songs(n)

    songs = songs.sort_values(
        by="popularity",
        ascending=False,
        kind="stable"
    )

    songs = songs.drop_duplicates(
        subset=["track_name", "artists"]
    )

    return format_songs(songs, n)


# ==================================================
# 9. GET GENRES
# ==================================================

def get_genres():
    """Return unique genres for the dropdown."""

    genres = (
        df["track_genre"]
        .replace("", pd.NA)
        .dropna()
        .unique()
        .tolist()
    )

    return sorted(genres, key=str.casefold)


def get_all_genres():
    return get_genres()


# ==================================================
# 10. GENRE FILTERING
# ==================================================

def recommend_by_genre(genre, n=20):
    """Return songs in the selected genre."""

    genre = str(genre).strip()

    if not genre or genre.casefold() == "all genres":
        songs = df.copy()
    else:
        songs = df[
            df["track_genre"].str.casefold() == genre.casefold()
        ].copy()

    if songs.empty:
        return []

    songs = songs.sort_values(
        by="popularity",
        ascending=False,
        kind="stable"
    )

    songs = songs.drop_duplicates(
        subset=["track_name", "artists"]
    )

    return format_songs(songs, n)


def get_songs_by_genre(genre, n=20):
    return recommend_by_genre(genre, n)


# ==================================================
# 11. POPULAR SONGS
# ==================================================

def get_popular_songs(n=20):
    """Return the most popular songs."""

    songs = df.sort_values(
        by="popularity",
        ascending=False,
        kind="stable"
    )

    songs = songs.drop_duplicates(
        subset=["track_name", "artists"]
    )

    return format_songs(songs, n)


# ==================================================
# 12. EXPLORER PAGE
# ==================================================

def get_all_songs(n=100):
    """Return songs for the Explorer page."""

    songs = df.sort_values(
        by="popularity",
        ascending=False,
        kind="stable"
    )

    songs = songs.drop_duplicates(
        subset=["track_name", "artists"]
    )

    return format_songs(songs, n)


def explorer_songs(n=100):
    """Compatibility function expected by backend/app.py."""

    return get_all_songs(n)


# ==================================================
# 13. QUICK TEST
# ==================================================

if __name__ == "__main__":
    print("Genres:", get_genres()[:10])
    print("Search Blue:", search_song("Blue")[:5])
    print("Recommend Blue:", recommend_song("Blue"))
    print("Sad mood:", recommend_by_mood("Sad"))
    print("Happy mood:", recommend_by_mood("Happy"))
    print("Popular songs:", get_popular_songs(5))
