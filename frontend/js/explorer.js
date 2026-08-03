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

            <img src="https://placehold.co/250x250?text=Music">

            <h3>${song.Song}</h3>

            <p><strong>Artist:</strong> ${song.Artist}</p>

            <p><strong>Genre:</strong> ${song.Genre}</p>

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