const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Which promoter the event belongs to
let promotedBySchema = new Schema({
    promoter: {
        type: Schema.Types.ObjectId,
        ref: 'Promoter'
    }
}, {id: false})

// Participating Athletes
let participantsSchema = new Schema({
    participant : {
        type: Schema.Types.ObjectId,
        ref: 'Athlete'
    }
}, {id: false})

let locationSchema = new Schema({
    city: {
        type: String,
        minlength: 3,
        maxlength: 45,
        required: [true, 'City is required field']
    },
    district: {
        type: String,
        minlength: 3,
        maxlength: 45,
    }
}, {_id: false})

let eventSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 45,
        required: [true, 'Name is required field']
    },
    organizer: {
        type: String,
        minlength: 3,
        maxlength: 45,
        required: [true, 'Organizer is required field']
    },
    photo: {
        type: String,
        required: [true, 'Photo is required field']
    },
    category: {
        type: String,
        required: [true, 'Category is required field']
    },
    date: {
        type: Date,
        required: [true, 'Date is required field']
    },
    location: locationSchema,
    promoter: promotedBySchema,
    participants: {
        type: [participantsSchema]
    },
    active: {
        type: Boolean
    }
},
{
    collection: 'events',
    timestamps: true
})

module.exports = mongoose.model('Event', eventSchema);