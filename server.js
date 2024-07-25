const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const gameRoutes = require("./routes/gameRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", gameRoutes); // Mount the game routes at /api path

const mongoDB =
  process.env.MONGODB_URI ||
  "mongodb+srv://ricohermosoryan14344:EkWdu0wuijTsQNS9@cluster0.oi0xl9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoDB)
  .then(() => console.log("Database Connected..."))
  .catch((err) => console.log("Error connecting database", err));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
