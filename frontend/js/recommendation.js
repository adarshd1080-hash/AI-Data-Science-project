// =======================================
// MoodTune AI Recommendation Page
// =======================================

const API_BASE = "http://127.0.0.1:5000";

const songInput = document.getElementById("songInput");
const searchBtn = document.getElementById("searchBtn");
const genreSelect = document.getElementById("genreSelect");
const resultsContainer = document.getElementById("resultsContainer");
const moodButtons = document.querySelectorAll(".mood-btn");

// Helper to fetch from backend with fallback
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        // Fallback to localhost if 127.0.0.1 fails
        if (API_BASE.includes("127.0.0.1")) {
            const fallbackUrl = `http://localhost:5000${endpoint}`;
            const fallbackRes = await fetch(fallbackUrl, options);
            if (!fallbackRes.ok) {
                throw new Error(`HTTP error! status: ${fallbackRes.status}`);
            }
            return await fallbackRes.json();
        }
        throw err;
    }
}

// =======================================
// Loading State
// =======================================

function showLoading(message = "Loading recommendations...") {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = `
        <div style="text-align: center; width: 100%; padding: 40px 20px; color: #1DB954;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 36px; margin-bottom: 15px; display: block;"></i>
            <p style="font-size: 18px; color: #fff;">${message}</p>
        </div>
    `;
    scrollToResults();
}

function scrollToResults() {
    if (resultsContainer) {
        resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// =======================================
// Display Songs
// =======================================

function displaySongs(songs, title = "") {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = "";

    if (!songs || songs.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 40px; color: #aaa;">
                <i class="fa-solid fa-music" style="font-size: 40px; margin-bottom: 15px; display: block; color: #555;"></i>
                <h3 style="color: #fff; margin-bottom: 8px;">No Songs Found</h3>
                <p>Try searching for a different song or picking another mood.</p>
            </div>
        `;
        scrollToResults();
        return;
    }

    songs.forEach(song => {
        const card = document.createElement("div");
        card.className = "recommend-card";

        card.innerHTML = `
            <div style="width: 100%; height: 180px; background: linear-gradient(135deg, #1db954 0%, #191414 100%); border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 40px rgba(0,0,0,0.5);">
                <i class="fa-solid fa-music" style="font-size: 50px; color: rgba(255,255,255,0.9);"></i>
            </div>
            <h3 style="margin-top: 15px; font-size: 18px; font-weight: 600;" title="${song.Song}">${song.Song}</h3>
            <p style="margin-top: 6px; color: #bbb;"><strong>Artist:</strong> ${song.Artist}</p>
            <p style="margin-top: 4px; color: #888;"><strong>Genre:</strong> <span style="color: #1DB954; text-transform: capitalize;">${song.Genre}</span></p>
        `;

        resultsContainer.appendChild(card);
    });

    scrollToResults();
}

// =======================================
// Recommend Similar Songs
// =======================================

async function recommendSong() {
    const song = songInput ? songInput.value.trim() : "";

    if (song === "") {
        alert("Please enter a song name.");
        return;
    }

    showLoading(`Finding songs similar to "${song}"...`);

    // Clear active mood buttons
    moodButtons.forEach(btn => btn.classList.remove("active"));

    try {
        const songs = await apiFetch("/recommend-song", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ song: song })
        });

        displaySongs(songs);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 40px; color: #ff5555;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 36px; margin-bottom: 12px; display: block;"></i>
                <p>Could not connect to the backend server.</p>
                <p style="font-size: 13px; color: #aaa; margin-top: 6px;">Ensure Flask is running at http://127.0.0.1:5000</p>
            </div>
        `;
    }
}

// =======================================
// Mood Recommendation
// =======================================

async function recommendMood(mood, clickedButton) {
    // Update active button state
    moodButtons.forEach(btn => btn.classList.remove("active"));
    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    showLoading(`Curating ${mood} mood playlist...`);

    try {
        const songs = await apiFetch("/mood/" + encodeURIComponent(mood));
        displaySongs(songs);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 40px; color: #ff5555;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 36px; margin-bottom: 12px; display: block;"></i>
                <p>Could not connect to the backend server.</p>
                <p style="font-size: 13px; color: #aaa; margin-top: 6px;">Ensure Flask is running at http://127.0.0.1:5000</p>
            </div>
        `;
    }
}

// =======================================
// Genre Filter
// =======================================

async function filterGenre() {
    const genre = genreSelect ? genreSelect.value : "";
    if (genre === "") return;

    // Clear mood selection
    moodButtons.forEach(btn => btn.classList.remove("active"));

    showLoading(`Filtering songs for ${genre}...`);

    try {
        const songs = await apiFetch("/genre/" + encodeURIComponent(genre));
        displaySongs(songs);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 40px; color: #ff5555;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 36px; margin-bottom: 12px; display: block;"></i>
                <p>Could not load genre tracks.</p>
            </div>
        `;
    }
}

// =======================================
// Load Genres
// =======================================

async function loadGenres() {
    if (!genreSelect) return;
    try {
        const genres = await apiFetch("/genres");
        genreSelect.innerHTML = `<option value="">All Genres</option>`;
        genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.warn("Could not load genres:", error);
    }
}

// =======================================
// Attach Event Listeners
// =======================================

function initListeners() {
    if (searchBtn) {
        searchBtn.addEventListener("click", recommendSong);
    }

    if (songInput) {
        songInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                recommendSong();
            }
        });
    }

    if (genreSelect) {
        genreSelect.addEventListener("change", filterGenre);
    }

    moodButtons.forEach(button => {
        button.addEventListener("click", function () {
            const mood = this.dataset.mood;
            recommendMood(mood, this);
        });
    });

    loadGenres();
}

// Initialize on load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initListeners);
} else {
    initListeners();
}