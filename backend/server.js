const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
