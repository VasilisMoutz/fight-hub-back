const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let participantsSchema = new Schema({
    type: Schema.Types.ObjectId,
    ref: 'Athlete'
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