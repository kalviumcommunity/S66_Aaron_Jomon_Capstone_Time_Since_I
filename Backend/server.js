require("dotenv").config()
const express = require("express")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const PORT = 3000

const app = express()
app.use(express.json())

const routes = require("./routes")
app.use("/",routes)

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("MongoDB connection successful"))
    .catch(()=>console.log("MongoDB connection failed"))

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})