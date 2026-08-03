// =======================================
// MoodTune AI Recommendation Page
// =======================================

const songInput = document.getElementById("songInput");
const searchBtn = document.getElementById("searchBtn");
const genreSelect = document.getElementById("genreSelect");
const resultsContainer = document.getElementById("resultsContainer");
const moodButtons = document.querySelectorAll(".mood-btn");


// =======================================
// Display Songs
// =======================================

function displaySongs(songs) {

    resultsContainer.innerHTML = "";

    if (!songs || songs.length === 0) {

        resultsContainer.innerHTML = `
            <h3 style="text-align:center;">
                No Songs Found
            </h3>
        `;
        return;
    }

    songs.forEach(song => {

        const card = document.createElement("div");

        card.className = "recommend-card";

        card.innerHTML = `

            <img src="https://placehold.co/250x250?text=Music">

            <h3>${song.Song}</h3>

            <p><strong>Artist:</strong> ${song.Artist}</p>

            <p><strong>Genre:</strong> ${song.Genre}</p>

        `;

        resultsContainer.appendChild(card);

    });

}


// =======================================
// Recommend Similar Songs
// =======================================

async function recommendSong() {

    const song = songInput.value.trim();

    if (song === "") {

        alert("Please enter a song name.");

        return;

    }

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/recommend-song",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    song: song

                })

            }

        );

        const songs = await response.json();

        displaySongs(songs);

    }

    catch (error) {

        console.log(error);

        alert("Backend is not running.");

    }

}


// =======================================
// Mood Recommendation
// =======================================

async function recommendMood(mood) {

    try {

        const response = await fetch(

            "http://127.0.0.1:5000/mood/" + mood

        );

        const songs = await response.json();

        displaySongs(songs);

    }

    catch (error) {

        console.log(error);

    }

}


// =======================================
// Genre Filter
// =======================================

async function filterGenre() {

    const genre = genreSelect.value;

    if (genre === "") return;

    try {

        const response = await fetch(

            "http://127.0.0.1:5000/genre/" + genre

        );

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

        const response = await fetch(

            "http://127.0.0.1:5000/genres"

        );

        const genres = await response.json();

        genreSelect.innerHTML =

            `<option value="">All Genres</option>`;

        genres.forEach(genre => {

            const option = document.createElement("option");

            option.value = genre;

            option.textContent = genre;

            genreSelect.appendChild(option);

        });

    }

    catch (error) {

        console.log(error);

    }

}


// =======================================
// Search Button
// =======================================

searchBtn.addEventListener(

    "click",

    recommendSong

);


// =======================================
// Enter Key
// =======================================

songInput.addEventListener(

    "keypress",

    function(event){

        if(event.key==="Enter"){

            recommendSong();

        }

    }

);


// =======================================
// Genre Dropdown
// =======================================

genreSelect.addEventListener(

    "change",

    filterGenre

);


// =======================================
// Mood Buttons
// =======================================

moodButtons.forEach(button=>{

    button.addEventListener(

        "click",

        function(){

            const mood=this.dataset.mood;

            recommendMood(mood);

        }

    );

});


// =======================================
// Page Load
// =======================================

window.onload=function(){

    loadGenres();

};