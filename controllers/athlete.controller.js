const bcrypt = require('bcrypt');
const { check } = require('express-validator');
const Athlete = require('../models/athlete.model');
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
    res.cookie('jwt', '', {maxAge: 0})
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

    const eventId = req.body.id;

    console.log('Register to event with id: ', eventId)

    
    try {

        //--- Authorize User --- //

        // Access cookie 
        const cookie = req.cookies['jwt'];

        // Decode cookie
        const claims = JWT.verify(cookie, 'secret')
        if (!claims) {
            return res.status(401).json({
                "status": false,
                "data": {"msg": "unauthenticated"}
            })
        }

        // Check if user already registered to event
        const athleteId = claims._id;

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

        // Register User to event
        const result = await Athlete.updateOne(
            { _id: athleteId },
            { $push: {comingFights: eventId }}
        );

        console.log('Successful Register to new event');
        return res.status(200).json({status: true, data: {'msg': 'Successful register'}});

    } catch (err) {
        return res.status(400).json({
            "status": false,
            "data": err
        })
    }
}