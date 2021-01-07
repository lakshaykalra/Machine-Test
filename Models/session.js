const mongoose = require('mongoose')
const Schema = mongoose.Schema
const APP_CONSTANTS = require('../appConstants')

const sessionSchema = new Schema({
    userId: { type: Schema.ObjectId, ref: 'user' },
    deviceType: {
        type: Number, enum: [
            APP_CONSTANTS.DEVICE_TYPES.IOS,
            APP_CONSTANTS.DEVICE_TYPES.ANDROID,
            APP_CONSTANTS.DEVICE_TYPES.WEB
        ]
    },

}, { timestamps: true })

const sessionModel = mongoose.model('session', sessionSchema)

module.exports = sessionModel;
