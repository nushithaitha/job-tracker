const express = require("express");   // load the Express library
const cors = require("cors");         // load the CORS helper
require("dotenv").config();           // read .env and put values into process.env

const app = express();                // create your server application
app.use(cors());                      // middleware: allow the React app to call this server
app.use(express.json());              // middleware: turn incoming JSON bodies into req.body

app.get("/api/health", (req, res) =>  // a ROUTE: when a GET request hits /api/health...
  res.json({ status: "ok" })          // ...reply with this JSON
);
// Temporary sample data. It will come from PostgreSQL later
const sampleApplications = [
  { id: 101, company: "Atlassian", role: "Graduate Engineer", status: "interview", source: "Referral", appliedOn: "2026-11-22" },
  { id: 102, company: "Flipkart", role: "SDE 1", status: "applied", source: "Career page", appliedOn: "2026-11-21" },
  { id: 103, company: "TCS", role: "Systems Engineer", status: "offer", source: "Off-campus drive", appliedOn: "2026-11-01" },
];

app.get("/api/applications", (req, res) => res.json(sampleApplications));
const PORT = process.env.PORT || 5001              // use PORT from .env, else 5000
app.listen(PORT, () => console.log(`Server running on ${PORT}`)); // start listening