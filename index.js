const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

// Routes
const events = require('./routes/event.route');
const athletes = require('./routes/athlete.route');

//  --- Connect to Database --- ///
mongoose.connect(process.env.MONGO_URI, {dbName: 'fightHubDB'})
    .then(
        () => { console.log("Connection with database established")},
        err => { console.log("Failed to connect with database", err)}
    );

// ----- Middlewares ---- //

// General
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200', 'https://vasilismoutz.github.io'],
    exposedHeaders: ["set-cookie"]
}));

// Routing
app.use('/api/events', events);
app.use('/api/athletes', athletes);

// --- Start the server --- //
app.listen(port);