const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const pincodeRoutes = require("./routes/pincode.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api", pincodeRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("🚀 Backend is active and running!");
});

module.exports = app;
