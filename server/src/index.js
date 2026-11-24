const express = require("express");   // load the Express library
const cors = require("cors");         // load the CORS helper
require("dotenv").config();           // read .env and put values into process.env

const app = express();                // create your server application
app.use(cors());                      // middleware: allow the React app to call this server
app.use(express.json());              // middleware: turn incoming JSON bodies into req.body

app.get("/api/health", (req, res) =>  // a ROUTE: when a GET request hits /api/health...
  res.json({ status: "ok" })          // ...reply with this JSON
);

const PORT = process.env.PORT || 5001              // use PORT from .env, else 5000
app.listen(PORT, () => console.log(`Server running on ${PORT}`)); // start listening