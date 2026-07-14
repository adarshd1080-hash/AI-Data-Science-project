

from transformers import pipeline

# Load the emotion classifier once
emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

def detect_mood(user_input):
    result = emotion_classifier(user_input)

    emotion = result[0][0]["label"]

    mapping = {
        "joy": "Happy",
        "sadness": "Sad",
        "anger": "Energetic",
        "fear": "Stressed",
        "surprise": "Happy",
        "love": "Romantic",
        "neutral": "Relax"
    }

    return mapping.get(emotion, "Relax")


def suggest_option(mood):

    print("\nDetected Mood:", mood)

    if mood == "Sad":
        print("\nChoose an option:")
        print("1. Match My Mood")
        print("2. Cheer Me Up")
        print("3. Help Me Relax")

    elif mood == "Happy":
        print("\nChoose an option:")
        print("1. Keep the Vibes Going")
        print("2. Dance Playlist")
        print("3. Trending Songs")

    elif mood == "Stressed":
        print("\nChoose an option:")
        print("1. Relax Me")
        print("2. Focus Better")
        print("3. Calm Playlist")

    elif mood == "Energetic":
        print("\nChoose an option:")
        print("1. Workout Songs")
        print("2. Party Playlist")
        print("3. EDM Mix")

    elif mood == "Romantic":
        print("\nChoose an option:")
        print("1. Love Songs")
        print("2. Soft Pop")
        print("3. R&B Collection")

    elif mood == "Focus":
        print("\nChoose an option:")
        print("1. Study Playlist")
        print("2. Instrumental")
        print("3. Lo-Fi")

    elif mood == "Relax":
        print("\nChoose an option:")
        print("1. Nature Sounds")
        print("2. Piano Music")
        print("3. Sleep Playlist")

    else:
        print("\nSorry! I couldn't detect your mood.")


def recommend_music(mood):

    choice = input("\nEnter your choice (1-3): ")

    if mood == "Sad":

        if choice == "1":
            print("\n🎵 Showing songs that match your mood...")

        elif choice == "2":
            print("\n🌈 Showing cheerful songs to improve your mood...")

        elif choice == "3":
            print("\n😌 Showing relaxing songs...")

        else:
            print("\nInvalid choice!")

    elif mood == "Happy":

        if choice == "1":
            print("\n🎉 Keeping the vibes going!")

        elif choice == "2":
            print("\n💃 Opening Dance Playlist!")

        elif choice == "3":
            print("\n🔥 Showing Trending Songs!")

    elif mood == "Stressed":

        if choice == "1":
            print("\n😌 Relaxing playlist...")

        elif choice == "2":
            print("\n📚 Focus playlist...")

        elif choice == "3":
            print("\n🎹 Calm songs...")

    else:
        print("\nMusic recommendations will be added in the next phase.")


def chatbot():

    print("===================================")
    print("🎵 Welcome to MoodTune AI 🎵")
    print("===================================")

    user_input = input("\nHow are you feeling today?\n> ")

    mood = detect_mood(user_input)

    suggest_option(mood)

    recommend_music(mood)


if __name__ == "__main__":
    chatbot()