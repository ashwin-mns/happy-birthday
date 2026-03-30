# Birthday Surprise Website

A beautifully crafted, vibrant, and interactive Flask web application designed to create a personalized birthday surprise experience. It allows you to showcase memorable moments, animated videos, and a timeline of special memories. The project also features an easy-to-use Admin Dashboard to upload and manage content dynamically.

## 🌟 Features

- **Dynamic Content Gallery**: Seamlessly mix static images/videos with uploaded content to form a memorable timeline.
- **Admin Dashboard (`/admin`)**: A secure dashboard (`admin` / `love2026` by default) for adding new Moments, Videos, and Memories.
- **SQLite Database Integration**: Reliable local data storage using SQLAlchemy or `/tmp` folder-based SQLite databases for serverless deployments on platforms like Vercel.
- **Automated Windows Script**: Comes with a `RUN_WEBSITE.bat` for automatic 1-click execution (installs dependencies, launches the browser, and starts the server).
- **Responsive Animations**: Beautiful UI polish with interactive animations, styled timelines, and curated transitions.

## 🚀 Getting Started

### Prerequisites
Make sure you have **Python 3.x** and **pip** installed on your system.

### 1-Click Run (Windows)
To quickly start the website and enjoy the surprise locally, just double-click:
```bash
RUN_WEBSITE.bat
```
This script will:
1. Ensure Python is installed.
2. Automatically install required Python packages from `requirements.txt`.
3. Launch your default browser to `http://127.0.0.1:5000`.
4. Start the Flask server.

### Manual Installation (All Platforms)

1. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2. **Run the Flask application:**
    ```bash
    python app.py
    ```

3. **View the website:** Open your browser and navigate to `http://127.0.0.1:5000`.

## 🛠️ Tech Stack

- **Backend Framework**: Python (Flask)
- **Database**: SQLite (managed with flask-sqlalchemy)
- **Frontend**: HTML5, CSS3, Javascript, optimized with custom animations.
- **Production Server Ready**: Integrates Werkzeug for secure user uploads and handles routing optimizations via `vercel.json`.

## ☁️ Deployment

This project is configured out-of-the-box for **Vercel** serverless environments. 
The database will cleanly load into a compatible `/tmp/birthday_surprise.db`, and uploads will dynamically route there as long as the Vercel execution environment variable is present.

## 🔐 Admin Access

By default, the database initializes with the following admin user to populate content:
- **Username**: `admin`
- **Password**: `love2026`

Navigating to `/admin/login` will prompt you to enter these credentials, from which you can upload or delete personalized entries spanning the surprise timeline.

<img width="1904" height="866" alt="Screenshot 2026-03-27 082219" src="https://github.com/user-attachments/assets/8d35693a-53fb-47bd-9ee7-b8b7284ac056" />

<img width="1906" height="868" alt="Screenshot 2026-03-27 082237" src="https://github.com/user-attachments/assets/e7824444-9a1a-4c50-ac4b-3378e184fabc" />

<img width="1919" height="862" alt="Screenshot 2026-03-27 082325" src="https://github.com/user-attachments/assets/04b83fdd-16d8-4c46-9588-cab22a4d2c29" />

<img width="1919" height="875" alt="Screenshot 2026-03-27 082351" src="https://github.com/user-attachments/assets/1bf5583e-9a4d-4875-a622-f297fd9e1907" />

<img width="1919" height="863" alt="Screenshot 2026-03-27 082411" src="https://github.com/user-attachments/assets/8253ee89-3379-44b9-9d55-244817719a64" />

