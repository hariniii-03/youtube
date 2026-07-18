# CareerMatch — Student Job Matching Platform

A full-stack platform where students create a profile and get **matched + ranked** against job and internship postings using an explainable rule-based scoring engine.

## 🧱 Project Structure

```
youtube/
├── backend/          # Spring Boot REST API (Java 17, H2 Database)
├── node-backend/     # Node.js/Express mock backend (zero Java requirement)
└── frontend/         # Angular 18 Single Page Application
```

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Angular 18 (Standalone Components)  |
| Backend   | Node.js + Express (or Spring Boot)  |
| Database  | In-memory (H2 / Node.js Array)      |
| Styling   | Custom CSS (Premium UI)             |

---

## 🚀 Running Locally

### 1. Start the Node.js Backend
```bash
cd node-backend
npm install
npm start
# → Server running at http://localhost:8080
```

### 2. Start the Angular Frontend
```bash
cd frontend
npm install
npm start
# → App running at http://localhost:4200
```

---

## 🎯 Matching Logic

Each job posting is scored on three weighted factors:

| Factor            | Weight | Logic                                                              |
|-------------------|--------|--------------------------------------------------------------------|
| Work Authorization | 30%  | Hard fail (0%) if student needs visa but job doesn't offer it      |
| GPA               | 20%   | Student GPA ≥ job minimum GPA                                      |
| Skills Overlap    | 50%   | `(matched skills / total required skills) × 50%`                  |

### Score Breakdown Tooltip
Every job card displays the computed score and a hoverable tooltip explaining exactly **why** the student matched (or didn't).

---

## ✨ Features

- **Profile Builder** — Skills tags, GPA slider, Visa status toggle
- **Ranked Matching** — Jobs sorted descending by match score
- **Explainable AI Badge** — Hover tooltip shows reason for score
- **Smart Filters** — Filter by Work Mode, Location, Sponsorship
- **Application Tracker** — Mark jobs as Applied/Interviewing/Offer/Rejected

---

## 🌐 Deployment Notes

- Backend binds to `process.env.PORT || 8080` for seamless platform hosting (Render, Heroku, Railway, etc.)
- Frontend dynamically switches API URL between `localhost:8080` (dev) and `/api` (production)

---

## 📁 API Endpoints

| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| POST   | `/api/students`                 | Create or update a student profile   |
| GET    | `/api/jobs`                     | Retrieve all job postings            |
| GET    | `/api/students/:id/matches`     | Get ranked job matches for a student |
