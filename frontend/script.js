/**
 * Student Tech Hub - Frontend Client Script
 * 
 * Demonstrates:
 * 1. Fetching data with HTTP GET from a FastAPI backend.
 * 2. Sending user input with HTTP POST using JSON.
 * 3. Dynamic DOM manipulation to display event cards and alerts.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
// The base URL of our FastAPI backend server
const API_BASE_URL = "http://127.0.0.1:8000";

// ---------------------------------------------------------------------------
// DOM Elements
// ---------------------------------------------------------------------------
const loadEventsBtn = document.getElementById("loadEventsBtn");
const btnText = document.getElementById("btnText");
const eventsContainer = document.getElementById("eventsContainer");
const eventsAlert = document.getElementById("eventsAlert");

const registrationForm = document.getElementById("registrationForm");
const studentNameInput = document.getElementById("studentName");
const studentEmailInput = document.getElementById("studentEmail");
const submitRegisterBtn = document.getElementById("submitRegisterBtn");
const registerAlert = document.getElementById("registerAlert");

const apiStatusBadge = document.getElementById("apiStatusBadge");
const apiStatusText = document.getElementById("apiStatusText");
const statusDot = apiStatusBadge.querySelector(".status-dot");

// ---------------------------------------------------------------------------
// Helper Functions for UI Alerts
// ---------------------------------------------------------------------------

/**
 * Display a feedback message inside an alert box
 * @param {HTMLElement} element - Alert container
 * @param {string} message - Message text or HTML
 * @param {'success'|'error'|'info'} type - Type of alert
 */
function showAlert(element, message, type = "info") {
  element.className = `alert alert-${type}`;
  element.innerHTML = message;
  element.classList.remove("hidden");
}

/**
 * Hide an alert box
 * @param {HTMLElement} element - Alert container
 */
function hideAlert(element) {
  element.classList.add("hidden");
  element.innerHTML = "";
}

// ---------------------------------------------------------------------------
// Check Backend Server Status
// ---------------------------------------------------------------------------
async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`, { method: "GET" });
    if (response.ok) {
      statusDot.className = "status-dot online";
      apiStatusText.textContent = "Backend: Connected (Port 8000)";
      return true;
    }
  } catch (error) {
    statusDot.className = "status-dot offline";
    apiStatusText.textContent = "Backend: Offline (Start FastAPI server)";
    return false;
  }
}

// ---------------------------------------------------------------------------
// Feature 1: Load Events from Backend (GET /api/events)
// ---------------------------------------------------------------------------
async function fetchEvents() {
  hideAlert(eventsAlert);
  
  // Update button state to loading
  loadEventsBtn.disabled = true;
  btnText.textContent = "Loading...";

  try {
    const response = await fetch(`${API_BASE_URL}/api/events`);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    const events = result.data || [];

    // Update status badge since the call succeeded
    statusDot.className = "status-dot online";
    apiStatusText.textContent = "Backend: Connected (Port 8000)";

    renderEvents(events);

    showAlert(
      eventsAlert,
      `&#9989; Successfully loaded <strong>${events.length}</strong> upcoming events from backend!`,
      "success"
    );

    // Auto-hide success alert after 4 seconds
    setTimeout(() => hideAlert(eventsAlert), 4000);

  } catch (error) {
    console.error("Error loading events:", error);

    statusDot.className = "status-dot offline";
    apiStatusText.textContent = "Backend: Offline";

    showAlert(
      eventsAlert,
      `<strong>Unable to load events.</strong><br>` +
      `Make sure your FastAPI backend is running at <code>${API_BASE_URL}</code>.<br>` +
      `<small>Run: <code>python main.py</code> inside the <code>backend/</code> folder.</small>`,
      "error"
    );
  } finally {
    // Restore button state
    loadEventsBtn.disabled = false;
    btnText.textContent = "Refresh Events";
  }
}

/**
 * Render the array of events into HTML cards
 * @param {Array} events - List of event objects
 */
function renderEvents(events) {
  if (!events || events.length === 0) {
    eventsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">&#128533;</div>
        <h3>No events found</h3>
        <p>No technical events are currently scheduled. Check back later!</p>
      </div>
    `;
    return;
  }

  // Build the HTML cards
  const cardsHtml = events.map(event => `
    <article class="event-card">
      <div class="event-top">
        <h3 class="event-title">${escapeHtml(event.title)}</h3>
        <span class="event-badge">${escapeHtml(event.category || 'Tech')}</span>
      </div>

      <div class="event-meta">
        <span class="meta-item">&#128197; ${escapeHtml(event.date)}</span>
        <span class="meta-item">&#9200; ${escapeHtml(event.time)}</span>
        <span class="meta-item">&#128205; ${escapeHtml(event.location)}</span>
      </div>

      <p class="event-desc">${escapeHtml(event.description)}</p>
    </article>
  `).join("");

  eventsContainer.innerHTML = cardsHtml;
}

// ---------------------------------------------------------------------------
// Feature 2: Register Student (POST /api/register)
// ---------------------------------------------------------------------------
async function handleRegistration(event) {
  event.preventDefault(); // Stop page reload
  hideAlert(registerAlert);

  const name = studentNameInput.value.trim();
  const email = studentEmailInput.value.trim();

  // Simple client-side validation
  if (!name) {
    showAlert(registerAlert, "Please enter your full name.", "error");
    studentNameInput.focus();
    return;
  }

  if (!email || !email.includes("@")) {
    showAlert(registerAlert, "Please enter a valid email address.", "error");
    studentEmailInput.focus();
    return;
  }

  // Disable button while sending
  submitRegisterBtn.disabled = true;
  submitRegisterBtn.innerHTML = `<span>Registering...</span>`;

  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email })
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.detail || "Registration failed. Please try again.";
      throw new Error(errorMsg);
    }

    // Success response
    showAlert(
      registerAlert,
      `&#127881; <strong>Success!</strong> ${escapeHtml(result.message || 'You are registered!')}`,
      "success"
    );

    // Reset the form fields
    registrationForm.reset();

  } catch (error) {
    console.error("Error submitting registration:", error);

    showAlert(
      registerAlert,
      `<strong>Registration Error:</strong> ${escapeHtml(error.message)}.<br>` +
      `<small>Ensure the backend is running at <code>${API_BASE_URL}</code>.</small>`,
      "error"
    );
  } finally {
    // Restore submit button
    submitRegisterBtn.disabled = false;
    submitRegisterBtn.innerHTML = `<span>Register Now</span><span class="btn-arrow">&rarr;</span>`;
  }
}

// ---------------------------------------------------------------------------
// Utility: Escape HTML to prevent XSS
// ---------------------------------------------------------------------------
function escapeHtml(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------------------------------------------------------------------------
// Event Listeners & Initial Setup
// ---------------------------------------------------------------------------
loadEventsBtn.addEventListener("click", fetchEvents);
registrationForm.addEventListener("submit", handleRegistration);

// Run health check on initial load
document.addEventListener("DOMContentLoaded", () => {
  checkBackendHealth();
});
