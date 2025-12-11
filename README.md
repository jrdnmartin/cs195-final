# Roommate Chore Tracker
A full-stack application designed to help shared households fairly assign, rotate, and track chores.

This project includes user authentication, household management, chore assignment and rotation, and a polished, responsive UI.

---

## Project Description
Roommate Chore Tracker allows users to create or join a household, add roommates, assign chores, manage completion status, and automatically rotate responsibilities. The goal of the project is to provide a clean, easy-to-use tool that solves a real shared-living problem while demonstrating full-stack development skills.

---

## Tech Stack

### Frontend
- React
- CSS

### Backend
- Express
- REST API with CRUD endpoints
- JWT authentication
- Bcrypt password hashing
- CORS configuration

### Database
- MongoDB
- Mongoose models for Users and Households

### Deployment
- Frontend deployed on Cloudflare
- Backend deployed on Render

---

## Features

### User Accounts
- User registration and login
- Hashed passwords (bcrypt)
- JWT authentication and protected routes

### Household System
- Create a household with a custom name
- Join a household via a unique join code
- Ability to leave a household

### Chores System
- Add new chores
- Assign chores to household members
- Toggle completion state (pending or done)
- Automatically rotate chore assignments fairly
- Delete chores

---

## Setup Instructions

### 1. Clone the repository
```
git clone https://github.com/jrdnmartin/cs195-final.git
cd cs195-final
```

### 2. Install dependencies

#### Backend
```
cd backend
npm install
```

#### Frontend
```
cd ../frontend
npm install
```

---

## Environment Variables

### Backend (.env)
```
PORT=3001
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

---

## Running the App Locally

### Start Backend
```
cd backend
npm run dev
```

### Start Frontend
```
cd frontend
npm run dev
```

The frontend will run on:
```
http://localhost:5173
```
The backend will run on:
```
http://localhost:3001
```

---

## Demo Link

```
Live Demo: https://choreflow.jrdnmartin.com/
```

---

## Reflection

### What was the hardest part of this project?
The most challenging part of this project was handling the user authentication, logins, and session tokens. 

### What are you most proud of?
Figuring out the aforementioned hardest part (user authentication). It took a little while, but eventually I was able to get it all working.

### What would you do differently next time?
I think at its core, the project is pretty well fleshed out, but I think there are certainly more things that I could add to make it a better, more usable application. Especially if I were to further develop and release it, it is too bland at its current state to be valuable.

### How did you incorporate feedback from the check-in gallery?
I gathered feedback on user design, potential suggestions, and what people liked most. I then implemented what I believe were good points of feedback that I also agreed could improve the project.

---

## Contact
Jordan Martin
jordan.martin@drake.edu
