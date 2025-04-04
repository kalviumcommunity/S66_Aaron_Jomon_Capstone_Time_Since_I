require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors");

const userRoutes = require("./routes/user");
const activityRoutes = require("./routes/activity");

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);

app.get("/", (req, res) => {
    res.send("Time Since I by Aaron Jomon");
});

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("MongoDB connection successful"))
    .catch((err)=>console.log("MongoDB connection failed",err.message))

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})