// =======================================
// MoodTune AI Explorer
// =======================================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const musicGrid = document.getElementById("musicGrid");
const genreFilter = document.getElementById("genreFilter");

// =======================================
// Load All Songs
// =======================================

async function loadSongs() {

    try {

        const response = await fetch("http://127.0.0.1:5000/explorer");

        const songs = await response.json();

        displaySongs(songs);

    }

    catch (error) {

        console.log(error);

    }

}

// =======================================
// Load Genres
// =======================================

async function loadGenres() {

    try {

        const response = await fetch("http://127.0.0.1:5000/genres");

        const genres = await response.json();

        genres.forEach(genre => {

            const option = document.createElement("option");

            option.value = genre;
            option.textContent = genre;

            genreFilter.appendChild(option);

        });

    }

    catch (error) {

        console.log(error);

    }

}

// =======================================
// Search Songs
// =======================================

searchBtn.addEventListener("click", async function () {

    const keyword = searchInput.value.trim();

    if (keyword === "") {

        loadSongs();

        return;

    }

    try {

        const response = await fetch(

            "http://127.0.0.1:5000/search?q=" + encodeURIComponent(keyword)

        );

        const songs = await response.json();

        displaySongs(songs);

    }

    catch (error) {

        console.log(error);

    }

});

// =======================================
// Genre Filter
// =======================================

genreFilter.addEventListener("change", async function () {

    const genre = this.value;

    if (genre === "") {

        loadSongs();

        return;

    }

    try {

        const response = await fetch(

            "http://127.0.0.1:5000/genre/" + encodeURIComponent(genre)

        );

        const songs = await response.json();

        displaySongs(songs);

    }

    catch (error) {

        console.log(error);

    }

});

// =======================================
// Display Songs
// =======================================

function displaySongs(songs) {

    musicGrid.innerHTML = "";

    if (!songs || songs.length === 0) {

        musicGrid.innerHTML = `

            <h3 style="text-align:center;width:100%;">

                No songs found.

            </h3>

        `;

        return;

    }

    songs.forEach(song => {

        const card = document.createElement("div");

        card.className = "music-card";

        card.innerHTML = `
            <div style="width: 100%; height: 160px; background: linear-gradient(135deg, #1db954 0%, #191414 100%); border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 30px rgba(0,0,0,0.5); margin-bottom: 15px;">
                <i class="fa-solid fa-music" style="font-size: 46px; color: rgba(255,255,255,0.9);"></i>
            </div>
            <h3 style="font-size: 17px; font-weight: 600; color: #fff; margin-bottom: 6px;" title="${song.Song}">${song.Song}</h3>
            <p style="color: #bbb; font-size: 14px; margin-bottom: 6px;"><strong>Artist:</strong> ${song.Artist}</p>
            <p style="color: #888; font-size: 13px;"><strong>Genre:</strong> <span style="color: #1DB954; text-transform: capitalize;">${song.Genre}</span></p>
        `;

        musicGrid.appendChild(card);

    });

}

// =======================================
// Enter Key Support
// =======================================

searchInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});

// =======================================
// Initial Load
// =======================================

window.onload = function () {

    loadSongs();

    loadGenres();

};