from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any
import uvicorn

# Initialize FastAPI application
app = FastAPI(
    title="Student Tech Hub API",
    description="A beginner-friendly API for student technical events and registrations.",
    version="1.0.0"
)

# ---------------------------------------------------------------------------
# CORS (Cross-Origin Resource Sharing) Configuration
# ---------------------------------------------------------------------------
# This allows the frontend (running in a browser, Live Server, or file://)
# to make requests to this backend without browser security blocks.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],            # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],            # Allow all headers
)

# ---------------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------------
class RegistrationRequest(BaseModel):
    name: str
    email: str

# ---------------------------------------------------------------------------
# Sample In-Memory Data
# ---------------------------------------------------------------------------
# Sample upcoming technical events for students
SAMPLE_EVENTS = [
    {
        "id": 1,
        "title": "Intro to Web Development Workshop",
        "category": "Web Dev",
        "date": "October 15, 2026",
        "time": "4:00 PM - 6:00 PM",
        "location": "Lab 3, Tech Block & Online",
        "description": "Learn the essentials of HTML, CSS, and modern JavaScript to build your very first interactive webpage from scratch."
    },
    {
        "id": 2,
        "title": "Python & FastAPI Backend Masterclass",
        "category": "Backend",
        "date": "October 22, 2026",
        "time": "5:00 PM - 7:00 PM",
        "location": "Auditorium Hall B",
        "description": "Understand how APIs work, how to handle HTTP requests, connect frontends, and build lightning-fast web services using Python."
    },
    {
        "id": 3,
        "title": "AI & Machine Learning Student Bootcamp",
        "category": "Artificial Intelligence",
        "date": "November 5, 2026",
        "time": "10:00 AM - 3:00 PM",
        "location": "Virtual (Google Meet)",
        "description": "Discover prompt engineering, computer vision, and neural network fundamentals with hands-on beginner-friendly Python examples."
    },
    {
        "id": 4,
        "title": "Open Source & Git Hackathon 2026",
        "category": "Hackathon",
        "date": "November 18, 2026",
        "time": "9:00 AM - 6:00 PM",
        "location": "Innovation Hub & Discord",
        "description": "Collaborate on real-world open source projects, master Git/GitHub workflows, win cool swag, and showcase your developer portfolio."
    },
    {
        "id": 5,
        "title": "Cloud Computing & DevOps Fundamentals",
        "category": "Cloud & DevOps",
        "date": "December 2, 2026",
        "time": "3:30 PM - 5:30 PM",
        "location": "Seminar Room 101",
        "description": "Get familiar with Docker containers, CI/CD pipelines, and cloud hosting platforms to deploy your full-stack applications with confidence."
    }
]

# Simple in-memory storage for registrations
REGISTRATIONS: List[Dict[str, Any]] = []

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def read_root():
    """Welcome endpoint for testing if the API server is alive."""
    return {
        "status": "success",
        "message": "Welcome to the Student Tech Hub API!",
        "docs_url": "/docs",
        "endpoints": {
            "events": "/api/events",
            "register": "/api/register"
        }
    }


@app.get("/api/events")
def get_events():
    """
    GET /api/events
    Returns the list of upcoming technical events.
    """
    return {
        "status": "success",
        "count": len(SAMPLE_EVENTS),
        "data": SAMPLE_EVENTS
    }


@app.post("/api/register", status_code=status.HTTP_201_CREATED)
def register_student(payload: RegistrationRequest):
    """
    POST /api/register
    Accepts student registration details (name and email).
    """
    # Basic validation
    cleaned_name = payload.name.strip()
    cleaned_email = payload.email.strip()

    if not cleaned_name:
        raise HTTPException(status_code=400, detail="Name cannot be empty.")

    if not cleaned_email or "@" not in cleaned_email:
        raise HTTPException(status_code=400, detail="A valid email address is required.")

    registration_record = {
        "id": len(REGISTRATIONS) + 1,
        "name": cleaned_name,
        "email": cleaned_email
    }
    REGISTRATIONS.append(registration_record)

    return {
        "status": "success",
        "message": f"Awesome! {cleaned_name}, you have been successfully registered.",
        "student": registration_record
    }


# ---------------------------------------------------------------------------
# Run server directly if executed as a script
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
