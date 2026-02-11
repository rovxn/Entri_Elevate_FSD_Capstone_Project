# Entri Elevate FSD Capstone Project - CricTracker

CricTracker is a comprehensive sports management system designed for the Entri Elevate Full Stack Development Capstone Project. It provides a robust platform for managing cricket tournaments, including real-time score updates, player statistics, team management, and role-based user access.

## Key Features

- **Live Score Updates**: Real-time tracking of match scores and status (Live, Paused, Ended).
- **Role-Based Access Control (RBAC)**:
    - **Admin**: Full control over teams, players, and matches.
    - **Scorer**: Authorized to update match scores in real-time.
    - **Viewer**: Read-only access to match feeds and statistics.
- **Team & Player Management**: Comprehensive admin panel to create, edit, and delete teams and players.
- **Interactive Dashboard**: A user-friendly dashboard displaying live matches, recent results, and key statistics.
- **Responsive Design**: fully optimized for desktop, tablet, and mobile devices with a modern, clean, and neutral aesthetic.
- **Search & Filtering**: Efficient search functionality for players and matches.

## Technologies Used

### Frontend
- **React.js**: Component-based UI library.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework for custom, responsive design.
- **Lucide React**: Beautiful & consistent icons.
- **Axios**: Promise-based HTTP client for API requests.
- **React Router**: Declarative routing for React applications.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast, unopinionated web framework.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **JWT (JSON Web Tokens)**: Secure authentication mechanism.
- **Bcrypt.js**: Libray for hashing passwords.

## Project Structure

```
.
├── Capstone_Project_Backend/
│   ├── config/             # Database configuration
│   ├── middleware/         # Custom authentication middleware
│   ├── models/             # Mongoose schemas (User, Player, Match, Team)
│   ├── routes/             # API route handlers
│   ├── .env                # Environment variables
│   ├── index.js            # Entry point of the application
│   └── package.json        # Dependencies and scripts
└── Capstone_Project_Frontend/
    ├── public/             # Static assets
    ├── src/
    │   ├── assets/         # Static assets (images, fonts)
    │   ├── components/     # Reusable UI components (Modal, Card, etc.)
    │   ├── layouts/        # Layout components (Navbar)
    │   ├── pages/          # Application pages (Dashboard, Admin, Players, Login)
    │   ├── services/       # API integration services (auth, player, team)
    │   ├── utils/          # Utility functions (image helpers, formatters)
    │   ├── App.jsx         # Main application component with routes
    │   └── main.jsx        # Entry point
    ├── index.html          # HTML entry point
    ├── index.css           # Global styles and Tailwind directives
    ├── vite.config.js      # Vite configuration
    └── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)

### Installation

#### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd Capstone_Project_Backend
npm install
```

Create a `.env` file in `Capstone_Project_Backend` with the following:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

#### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd Capstone_Project_Frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team (Admin only)
- `PUT /api/teams/:id` - Update team details (Admin only)
- `DELETE /api/teams/:id` - Delete a team (Admin only)

### Players
- `GET /api/players` - Get all players
- `POST /api/players` - Create a new player (Admin only)
- `PUT /api/players/:id` - Update player details (Admin only)
- `DELETE /api/players/:id` - Delete a player (Admin only)

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create a new match (Admin only)
- `PUT /api/matches/:id/score` - Update live score (Admin or Scorer only)

## Capstone Progress & Roadmap

### Week 1-2: Foundation
- [x] Backend initialization with Express & MongoDB.
- [x] Database schema design (User, Player, Match).
- [x] JWT Authentication & Role-based routes.

### Week 3: Frontend Integration
- [x] React project setup with Vite.
- [x] Authentication pages (Login/Signup).
- [x] Backend API integration.

### Week 4: Core Features
- [x] Dashboard implementation.
- [x] Live score updates.
- [x] Deployment preparation.

### Week 5: Polish & Advanced Features (Current)
- [x] **Player Management**: Full CRUD capabilities for players.
- [x] **Team Management**: Admin panel to manage teams.
- [x] **Admin Dashboard**: Centralized control for system data.
- [x] **UI/UX Overhaul**: Adopted a clean, neutral, and modern design system.
- [x] **Responsive Optimization**: Ensured seamless experience across devices.
- [x] **Final Testing**: End-to-end verification of user flows.

## License

This project is licensed under the ISC License.
