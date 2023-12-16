const mongoose = require('mongoose');
const Schema = mongoose.Schema;
validator = require('validator');

let promoterEvents = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }
}, {id: false})

let promoterSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required field'],
        max: 254,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Email address is not valid'
        }
    },
    name: {
        type: String,
        required: [true, 'Name is required field']
    },
    surname: {
        type: String,
        required: [true, 'Surname is required field']
    },
    // Not restrictions on password because we are expecting a hashed value
    password: {
        type: String,
        required: [true, 'Password is required field'],
    },
    // Organization which promoter represents
    organization: {
        type: String,
        required: [true, 'Organization is required field']
    },
    // Events created
    events: {
        type: [promoterEvents],
        null: true
    }
},
{
    collection: 'promoters',
    timestamps: true
})

module.exports = mongoose.model('Promoter', promoterSchema);