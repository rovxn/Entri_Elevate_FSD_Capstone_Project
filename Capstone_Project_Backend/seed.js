require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Team = require("./models/Team");
const Player = require("./models/Player");
const Match = require("./models/Match");

/* -----------------------------
   IPL 2024 TEAMS
--------------------------------*/
const IPL_TEAMS = [
  {
    name: "Chennai Super Kings",
    shortName: "CSK",
    city: "Chennai",
    captain: "Ruturaj Gaikwad",
    coach: "Stephen Fleming",
    homeGround: "M. A. Chidambaram Stadium",
  },
  {
    name: "Mumbai Indians",
    shortName: "MI",
    city: "Mumbai",
    captain: "Hardik Pandya",
    coach: "Mark Boucher",
    homeGround: "Wankhede Stadium",
  },
  {
    name: "Royal Challengers Bengaluru",
    shortName: "RCB",
    city: "Bengaluru",
    captain: "Faf du Plessis",
    coach: "Andy Flower",
    homeGround: "M. Chinnaswamy Stadium",
  },
  {
    name: "Kolkata Knight Riders",
    shortName: "KKR",
    city: "Kolkata",
    captain: "Shreyas Iyer",
    coach: "Chandrakant Pandit",
    homeGround: "Eden Gardens",
  },
  {
    name: "Delhi Capitals",
    shortName: "DC",
    city: "Delhi",
    captain: "Rishabh Pant",
    coach: "Ricky Ponting",
    homeGround: "Arun Jaitley Stadium",
  },
  {
    name: "Rajasthan Royals",
    shortName: "RR",
    city: "Jaipur",
    captain: "Sanju Samson",
    coach: "Kumar Sangakkara",
    homeGround: "Sawai Mansingh Stadium",
  },
  {
    name: "Sunrisers Hyderabad",
    shortName: "SRH",
    city: "Hyderabad",
    captain: "Pat Cummins",
    coach: "Daniel Vettori",
    homeGround: "Rajiv Gandhi Intl Stadium",
  },
  {
    name: "Punjab Kings",
    shortName: "PBKS",
    city: "Mohali",
    captain: "Shikhar Dhawan",
    coach: "Trevor Bayliss",
    homeGround: "IS Bindra Stadium",
  },
  {
    name: "Gujarat Titans",
    shortName: "GT",
    city: "Ahmedabad",
    captain: "Shubman Gill",
    coach: "Ashish Nehra",
    homeGround: "Narendra Modi Stadium",
  },
  {
    name: "Lucknow Super Giants",
    shortName: "LSG",
    city: "Lucknow",
    captain: "KL Rahul",
    coach: "Justin Langer",
    homeGround: "Ekana Cricket Stadium",
  },
];

/* -----------------------------
   PLAYER NAME POOL
--------------------------------*/
const FIRST_NAMES = [
  "Virat", "Rohit", "Shubman", "Ruturaj", "Hardik",
  "Jasprit", "Ravindra", "Sanju", "KL", "David",
  "Glenn", "Andre", "Pat", "Mitchell", "Jos",
  "Shreyas", "Axar", "Ishan", "Tilak", "Rahul"
];

const LAST_NAMES = [
  "Sharma", "Kohli", "Gill", "Pandya", "Bumrah",
  "Jadeja", "Samson", "Rahul", "Warner", "Maxwell",
  "Russell", "Cummins", "Marsh", "Buttler", "Iyer",
  "Patel", "Kishan", "Verma", "Tripathi", "Livingstone"
];

const ROLES = ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"];

/* -----------------------------
   HELPER FUNCTIONS
--------------------------------*/
const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min, max) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));

function generateStats(role) {
  switch (role) {
    case "Batsman":
      return {
        runs: random(1500, 7000),
        wickets: random(0, 20),
        matchesPlayed: random(50, 200),
        average: randomFloat(30, 55),
      };
    case "Bowler":
      return {
        runs: random(100, 800),
        wickets: random(50, 250),
        matchesPlayed: random(50, 200),
        average: randomFloat(15, 25),
      };
    case "All-Rounder":
      return {
        runs: random(1000, 4000),
        wickets: random(30, 150),
        matchesPlayed: random(50, 200),
        average: randomFloat(25, 40),
      };
    case "Wicket Keeper":
      return {
        runs: random(1200, 5000),
        wickets: random(0, 10),
        matchesPlayed: random(50, 200),
        average: randomFloat(28, 45),
      };
  }
}

/* -----------------------------
   SEED FUNCTION
--------------------------------*/
const seedDB = async () => {
  try {
    await connectDB();

    console.log("Clearing old data...");
    await Team.deleteMany();
    await Player.deleteMany();
    await Match.deleteMany();

    console.log("Seeding teams...");
    const teams = await Team.insertMany(IPL_TEAMS);

    console.log("Seeding players...");
    const players = [];

    teams.forEach(team => {
      for (let i = 0; i < 20; i++) {
        const role = ROLES[random(0, 3)];
        const name =
          FIRST_NAMES[random(0, FIRST_NAMES.length - 1)] +
          " " +
          LAST_NAMES[random(0, LAST_NAMES.length - 1)];

        players.push({
          name,
          team: team.name,
          role,
          stats: generateStats(role),
        });
      }
    });

    await Player.insertMany(players);

    console.log("Seeding matches...");

    const matches = [];
    let matchNumber = 1;

    // Double round robin
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        for (let k = 0; k < 2; k++) {
          const team1Score = random(120, 220);
          const team2Score = random(120, 220);

          matches.push({
            matchName: `IPL 2024 Match ${matchNumber}`,
            teams: [teams[i].name, teams[j].name],
            venue: teams[random(0, teams.length - 1)].homeGround,
            status: "completed",
            scores: {
              team1: {
                runs: team1Score,
                wickets: random(3, 10),
                overs: 20,
                extras: random(5, 20),
              },
              team2: {
                runs: team2Score,
                wickets: random(3, 10),
                overs: 20,
                extras: random(5, 20),
              },
            },
            battingTeam:
              team1Score > team2Score
                ? teams[i].name
                : teams[j].name,
          });

          matchNumber++;
        }
      }
    }

    await Match.insertMany(matches);

    console.log("====================================");
    console.log("🔥 IPL Realistic Data Seeded!");
    console.log(`Teams: ${teams.length}`);
    console.log(`Players: ${players.length}`);
    console.log(`Matches: ${matches.length}`);
    console.log("====================================");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
