const express = require("express");
const router = express.Router();

// Import user routes
const userRoutes = require("./routes/user");

router.get("/", (req, res) => {
    res.send("Time Since I by Aaron Jomon");
});

// Use user routes
router.use("/users", userRoutes);

module.exports = router;
