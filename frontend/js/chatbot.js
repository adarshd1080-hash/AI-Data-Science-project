
"use strict";

// ==========================================
// MoodTune AI Chatbot
// ==========================================

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const optionButtons = document.getElementById("optionButtons");
const songContainer = document.getElementById("songContainer");

const API_URL = "http://127.0.0.1:5000";

let lastMessage = "";
let detectedMood = "";
let recommendedSongs = [];
let requestInProgress = false;


// ==========================================
// Safe HTML Text
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// ==========================================
// Add Chat Message
// ==========================================

function addMessage(text, type) {
    const messageElement = document.createElement("div");

    messageElement.className =
        type === "user" ? "user-message" : "bot-message";

    messageElement.textContent = text;

    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}


// ==========================================
// Send Button
// ==========================================

sendBtn.addEventListener("click", sendMessage);


// ==========================================
// Enter Key
// ==========================================

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});


// ==========================================
// Send Message and Detect Mood
// ==========================================

async function sendMessage() {
    const text = input.value.trim();

    if (!text || requestInProgress) {
        return;
    }

    lastMessage = text;

    addMessage(text, "user");

    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;

    optionButtons.style.display = "none";
    songContainer.innerHTML = "";

    addMessage("Understanding your mood...", "bot");

    requestInProgress = true;

    try {
        const response = await fetch(`${API_URL}/recommend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: lastMessage,
                mode: "Match My Mood"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Could not detect your mood."
            );
        }

        detectedMood = data.mood || "Unknown";
        recommendedSongs = data.songs || [];

        // Remove the temporary status message
        const botMessages = messages.querySelectorAll(".bot-message");
        const lastBotMessage = botMessages[botMessages.length - 1];

        if (
            lastBotMessage &&
            lastBotMessage.textContent === "Understanding your mood..."
        ) {
            lastBotMessage.remove();
        }

        addMessage(
            `I detected your mood as ${detectedMood}. Choose a music option below!`,
            "bot"
        );

        // Show the three mode buttons
        optionButtons.style.display = "flex";

    } catch (error) {
        console.error("Chatbot error:", error);

        addMessage(
            `Sorry, something went wrong: ${error.message}. Please check that your backend is running.`,
            "bot"
        );

    } finally {
        requestInProgress = false;
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }
}


// ==========================================
// Show Songs for Selected Mode
// ==========================================

async function showSongs(option) {
    if (!lastMessage || requestInProgress) {
        return;
    }

    requestInProgress = true;

    optionButtons.querySelectorAll("button").forEach(button => {
        button.disabled = true;
    });

    songContainer.innerHTML = "<p>Finding songs for you...</p>";

    addMessage(option, "user");

    try {
        const response = await fetch(`${API_URL}/recommend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: lastMessage,
                mode: option
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Could not load songs."
            );
        }

        detectedMood = data.mood || detectedMood;
        recommendedSongs = data.songs || [];

        renderSongs(recommendedSongs);

        addMessage(
            `Here are your ${option} recommendations!`,
            "bot"
        );

    } catch (error) {
        console.error("Song recommendation error:", error);

        songContainer.innerHTML =
            "<p>Unable to load songs. Please check your backend terminal.</p>";

        addMessage(
            "Sorry, I couldn't load the songs. Please try again.",
            "bot"
        );

    } finally {
        requestInProgress = false;

        optionButtons.querySelectorAll("button").forEach(button => {
            button.disabled = false;
        });
    }
}


// ==========================================
// Render Song Cards
// ==========================================

function renderSongs(songs) {
    songContainer.innerHTML = "";

    if (!songs || songs.length === 0) {
        songContainer.innerHTML =
            "<p>No songs found. Please try another option.</p>";
        return;
    }

    songs.forEach(song => {
        const card = document.createElement("div");

        card.className = "song-card";

        card.innerHTML = `
            <img
                src="https://placehold.co/250x250"
                alt="Album artwork placeholder"
            >
            <h3>${escapeHTML(song.Song)}</h3>
            <p>${escapeHTML(song.Artist)}</p>
            <span>${escapeHTML(song.Genre)}</span>
        `;

        songContainer.appendChild(card);
    });
}
