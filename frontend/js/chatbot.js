// ===============================
// MoodTune AI Chatbot
// ===============================

const API_BASE = "http://127.0.0.1:5000";

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const optionButtons = document.getElementById("optionButtons");
const songContainer = document.getElementById("songContainer");

let detectedMood = "";
let currentOptions = [];

// ===============================
// API Fetch with Fallback
// ===============================
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        if (API_BASE.includes("127.0.0.1")) {
            const fallbackRes = await fetch(`http://localhost:5000${endpoint}`, options);
            if (!fallbackRes.ok) {
                throw new Error(`HTTP error! status: ${fallbackRes.status}`);
            }
            return await fallbackRes.json();
        }
        throw err;
    }
}

// ===============================
// Send Button & Enter Key
// ===============================
if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

if (input) {
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
}

// ===============================
// Send Message
// ===============================
async function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    // Check if the user typed one of the visible options or a number (1, 2, 3)
    if (currentOptions.length > 0) {
        const lowerText = text.toLowerCase();
        let matchedOption = null;

        if (text === "1" && currentOptions[0]) matchedOption = currentOptions[0];
        else if (text === "2" && currentOptions[1]) matchedOption = currentOptions[1];
        else if (text === "3" && currentOptions[2]) matchedOption = currentOptions[2];
        else {
            matchedOption = currentOptions.find(opt => opt.toLowerCase() === lowerText);
        }

        if (matchedOption) {
            input.value = "";
            showSongs(matchedOption);
            return;
        }
    }

    // User Message
    messages.innerHTML += `
        <div class="user-message">
            ${text}
        </div>
    `;
    messages.scrollTop = messages.scrollHeight;
    input.value = "";

    // Show typing loader
    const typingId = "typing-" + Date.now();
    messages.innerHTML += `
        <div class="bot-message" id="${typingId}">
            <i class="fa-solid fa-spinner fa-spin"></i> Analyzing your mood...
        </div>
    `;
    messages.scrollTop = messages.scrollHeight;

    try {
        const data = await apiFetch("/recommend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        detectedMood = data.mood;

        // Remove typing indicator
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        // Bot Reply
        messages.innerHTML += `
            <div class="bot-message">
                😊 I detected your mood as <strong>${detectedMood}</strong>.
                <br><br>
                Choose an option below to get tailored recommendations:
            </div>
        `;

        // Render Option Buttons based on detected mood
        renderOptionButtons(detectedMood);

        // Pre-display initial songs
        if (data.songs && data.songs.length > 0) {
            renderSongCards(data.songs, `Initial ${detectedMood} Recommendations`);
        }

        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        console.error(error);
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        messages.innerHTML += `
            <div class="bot-message" style="color: #ff6b6b;">
                ❌ Could not connect to the backend server. Make sure it is running at http://127.0.0.1:5000.
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    }
}

// ===============================
// Render Option Buttons
// ===============================
function renderOptionButtons(mood) {
    let options = [];

    if (mood === "Sad") {
        options = ["Match My Mood", "Cheer Me Up", "Help Me Relax"];
    } else if (mood === "Happy") {
        options = ["Keep the Vibes Going", "Dance Playlist", "Trending Songs"];
    } else if (mood === "Relax") {
        options = ["Nature Sounds", "Piano Music", "Sleep Playlist"];
    } else if (mood === "Energetic") {
        options = ["Workout Songs", "Party Playlist", "EDM Mix"];
    } else if (mood === "Romantic") {
        options = ["Love Songs", "Soft Pop", "R&B Collection"];
    } else if (mood === "Stressed") {
        options = ["Relax Me", "Focus Better", "Calm Playlist"];
    } else if (mood === "Focus") {
        options = ["Study Playlist", "Instrumental", "Lo-Fi"];
    } else {
        options = ["Match My Mood", "Cheer Me Up", "Help Me Relax"];
    }

    currentOptions = options;

    const emojiMap = {
        "Match My Mood": "🎵",
        "Cheer Me Up": "🌈",
        "Help Me Relax": "😌",
        "Keep the Vibes Going": "😄",
        "Dance Playlist": "💃",
        "Trending Songs": "🔥",
        "Nature Sounds": "🌿",
        "Piano Music": "🎹",
        "Sleep Playlist": "😴",
        "Workout Songs": "💪",
        "Party Playlist": "🎉",
        "EDM Mix": "🎧",
        "Love Songs": "❤️",
        "Soft Pop": "🎶",
        "R&B Collection": "🎤",
        "Relax Me": "🧘",
        "Focus Better": "🎯",
        "Calm Playlist": "🌊",
        "Study Playlist": "📚",
        "Instrumental": "🎻",
        "Lo-Fi": "☕"
    };

    optionButtons.innerHTML = options.map(opt => `
        <button onclick="showSongs('${opt}')">
            ${emojiMap[opt] || "🎵"} ${opt}
        </button>
    `).join("");

    optionButtons.style.display = "flex";
}

// ===============================
// Show Songs For Selected Option
// ===============================
async function showSongs(option) {
    // Add user message to chat
    messages.innerHTML += `
        <div class="user-message">
            ${option}
        </div>
    `;
    messages.scrollTop = messages.scrollHeight;

    // Show loading state in chat
    const loadingId = "opt-loading-" + Date.now();
    messages.innerHTML += `
        <div class="bot-message" id="${loadingId}">
            <i class="fa-solid fa-spinner fa-spin"></i> Finding songs for <strong>${option}</strong>...
        </div>
    `;
    messages.scrollTop = messages.scrollHeight;

    // Show loading spinner in song container
    if (songContainer) {
        songContainer.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 40px; color: #1DB954;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 36px; margin-bottom: 12px; display: block;"></i>
                <p style="color: #fff; font-size: 16px;">Curating songs for "${option}"...</p>
            </div>
        `;
    }

    try {
        const songs = await apiFetch("/recommend-option", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                option: option,
                mood: detectedMood
            })
        });

        // Update bot message
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.innerHTML = `🎵 Here are your recommendations for <strong>${option}</strong>:`;
            loadingEl.removeAttribute("id");
        }

        renderSongCards(songs, option);

        // Scroll to songs section smoothly
        if (songContainer) {
            songContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    } catch (error) {
        console.error(error);
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.innerHTML = `❌ Failed to fetch songs for "${option}". Please try again.`;
            loadingEl.removeAttribute("id");
        }

        if (songContainer) {
            songContainer.innerHTML = `
                <p style="text-align: center; color: #ff6b6b; padding: 20px;">
                    Could not load recommendations. Ensure the backend server is running.
                </p>
            `;
        }
    }

    messages.scrollTop = messages.scrollHeight;
}

// ===============================
// Render Song Cards (No Spotify Button)
// ===============================
function renderSongCards(songs, title = "") {
    if (!songContainer) return;

    songContainer.innerHTML = "";

    if (!songs || songs.length === 0) {
        songContainer.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 30px; color: #aaa;">
                <i class="fa-solid fa-music" style="font-size: 36px; margin-bottom: 10px; display: block; color: #555;"></i>
                <p>No songs found for this selection.</p>
            </div>
        `;
        return;
    }

    songs.forEach(song => {
        const card = document.createElement("div");
        card.className = "song-card";

        card.innerHTML = `
            <div style="width: 100%; height: 160px; background: linear-gradient(135deg, #1db954 0%, #191414 100%); border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 30px rgba(0,0,0,0.5); margin-bottom: 15px;">
                <i class="fa-solid fa-music" style="font-size: 46px; color: rgba(255,255,255,0.9);"></i>
            </div>
            <h3 style="font-size: 17px; font-weight: 600; color: #fff; margin-bottom: 6px;" title="${song.Song}">${song.Song}</h3>
            <p style="color: #bbb; font-size: 14px; margin-bottom: 6px;"><strong>Artist:</strong> ${song.Artist}</p>
            <span style="display: inline-block; padding: 4px 10px; background: rgba(29, 185, 84, 0.15); border: 1px solid #1DB954; color: #1DB954; border-radius: 12px; font-size: 12px; text-transform: capitalize;">${song.Genre}</span>
        `;

        songContainer.appendChild(card);
    });
}

// Expose globally for HTML onclick handlers
window.showSongs = showSongs;
window.sendMessage = sendMessage;