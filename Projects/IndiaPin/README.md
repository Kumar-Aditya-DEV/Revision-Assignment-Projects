# IndiaPin Directory

A modern, glassmorphic UI built with React to search for Indian pincodes and browse location information across states.

## How to Run

### 1. Backend
The backend is an Express server running logic to query location data from MongoDB. It listens on port 5000.
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
The frontend is a Vite-based React application using Framer Motion for animations and Lucide icons for UI.
```bash
cd Frontend
npm install
npm run dev
```

## Features
- **Pincode Search**: Instantly find office details for any 6-digit Indian pincode.
- **State Browsing**: Select any state to see districts and regions with smooth transitions.
- **Modern UI**: Dark mode, glassmorphism, and responsive layout.

## API Integration
The frontend connects to the backend at `http://localhost:5000` using Axios.
- `GET /states`: Fetches all states for the dropdown.
- `GET /api/:pincode`: Fetches details for the search query.
- `GET /states/:stateName`: Fetches data specifically for a chosen state.
