# Entri Elevate FSD Capstone Project

This repository contains the backend implementation for the Entri Elevate Full Stack Development Capstone Project. The project is a sports management system (CricTracker) that handles player statistics, match records, and user authentication.

## Project Structure

```
.
└── Capstone_Project_Backend/
    ├── config/             # Database configuration
    ├── middleware/         # Custom authentication middleware
    ├── models/             # Mongoose schemas (User, Player, Match)
    ├── routes/             # API route handlers
    ├── .env                # Environment variables
    ├── index.js            # Entry point of the application
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

## License

This project is licensed under the ISC License.
