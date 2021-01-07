const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    firstName: { type: String },
    lastName: { type: String },
    profilePic: {
        original: { type: String },
        thumb: { type: String }
    }
}, { timestamps: true })

const customerModel = mongoose.model('customer', customerSchema)

module.exports = customerModel;
