# Student Tech Hub 🎓💻

A beginner-friendly full-stack web application designed for student tech communities. It displays upcoming campus workshops, hackathons, and bootcamps, and allows students to register with their name and email.

This project is built from scratch without complex frameworks, Docker, databases, or authentication—making it ideal for learning how the frontend and backend communicate over HTTP APIs.

---

## 📁 Project Structure

```text
student-tech-hub/
│
├── frontend/
│   ├── index.html        # Clean, responsive HTML5 layout
│   ├── style.css         # Modern styling and responsive card grid
│   └── script.js         # Vanilla JavaScript handling API calls (fetch)
│
├── backend/
│   ├── main.py           # FastAPI application (GET /api/events & POST /api/register)
│   └── requirements.txt  # Python package dependencies (FastAPI, Uvicorn)
│
└── README.md             # Project documentation and setup guide
```

---

## 🚀 Features

- **Responsive Modern UI:** Crafted with pure HTML5, CSS3, and JavaScript (no React, Next.js, or bundlers needed).
- **Upcoming Technical Events:** View event details including title, category, date, time, location, and description.
- **On-Demand Loading:** Load events from the FastAPI backend at the click of a button.
- **Student Registration:** Simple registration form accepting name and email with input validation and instant visual feedback.
- **CORS Enabled:** Cross-Origin Resource Sharing is configured so the frontend can interact with the backend running on different ports or via local files.
- **Interactive API Documentation:** Automatically generated interactive Swagger documentation provided by FastAPI at `/docs`.

---

## 🛠️ Prerequisites

Before running the application, make sure you have:
1. **Python 3.8+** installed on your system.
   - You can download it from [python.org](https://www.python.org/downloads/).
   - *Windows tip:* When installing Python, make sure to check the box: **"Add Python to PATH"**.
2. Any modern web browser (Chrome, Edge, Firefox, Brave, Safari).

---

## ⚙️ Backend Setup & Installation

### Step 1: Open a Terminal / Command Prompt
Navigate to the `backend/` folder:

```bash
cd backend
```

### Step 2: (Optional but Recommended) Create a Virtual Environment
A virtual environment keeps your project packages isolated:

- **Windows:**
  ```powershell
  python -m venv venv
  .\venv\Scripts\activate
  ```
- **macOS / Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### Step 3: Install Required Dependencies
Run:

```bash
pip install -r requirements.txt
```
*(Tip for Windows: If `pip` is not recognized, run: `python -m pip install -r requirements.txt`)*

This installs:
- `fastapi`: The web framework for creating the API endpoints.
- `uvicorn`: The ASGI server that runs the FastAPI application.
- `pydantic`: Data validation library used by FastAPI.

---

## ▶️ Running the Backend

Inside the `backend/` folder, start the backend server using either of the following commands:

### Method A (Direct Python - Recommended):
```bash
python main.py
```

### Method B (Using Uvicorn):
```bash
python -m uvicorn main:app --reload --port 8000
# or if uvicorn is in your PATH:
uvicorn main:app --reload --port 8000
```

You will see output similar to:
```text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
```

### Test Backend in Your Browser
- API Root: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Events Endpoint: [http://127.0.0.1:8000/api/events](http://127.0.0.1:8000/api/events)
- Interactive API Docs (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🌐 Running the Frontend Locally

You can run the frontend in any of the following easy ways:

### Option 1: Direct File Open (Simplest)
1. Open your file explorer and navigate to the `frontend/` folder.
2. Double-click `index.html` (or right-click -> **Open With** -> your browser).

### Option 2: Using VS Code "Live Server"
1. In VS Code, install the extension **Live Server** by Ritwick Dey.
2. Right-click `frontend/index.html` and click **"Open with Live Server"**.
3. It will open in your browser at `http://127.0.0.1:5500/frontend/index.html`.

### Option 3: Using Python's Built-in HTTP Server
In a new terminal window:
```bash
cd frontend
python -m http.server 3000
```
Then visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 How Frontend and Backend Communicate

Here is how data flows between the frontend and the backend:

```text
[ Browser (frontend) ]                     [ FastAPI Server (backend) ]
    Port 5500 / 3000                           Port 8000
           |                                       |
           | ----- GET /api/events -------------> | (Reads sample events list)
           | <---- JSON response with events ----- |
           |                                       |
           | ----- POST /api/register -----------> | (Validates name & email)
           |       { "name": "...", "email": ... } |
           | <---- HTTP 201 Created -------------- |
```

### 1. Fetching Events (`GET /api/events`)
- When the user clicks the **"Load Events"** button, JavaScript calls `fetch("http://127.0.0.1:8000/api/events")`.
- The FastAPI backend receives the request and returns JSON containing an array of events:
  ```json
  {
    "status": "success",
    "count": 5,
    "data": [
      {
        "id": 1,
        "title": "Intro to Web Development Workshop",
        "category": "Web Dev",
        "date": "October 15, 2026",
        "time": "4:00 PM - 6:00 PM",
        "location": "Lab 3, Tech Block & Online",
        "description": "Learn the essentials of HTML, CSS, and modern JavaScript..."
      }
    ]
  }
  ```
- The frontend JavaScript loops through the array and dynamically generates HTML event cards inside the page.

### 2. Registering a Student (`POST /api/register`)
- When the user submits the form with their Name and Email, JavaScript catches the `submit` event and prevents the default page refresh.
- JavaScript sends a POST request with headers `Content-Type: application/json` and body `JSON.stringify({ name, email })`.
- FastAPI's Pydantic model validates the payload:
  ```python
  class RegistrationRequest(BaseModel):
      name: str
      email: str
  ```
- The backend stores the record in memory and returns a `201 Created` status with a confirmation message:
  ```json
  {
    "status": "success",
    "message": "Awesome! Alex Johnson, you have been successfully registered.",
    "student": {
      "id": 1,
      "name": "Alex Johnson",
      "email": "alex@student.edu"
    }
  }
  ```
- The frontend displays a green success alert and resets the form.

### 3. Cross-Origin Resource Sharing (CORS)
- Because the frontend and backend run on different origins or ports (e.g. `http://127.0.0.1:5500` and `http://127.0.0.1:8000`), web browsers would normally block the requests for security reasons.
- In `backend/main.py`, FastAPI's `CORSMiddleware` is configured to allow requests from any origin:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
  This allows smooth, seamless communication without browser CORS errors.

---

## 💡 Beginner Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"Backend: Offline" badge or Load Events fails** | The FastAPI server is not currently running | Run `python main.py` inside the `backend/` folder and verify it says `Uvicorn running on http://127.0.0.1:8000`. |
| **'python' is not recognized** | Python is not installed or not in PATH | Install Python from [python.org](https://www.python.org/) and be sure to check **"Add Python to PATH"**. |
| **Port 8000 already in use** | Another application is running on port 8000 | Run on a different port: `uvicorn main:app --reload --port 8001`, and update `API_BASE_URL` in `frontend/script.js` to match. |

---

## 📜 License

This project is open-source and free to use for learning, classroom demonstrations, and campus workshops!
