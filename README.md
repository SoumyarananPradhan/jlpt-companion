# ⛩️ JLPT Companion

A full-stack, spaced-repetition flashcard application designed for Japanese Language Proficiency Test (JLPT) preparation. 

Built with a custom implementation of the SuperMemo-2 (SM-2) algorithm, automated API data scraping, and a bespoke traditional Japanese (Wafu - 和風) UI design system.

![Project Screenshot](https://via.placeholder.com/800x400?text=Insert+Screenshot+of+Dashboard+Here)

## ✨ Key Features

* **🧠 Spaced Repetition System (SRS):** A custom backend implementation of the SM-2 algorithm calculates dynamic review intervals based on user grading, optimizing long-term memory retention.
* **🕷️ Automated Data Scraping:** Features custom Django management commands that connect to the public Jisho.org API, parsing and formatting live JSON data to automatically populate the SQLite database with hundreds of vocabulary words.
* **🔊 Native Audio Pronunciation:** Integrated the browser's native Web Speech API to provide instant, high-quality Japanese text-to-speech without external dependencies.
* **📊 Analytics Dashboard:** A real-time metrics engine tracking total cards studied, daily due loads, and fully mastered vocabulary.
* **🔐 Secure Authentication:** Full JWT (JSON Web Token) authentication architecture, isolating user progress and ensuring secure endpoint access.
* **🎨 Wafu Design System:** A responsive, minimalist user interface inspired by traditional Japanese Karuta cards, Washi paper, and ink brush strokes, built entirely with Tailwind CSS.

---

## 🛠️ Tech Stack

**Frontend:**
* React 18 (Vite)
* Tailwind CSS v4
* React Router DOM
* Axios (with JWT Interceptors)

**Backend:**
* Python 3
* Django & Django REST Framework
* Simple JWT (Authentication)
* Requests (API Scraping)

**Database:**
* SQLite3

---

## 🚀 Local Setup & Installation

To run this project locally, you will need two terminal windows open: one for the Django backend API, and one for the React Vite server.

### 1. Backend Setup
Navigate to the root directory and set up your Python virtual environment:

```bash
# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate  # On Windows

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt requests django-cors-headers

# Apply database migrations
python manage.py migrate

# ⚠️ IMPORTANT: Fetch the initial vocabulary data from the Jisho API
python manage.py fetch_jlpt_vocab

# Start the Django server
python manage.py runserver
The backend API will now be running at http://localhost:8000/

2. Frontend Setup
Open a second terminal, navigate to the frontend folder, and start the Vite server:

Bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
The React app will now be running at http://localhost:5173/

📖 Usage
Open http://localhost:5173/ in your browser.

Click Register to create a new user account.

Log in to access your personalized dashboard.

Select a JLPT deck to begin a study session.

Click the card to reveal the reading and meaning, use the Audio button to hear the pronunciation, and grade your memory (Hard, Good, Easy) to train the SM-2 algorithm.

👨‍💻 Developer Notes
This project was built to demonstrate full-stack proficiency, specifically focusing on integrating algorithmic logic (SM-2) with relational database models, securely handling state and authentication via JWTs, and building highly customized, aesthetically distinct user interfaces.