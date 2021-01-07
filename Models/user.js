const mongoose = require('mongoose')
const Schema = mongoose.Schema
const APP_CONSTANTS = require('../appConstants')

const userSchema = new Schema({
    email: { type: String, trim: true, index: true, required: true, unique: true },
    password: { type: String },
    salt:{type:String},
    role: {
        type: Number, enum: [
            APP_CONSTANTS.ROLE.CUSTOMER,
            APP_CONSTANTS.ROLE.GAS_STATION_ADMIN
        ]
    },
    userData: {
        model: { type: String },
        data: { type: Schema.ObjectId, refPath: 'userData.model' }
    }
}, { timestamps: true })



module.exports = mongoose.model('user', userSchema)
