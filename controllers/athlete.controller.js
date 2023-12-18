const bcrypt = require('bcrypt');
const Athlete = require('../models/athlete.model');
const Event = require('../models/event.model');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');


exports.signup = async (req, res) => {

    // Destructure request
    const { email, password, name, surname, gender, style, weight, record, comingFights } = req.body

    // Validate Athlete doesn't already exists
    let athlete = await Athlete.findOne({email: email})

    //If athlete exists return with 400
    if(athlete) {
        return res.status(400).json({
            "status": false,
            "data": {"msg": "Athlete already exists"}
        })
    }

    // Hash password
    let hashedPassword = await bcrypt.hash(password, 10)

    // Create a new athlete
    const newAthlete = new Athlete({
        email,
        password: hashedPassword,
        name,
        surname,
        gender,
        style,
        weight,
        record,
        comingFights
    });

    // Save new Athlete to database
    console.log('Attempting Register of user: ', name);

    try {
        const result = await newAthlete.save();

        //Return everything except the password
        const {password, ...data} = await result.toJSON();
        res.status(200).json({status: true, data: data});
        console.log(`Successful register of ${name}`);
    } catch (err) {
        res.status(400).json({status: false, data: err});
        console.log(`Failed registering ${name}`);
    }
}

exports.login = async (req, res) => {

    // Check athletes existance
    const athlete = await Athlete.findOne({email: req.body.email});
    if (!athlete) {
        return res.status(400).json({
            "status": false,
            "data": {"msg": "Athlete not found"}
        })
    }

    // Check password 
    if (!await bcrypt.compare(req.body.password, athlete.password)) {
        return res.status(400).json({
            "status": false,
            "data": {"msg": "Invalid Credentials"}
        })
    }

    // Generate JWT 
    const token = JWT.sign({_id: athlete.id}, process.env.JWT_SECRET);

    // Send Cookie
    res.cookie('jwt', token, {
        // Limit access to backend only
        httpOnly: true,
        // Allow cross-origin requests to include cookies.
        sameSite: 'None',
        // Ensure cookie is sent only over secure connections
        secure: true,
        // 1 day access
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        "status": true,
        "data": {"msg": "Login success"}
    })
}

exports.checkAuth = async (req, res) => {

    try {
        // Access cookie 
        const cookie = req.cookies['jwt'];

        // Decode cookie
        const claims = JWT.verify(cookie, process.env.JWT_SECRET);
        if (!claims) {
            res.status(401).json({
                "status": false,
                "data": {"msg": "unauthenticated"}
            })
        }

        // Access Athlete
        const athlete = await Athlete.findOne({_id: claims._id})
        const {password, ...data} = athlete.toJSON()

        res.status(200).json({
            "status": true,
            "data": data
        })
    } catch (err) {
        res.status(401).json({
            "status": false,
            "data": {"msg": "unauthenticated"}
        })
    }   
}

exports.logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 0, httpOnly: true, secure: true, sameSite: 'None'});
    res.status(200).json({
        "status": true,
        "data": {"msg": "Logout success"}
    })
}

exports.findAll = async (req, res) => {
    console.log('Find all athletes');

    try {
        const result = await Athlete.find();
        res.status(200).json({status: true, data: result});
        console.log('Success finding all athletes')
    } catch (err) {
        res.status(400).json({status: false, data: err});
        console.log("Failed finding all athletes")
    }
}

exports.eventRegister = async (req, res) => {

    // string id --> mongoose id
    const eventId = new mongoose.Types.ObjectId(req.body.id);

    // check event existance
    try {
        const event = await Event.findById(eventId);
    } catch (err) {
        return res.status(401).json({
            "status": false,
            "data": {"msg": "Could not find event"}
        })
    }

    // check authorization
    const cookie = req.cookies['jwt'];
    const claims = JWT.verify(cookie, process.env.JWT_SECRET);
    if (!claims) {
        return res.status(401).json({
            "status": false,
            "data": {"msg": "unauthenticated"}
        })
    }

    // Check if user already registered to event
    const athleteId = new mongoose.Types.ObjectId(claims._id);
    try {
        const registered = await Athlete.findOne(
        {
            _id: athleteId,
            comingFights: eventId
        })

        if (registered) {
            console.log('Already registered')
            return res.status(400).json({
                "status": false,
                "data": {"msg": "already registered"}
            })
        }
    } catch (err) {
        return res.status(400).json({
            "status": false,
            "data": {"msg": err}
        })
    }

    // Register User to event
    try {
        console.log("Attempting registration to Event");

        console.log("athlete: ", athleteId);
        console.log("Event:", eventId);

        // Push event id to athlete coming fights
        try {
            await Athlete.updateOne(
                { _id: athleteId },
                { $push: {comingFights: eventId }}
            );
        } catch (err) {
            console.error('Error updating athlete:', err);
        }

        // Push athlete id to event participants
        try {
            await Event.updateOne(
                { _id: eventId },
                { $push: {participants: athleteId }}
            )
        } catch (err) {
            console.error('Error updating event:', err);
        }

        console.log('Successful Register to new event');
        return res.status(200).json({status: true, data: {'msg': 'Successful register'}});

    } catch (err) {
        return res.status(400).json({
            "status": false,
            "data": {"msg": "Error. Could not register", err}
        })
    }
}