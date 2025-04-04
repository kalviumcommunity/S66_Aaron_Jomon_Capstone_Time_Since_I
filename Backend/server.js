require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors");

const userRoutes = require("./routes/user");

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors());

const routes = require("./routes")
app.use("/",routes)

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("MongoDB connection successful"))
    .catch((err)=>console.log("MongoDB connection failed",err.message))

    app.use("/api/users", userRoutes);

    app.get("/", (req, res) => {
        res.send("Time Since I by Aaron Jomon");
    });

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})