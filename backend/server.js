const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const householdRoutes = require("./routes/householdRoutes");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE_URL = process.env.CLIENT_ORIGIN;

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
}));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use(`${API_BASE_URL}/auth`, authRoutes);
app.use(`${API_BASE_URL}/household`, householdRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
