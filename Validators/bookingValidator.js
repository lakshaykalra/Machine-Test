const joi=require('joi');
const utils=require('../Utils');



async function createBooking(requestObject,response,next){

    try{

        const schema = joi.object().keys({
            gasStationId: joi.string().trim().required(),
            services: joi.array().required()
        })

       await schema.validateAsync(requestObject.body)

       next()

    } catch(err){

        utils.universalFunctions.sendJoiError(err,response)

    }
}

async function getBookings(requestObject,response,next){

    try{

        const schema = joi.object().keys({
            skip: joi.number().required(),
            limit: joi.number().required()
           
        })

       await schema.validateAsync(requestObject.query)

       next()

    } catch(err){

       return utils.universalFunctions.sendJoiError(err,response)

    }

}

module.exports={
    createBooking,
    getBookings
}