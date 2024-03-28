require('dotenv').config()
const express = require('express')
const app = express()

// DB CONNECT
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectToDatabase = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Connected to the DB')
    } catch (error) {
        throw new Error(`Error connecting to the DB: ${error}`)
    }
}
connectToDatabase()

// MIDDLEWARE
const cors = require('cors')
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ROUTES
const auth = require('./routes/api/auth')
const users = require('./routes/api/users')
const jobs = require('./routes/api/jobs')
const applications = require('./routes/api/applications')
const abouts = require('./routes/api/abouts')
const educations = require('./routes/api/educations')
const experiences = require('./routes/api/experiences')
const skills = require('./routes/api/skills')
app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/jobs', jobs)
app.use('/api/applications', applications)
app.use('/api/abouts', abouts)
app.use('/api/educations', educations)
app.use('/api/experiences', experiences)
app.use('/api/skills', skills)

// SESSION
const session = require('express-session')
const sk = process.env.SECRET_OR_KEY
app.use(
    session({
        secret: sk,
        resave: true,
        saveUninitialized: true,
    })
)

// SET PORT, and START SERVER
const port = process.env.PORT || 5100
const server = () => {
    try {
        app.listen(port)
        console.log(`We are live at: ${port}`)
    } catch (err) {
        console.log(`Server startup failed: ${err}`)
    }
}
server()

module.exports = {
    app,
    server,
}
