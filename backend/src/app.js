const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/auth.routes");

const app = express();

// sdecurity middleware
app.use(helmet());

//parisng incoming JSON requests
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CentralTen API is running."
    });
});

//allowing frontend communication
app.use(cors());

module.exports = app;