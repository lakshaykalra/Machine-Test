const joi=require('joi');
const utils=require('../Utils');
const appConstants=require('../appConstants')


async function getAllGasStations(requestObject,response,next){

    try{

        const schema = joi.object().keys({
            skip: joi.number().required(),
            limit: joi.number().required(),
            latitude: joi.number().required(),
            longitude: joi.number().required(),
            gas:joi.boolean().required(),
            petrol:joi.boolean().required(),
            diesel:joi.boolean().required(),
           
        })

       await schema.validateAsync(requestObject.query)

       next()

    } catch(err){

      return  utils.universalFunctions.sendJoiError(err,response)

    }

}  


module.exports={
    getAllGasStations
}