const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gasStationSchema = new Schema({
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    gasStationLocation: {
        type: { type: String, enum: "Point", default: "Point" },
        coordinates: { type: [Number], default: [0, 0] } // coordinates[0] = longitute coordinates[1] = latitide 
    },
    gasStationName: { type: String },
    services:{type:Array},
    admin:{type:Schema.ObjectId,ref:'users'}


}, { timestamps: true })

gasStationSchema.index({ 'gasStationLocation.coordinates': "2dsphere" });

module.exports= mongoose.model('gasStation', gasStationSchema)


