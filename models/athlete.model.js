const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

let recordSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    completed: {
        type: Boolean
    }
}, {_id: false})


let athleteSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required field'],
        max: 254,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Email address is not valid',
        },
    },
    // Not restrictions on password because we are expecting a hashed value
    password: {
        type: String,
        required: [true, 'Password is required field'],
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 45,
        required: [true, 'Name is required field']
    },
    surname: {
        type: String,
        minlength: 3,
        maxlength: 45,
        required: [true, 'Surname is required field']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    style: {
        type: String,
        enum: ['Brazilian Jiu Jitsu', 'Muay Thai', 'Boxing', 'MMA'],
    },
    weight: {
        type: Number,
        required: true
    },
    record: {
        type: [recordSchema], 
        null: true
    },
    comingFights: [String]
},
{
    collection: 'athletes',
    timestamps: true
})

module.exports = mongoose.model('Athlete', athleteSchema);
