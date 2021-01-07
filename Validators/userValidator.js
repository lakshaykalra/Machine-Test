const joi=require('joi');
const utils=require('../Utils');
const appConstants=require('../appConstants')



async function userLogin(requestObject,response,next){

    try{

        const schema = joi.object().keys({
            userName: joi.string().trim().email().required().lowercase(),
            password: joi.string().required(),
            deviceType:joi.number().valid(
                appConstants.DEVICE_TYPES.WEB
            ).required()
        })

       await schema.validateAsync(requestObject.body)

       next()

    } catch(err){

        utils.universalFunctions.sendJoiError(err,response)

    }

}


async function uploadFile(requestObject,response,next){

    try{

        const schema = joi.object().keys({
            fileName: joi.string().required()

        })
       await schema.validateAsync(requestObject.body)

       next()

    } catch(err){

        utils.universalFunctions.sendJoiError(err,response)

    }

}

module.exports={
    userLogin,
    uploadFile
}