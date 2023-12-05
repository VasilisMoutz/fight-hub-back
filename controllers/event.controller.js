const Event = require('../models/event.model');


exports.register = async (req, res) => {

    // Destructure request 
    const { name, organizer, photo, category, date, location, active } = req.body;

    console.log("Posting new event: ", name);

    // Create new Event 
    const newEvent = new Event({
        name,
        organizer,
        photo,
        category,
        date,
        location,
        active
    });

    // Send new Event to Database
    try {
        const result = newEvent.save();
        res.status(200).json({status: true, data: result});
        console.log("Success posting new event");
    } catch (err) {
        res.status(400).json({status: false, data: err});
        console.log("Failed posting new event");
    }
}

exports.findAll = async (req, res) => {
    console.log("Find all events")
    try {
        const result = await Event.find({});
        res.status(200).json({status: true, data: result})
        console.log("Success finding all events")
    } catch (err) {
        res.status(400).json({status: false, data: err})
        console.log("Failed finding all events")
    }
}

exports.findOne = async (req, res) => {
    const eventId = req.params.eventId;
    console.log("Find an event with id: ", eventId);

    try {
        const result = await Event.findOne({"_id": eventId});
        res.status(200).json({status: true, data: result});
        console.log("Success finding event");
    } catch (err) {
        res.status(400).json({status: false, data: err});
        console.log("Failed to find event");
    }
}