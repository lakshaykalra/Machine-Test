const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookingSchema = new Schema({
    gasStationId:{type:Schema.ObjectId,ref:'gasStation'},
    customerId:{type:Schema.ObjectId,ref:'customer'},
    services:{type:Array,required:true},
    profilePic: {
        original: { type: String },
        thumb: { type: String }
    }
}, { timestamps: true })

const bookingModel = mongoose.model('booking', bookingSchema)

module.exports = bookingModel;
