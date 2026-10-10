# AI-Data-Science-project

# 🎵 MoodTune AI – AI-Based Music Recommendation System

## 📌 Project Overview

**MoodTune AI** is an AI-based music recommendation system that helps users discover songs based on their emotions, music preferences, artists, and genres.

The system combines a web-based user interface with a Python Flask backend to provide personalized music recommendations. Users can express how they feel through a chatbot, explore songs, search for their favorite artists or tracks, and discover similar songs.

The main objective of this project is to make music discovery more interactive and personalized by connecting users' moods and preferences with relevant songs.

## 🎯 Objectives

* Develop a mood-based music recommendation system.
* Identify the user's mood through chatbot input.
* Recommend songs based on the detected mood.
* Allow users to search for songs and artists.
* Provide recommendations for songs similar to a selected track.
* Enable users to explore songs by genre.
* Build an interactive web interface connected to a Python backend.

## ✨ Features

### 1. 💬 AI Mood Chatbot

Users can describe their current feelings in natural language. The chatbot uses the project's mood detection function to identify the mood and returns relevant song recommendations.

### 2. 🎭 Mood-Based Recommendations

Songs are recommended according to the detected mood and the genre mapping defined in the recommendation module. The system ranks matching songs using the dataset's popularity values.

### 3. 🔍 Song and Artist Search

Users can search for songs using a song title or artist name to find matching tracks in the music dataset.

### 4. 🎧 Similar-Song Recommendations

Users can enter a song title to receive recommendations for other songs, depending on the project's implemented recommendation logic.

### 5. 🎼 Music Explorer

The Explorer page allows users to browse songs available in the dataset.

### 6. 🎹 Genre-Based Filtering

Users can explore songs belonging to a selected genre, such as pop or dance, using the available genre-filtering functionality.

### 7. 🌐 Frontend–Backend Integration

The frontend communicates with the Flask backend through HTTP API endpoints to retrieve recommendations and search results dynamically.

## 🛠️ Technologies Used

| Technology     | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| Python         | Backend programming and recommendation logic             |
| Flask          | Backend web framework and API development                |
| Flask-CORS     | Enables cross-origin requests where required             |
| Pandas         | Loading, filtering, and processing music dataset records |
| HTML5          | Web page structure                                       |
| CSS3           | Styling and layout                                       |
| JavaScript     | User interactions and API communication                  |
| JSON           | Data exchange between frontend and backend               |
| Git and GitHub | Version control and project collaboration                |

## 🏗️ System Architecture

The project follows a frontend–backend architecture.

1. **User Interface:** Users interact with the home page, chatbot, recommendation page, and music explorer.
2. **Frontend JavaScript:** Captures user input and sends HTTP requests to the backend.
3. **Flask Backend:** Receives requests and routes them to the appropriate functionality.
4. **Mood Detection:** Processes chatbot messages to identify the user's mood.
5. **Recommendation Module:** Filters and ranks songs using the dataset and the implemented recommendation logic.
6. **Music Dataset:** Provides song titles, artists, genres, and popularity information.
7. **Results Display:** The backend returns JSON responses, which the frontend displays to the user.

## 📁 Project Structure

```text
AI-Data-Science-project/
│
├── backend/
│   └── app.py
│
├── frontend/
│   ├── index.html
│   ├── chatbot.html
│   ├── recommendation.html
│   ├── explorer.html
│   │
│   └── js/
│       ├── chatbot.js
│       ├── recommendation.js
│       ├── explorer.js
│       ├── home.js
│       └── index.js
│
├── recommendation/
│   └── recommendation.py
│
├── chatbot.py
├── README.md
└── requirements.txt
```

*Note: This structure reflects the main files used in development. Keep only files and folders that actually exist in your current repository. The dataset file should also be included in the structure if it is stored in the repository.*

## 🔌 Backend API Endpoints

The Flask backend provides the following API endpoints:

| Method | Endpoint          | Description                                                          |
| ------ | ----------------- | -------------------------------------------------------------------- |
| GET    | `/`               | Checks whether the backend is running                                |
| POST   | `/recommend`      | Detects the mood from chatbot input and returns song recommendations |
| POST   | `/recommend-song` | Returns recommendations related to a specified song                  |
| GET    | `/search?q=`      | Searches for songs using a query                                     |
| GET    | `/explorer`       | Retrieves songs for the Explorer page                                |
| GET    | `/genres`         | Retrieves available music genres                                     |
| GET    | `/genre/<genre>`  | Retrieves songs belonging to a specified genre                       |

### Example: Mood Recommendation Request

**Request:**

```json
{
  "message": "I feel happy today"
}
```

**Example response:**

```json
{
  "mood": "Happy",
  "songs": [
    {
      "Song": "Example Song",
      "Artist": "Example Artist",
      "Genre": "pop"
    }
  ]
}
```

The response is illustrative; actual recommendations depend on the mood detection logic and the dataset.

## ⚙️ Installation and Setup

### Prerequisites

* Python 3.10 or a compatible Python version
* pip
* Git
* A modern web browser

### Step 1: Clone the Repository

```bash
git clone https://github.com/adarshd1080-hash/AI-Data-Science-project.git
```

### Step 2: Open the Project Folder

```bash
cd AI-Data-Science-project
```

### Step 3: Create a Virtual Environment (Recommended)

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

### Step 4: Install Dependencies

If the project contains a `requirements.txt` file:

```bash
pip install -r requirements.txt
```

Otherwise, install the required packages individually:

```bash
pip install flask flask-cors pandas
```

Install any additional packages required by your actual `chatbot.py` and recommendation modules.

### Step 5: Start the Backend

Run the following command from the project root:

```bash
python backend/app.py
```

If your Python installation uses the `py` launcher, you can try:

```bash
py backend/app.py
```

The backend should display a local address, commonly:

```text
http://127.0.0.1:5000
```

Open that address in your browser to verify that the backend is running.

### Step 6: Launch the Frontend

Open `frontend/index.html` in your browser, or use the VS Code Live Server extension if the frontend is configured for it.

Make sure the JavaScript files use the correct backend URL and that the Flask server remains running.

## 🎵 Dataset

The recommendation module uses a music dataset containing fields such as:

* `track_name` – Name of the song.
* `artists` – Artist or artists associated with the song.
* `track_genre` – Genre of the song.
* `popularity` – Popularity score used for ranking recommendations.

The recommendation module filters songs by genre and sorts matching records by popularity to return relevant tracks.

Add the actual dataset name and its source here before publishing the final project documentation.

## 🧪 Testing

The system can be tested using the following scenarios:

1. Submit a message describing a happy, sad, or other supported mood.
2. Verify that the chatbot returns the detected mood and song recommendations.
3. Search for a song using its title.
4. Search for a song using an artist's name.
5. Request similar songs using a track title.
6. Open the Explorer page and verify that song records are displayed.
7. Select a genre and verify that the returned songs match that genre.
8. Check the browser console and Flask terminal if an API request fails.

## 🚀 Future Enhancements

* Integrate facial emotion recognition using an uploaded image or webcam, if supported by the project requirements.
* Improve mood detection using natural language processing.
* Develop more advanced song similarity and personalized ranking methods.
* Add song previews or streaming links where permitted.
* Introduce user accounts and saved playlists.
* Improve the user interface for mobile devices.
* Deploy the application online so that it can be accessed without running a local server.

## 👥 Contributors




## 🙌 Acknowledgements

This project was developed as an academic project to explore artificial intelligence concepts, music recommendation techniques, Python backend development, and frontend–backend integration.
