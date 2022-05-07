const express = require('express')
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')


dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, () => {
    console.log("Conntected to MongoDB")
})

// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.get('/', (req, res) => {
    res.send("Hello World!")
})


app.listen(3000, () => {
    console.log("3000 PORT")
})

