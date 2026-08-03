// ===============================
// MoodTune AI Chatbot
// ===============================

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const optionButtons = document.getElementById("optionButtons");
const songContainer = document.getElementById("songContainer");

let recommendedSongs = [];
let detectedMood = "";

// ===============================
// Send Button
// ===============================

sendBtn.addEventListener("click", sendMessage);

// ===============================
// Enter Key
// ===============================

input.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        sendMessage();

    }

});

// ===============================
// Send Message
// ===============================

async function sendMessage() {

    const text = input.value.trim();

    if (text === "") return;

    // User Message
    messages.innerHTML += `
        <div class="user-message">
            ${text}
        </div>
    `;

    messages.scrollTop = messages.scrollHeight;

    input.value = "";

    try {

        const response = await fetch("http://127.0.0.1:5000/recommend", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: text

            })

        });

        if (!response.ok) {

            throw new Error("Backend Error");

        }

        const data = await response.json();

        detectedMood = data.mood;
        recommendedSongs = data.songs;

        // Bot Reply
        messages.innerHTML += `
            <div class="bot-message">
                😊 I detected your mood as
                <strong>${detectedMood}</strong>.
                <br><br>
                Choose one of the options below.
            </div>
        `;

        // Show Option Buttons

        if (detectedMood === "Sad") {

            optionButtons.innerHTML = `

                <button onclick="showSongs('Match My Mood')">
                    🎵 Match My Mood
                </button>

                <button onclick="showSongs('Cheer Me Up')">
                    🌈 Cheer Me Up
                </button>

                <button onclick="showSongs('Help Me Relax')">
                    😌 Help Me Relax
                </button>

            `;

        }

        else if (detectedMood === "Happy") {

            optionButtons.innerHTML = `

                <button onclick="showSongs('Keep the Vibes Going')">
                    😄 Keep the Vibes Going
                </button>

                <button onclick="showSongs('Dance Playlist')">
                    💃 Dance Playlist
                </button>

                <button onclick="showSongs('Trending Songs')">
                    🔥 Trending Songs
                </button>

            `;

        }

        else if (detectedMood === "Relax") {

            optionButtons.innerHTML = `

                <button onclick="showSongs('Nature Sounds')">
                    🌿 Nature Sounds
                </button>

                <button onclick="showSongs('Piano Music')">
                    🎹 Piano Music
                </button>

                <button onclick="showSongs('Sleep Playlist')">
                    😴 Sleep Playlist
                </button>

            `;

        }

        else if (detectedMood === "Energetic") {

            optionButtons.innerHTML = `

                <button onclick="showSongs('Workout Songs')">
                    💪 Workout Songs
                </button>

                <button onclick="showSongs('Party Playlist')">
                    🎉 Party Playlist
                </button>

                <button onclick="showSongs('EDM Mix')">
                    🎧 EDM Mix
                </button>

            `;

        }

        else if (detectedMood === "Romantic") {

            optionButtons.innerHTML = `

                <button onclick="showSongs('Love Songs')">
                    ❤️ Love Songs
                </button>

                <button onclick="showSongs('Soft Pop')">
                    🎶 Soft Pop
                </button>

                <button onclick="showSongs('R&B Collection')">
                    🎤 R&B Collection
                </button>

            `;

        }

        else {

            optionButtons.innerHTML = `

                <button onclick="showSongs('Show Recommendations')">
                    🎵 Show Recommendations
                </button>

            `;

        }

        optionButtons.style.display = "block";

        messages.scrollTop = messages.scrollHeight;

    }

    catch (error) {

        console.error(error);

        messages.innerHTML += `

            <div class="bot-message">

                ❌ Cannot connect to backend.

            </div>

        `;

    }

}

// ===============================
// Show Songs
// ===============================

function showSongs(option) {

    messages.innerHTML += `

        <div class="user-message">

            ${option}

        </div>

    `;

    songContainer.innerHTML = "";

    if (recommendedSongs.length === 0) {

        songContainer.innerHTML = `

            <p>No songs found.</p>

        `;

        return;

    }

    recommendedSongs.forEach(song => {

        songContainer.innerHTML += `

            <div class="song-card">

                <img src="https://placehold.co/250x250">

                <h3>${song.Song}</h3>

                <p>${song.Artist}</p>

                <span>${song.Genre}</span>

            </div>

        `;

    });

    messages.innerHTML += `

        <div class="bot-message">

            🎵 Here are your recommendations.

        </div>

    `;

    messages.scrollTop = messages.scrollHeight;

}