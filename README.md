# Entri Elevate FSD Capstone Project

This repository contains the backend implementation for the Entri Elevate Full Stack Development Capstone Project. The project is a sports management system (CricTracker) that handles player statistics, match records, and user authentication.

## Project Structure

```
.
├── Capstone_Project_Backend/
│   ├── config/             # Database configuration
│   ├── middleware/         # Custom authentication middleware
│   ├── models/             # Mongoose schemas (User, Player, Match)
│   ├── routes/             # API route handlers
│   ├── .env                # Environment variables
│   ├── index.js            # Entry point of the application
│   └── package.json        # Dependencies and scripts
└── Capstone_Project_Frontend/
    ├── public/             # Static assets
    ├── src/
    │   ├── assets/         # static assets
    │   ├── components/     # Reusable UI components
    │   ├── layouts/        # Layout components
    │   ├── pages/          # Application pages
    │   ├── services/       # API integration services
    │   ├── App.jsx         # Main application component
    │   └── main.jsx        # Entry point
    ├── index.html          # HTML entry point
    ├── vite.config.js      # Vite configuration
    └── package.json        # Dependencies and scripts
```

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: Elegant mongodb object modeling for node.js.
- **JWT (JSON Web Tokens)**: Secure way to transmit information between parties.
- **Bcrypt.js**: Library to help hash passwords.

## Getting Started

### Prerequisites

- Node.js installed on your local machine.
- MongoDB database (local or Atlas cluster).

### Installation

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Capstone_Project_Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `Capstone_Project_Backend` directory and add your configuration (see `.env` template in the project).
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5001
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   - For production: `npm start`
   - For development (with nodemon): `npm run dev`

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Capstone_Project_Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get token

### Players
- `POST /api/players` - Add a new player (Admin only)
- `GET /api/players/:id` - Get player details and statistics

### Matches
- `POST /api/matches` - Add a new match record (Admin only)
- `GET /api/matches` - Get all match records
- `PUT /api/matches/:id/score` - Update live score (Admin or Scorer only)

## Week 2 Testing

The current implementation satisfies the **Week 2** assessment criteria for the FSD Capstone Project:
- [x] Express.js server initialization and configuration.
- [x] MongoDB database connection using Mongoose.
- [x] Implementation of User, Player, and Match models.
- [x] JWT-based authentication system.
- [x] Role-based internal API endpoints (Admin, Scorer, and User access).
- [x] Basic error handling and 404 route management.

## Week 3 Tasks & Accomplishments

### 1. Finalize the Backend
All backend components developed in Week 2 were finalized to ensure complete functionality and stability.
- **Authentication & Authorization**: Finalized JWT-based system.
- **User Roles**: Implemented handling for Admin, Scorer, and Viewer roles.
- **Match Status**: Added handling for Live, Paused, and Ended states.
- **Code Quality**: Refactored for better readability and implemented robust error handling.

### 2. API Testing
Thoroughly validated all backend API endpoints using Postman.
- **Coverage**: Tested Auth, Team, Player, and Match APIs.
- **Security**: Verified authorization-protected routes and role-based access control.
- **Edge Cases**: Tested error cases including invalid tokens and unauthorized access.

### 3. Frontend Development
Initiated the frontend using React.js following approved wireframes.
- **Setup**: Initialized project and established folder structure for pages, components, and services.
- **Components**: Developed Login/Signup pages and basic layout components (Navbar).
- **Authentication**: Implemented role-based routing and Axios configuration for API communication.

## Week 4 Tasks: Complete Project & Deployment

### 1. Complete Frontend Development
- [x] Finish building out all frontend components and pages.
- [x] Ensure that the UI/UX is consistent and fully functional.

### 2. Integrate Frontend with Backend
- [x] Connect the frontend with the backend to ensure full communication between the two.
- [x] Test all functionalities thoroughly to ensure they work as expected.

### 3. Deploy the Project
- [x] Deploy your project on Vercel or any other cloud platform of your choice (with whatever you have completed so far).
- [x] Ensure that all features work smoothly in the deployed environment.

> **Note:** Share the backend and frontend GitHub repo links on Notion, along with the live link for your hosted application.

## Week 5 Tasks: Final Polish & Documentation

### 1. Advanced Features Implementation
- [x] **Players Management**: Implemented full Players list with filtering and search.
- [x] **Admin Controls**: Added functionality for Admins to create new players and manage teams.
- [x] **Live Scoring**: Enhanced match details with real-time score updates.

### 2. Final Review & Testing
- [ ] Conduct end-to-end testing of the entire user journey (Signup -> Dashboard -> Create Match -> Update Score).
- [ ] Verify role-based access control (Admin vs User vs Scorer).
- [ ] Ensure responsive design works on mobile and desktop.

### 3. Submission Preparation
- [ ] Finalize `README.md` with complete setup instructions.
- [ ] Record a video walkthrough (optional but recommended).
- [ ] Submit GitHub Repository and Live URL.

## License

This project is licensed under the ISC License.
