# CricTracker Frontend

This directory contains the frontend implementation for the CricTracker sports management system, built with React and Vite.

## Project Structure

```
Capstone_Project_Frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and styles
│   ├── auth/               # Auth components/context
│   ├── components/         # Reusable UI components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Main page components
│   │   ├── Login.jsx       # User login page
│   │   ├── Signup.jsx      # User registration page
│   │   └── Dashboard.jsx   # Main dashboard for matches/stats
│   ├── services/           # API interaction logic
│   │   ├── api.js          # Axios configuration
│   │   └── authService.js  # Authentication services
│   ├── styles/             # Global and component styles
│   ├── App.jsx             # Root component and routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global Tailwind/CSS rules
├── package.json            # Configuration and dependencies
└── vite.config.js          # Vite configuration
```

## Technologies Used

- **React.js**: Frontend library for building the user interface.
- **Vite**: Modern build tool for fast development.
- **Axios**: HTTP client for making API requests to the backend.
- **React Router**: For handling client-side routing.
- **Lucide React**: For high-quality icons.

## Features

- **Authentication**: Fully functional Login and Signup pages.
- **Role-Based Routing**: Secure access to Admin, Scorer, and Viewer views.
- **Responsive Design**: Premium dark-themed UI that works on all devices.
- **Real-time Data**: Integrated with the backend to show live match updates.

## Getting Started

### Prerequisites

- Node.js installed on your local machine.
- Backend server running (refer to the backend README).

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the local URL (usually `http://localhost:5173`).
