from recommendation import recommend_song


def explore_song(song_name):
    """
    Search for a song and display similar recommendations.
    """

    recommendations = recommend_song(song_name)

    if isinstance(recommendations, str):
        print(recommendations)
        return

    print(f"\nRecommendations for: {song_name}\n")

    for i, song in enumerate(recommendations, start=1):
        print(f"{i}. {song['Track']}")
        print(f"   Artist: {song['Artist']}")
        print(f"   Genre: {song['Genre']}")
        print(f"   Similarity Score: {song['Similarity Score']}\n")


if __name__ == "__main__":
    song = input("Enter a song name: ")
    explore_song(song)