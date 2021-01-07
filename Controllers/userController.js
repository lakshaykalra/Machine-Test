const utils = require('../Utils')
const models = require('../models')
const appConstants = require('../appConstants')
const jwt = require('jsonwebtoken')



async function createToken(payloadData, time) {
    const expireTime = {
        expiresIn: time * 60,
    };
    return new Promise((resolve, reject) => {
        jwt.sign(payloadData, process.env.JWT_SECRET_KEY, expireTime, (err, jwt) => {
            if (err) {
                reject(err)
            } else {
                resolve(jwt)
            }
        })

    })

}


async function createaccessToken(tokenData, expireTime) {
    try {

        const accessToken = await createToken(tokenData, expireTime)
        if (accessToken) {
            return accessToken
        } else {
            throw utils.universalFunctions.createBadRequestError(utils.responseMessages.DEFAULT)
        }
    } catch (error) {
        throw error
    }
}





async function webSessionManager(webMultiSession, expireTime, sessionData) {
    try {

        const dataToSave = {
            userId: sessionData.userId,
            deviceType: sessionData.deviceType
        }

        if (!webMultiSession) {
            const criteria = {
                userId: sessionData.userId,
                deviceType: appConstants.DEVICE_TYPES.WEB

            }
            await utils.queries.remove(models.session, criteria)


        }
        const session = await utils.queries.saveData(models.session, dataToSave)

        const tokenData = {
            _id: sessionData._id,
            userId: sessionData.userId,
            role: sessionData.role,
            sessionId: session._id

        }

        return createaccessToken(tokenData, expireTime)

    } catch (error) {
        throw error
    }
}



async function sessionManager(sessionData) {
    try {

        let tokenExpireTime = 300  //in minutes

        return webSessionManager(true, tokenExpireTime, sessionData)



    } catch (error) {
        throw error
    }
}

async function userLogin(request, response) {

    try {

        const user = request.body

        const criteria = {
            email: user.userName
        }
        const populate = [{
            path: 'userData.data'
        }]


        const userData = await utils.queries.findOneandPopulate(models.user, criteria, {}, { lean: true }, populate)

        if (userData && userData.userData && userData.userData.data) {

            const encryptPassword = utils.universalFunctions.sha512(user.password, userData.salt).passwordHash // use bcrypt
            if (userData.password !== encryptPassword) {
                throw utils.universalFunctions.createUnauthorizedError(utils.responseMessages.PASSWORD_INCORRECT)
            } else if (userData.userData.data.isBlocked) {
                throw utils.universalFunctions.createForbiddenError(utils.responseMessages.USER_BLOCKED)

            } else if (userData.userData.data.isDeleted) {
                throw utils.universalFunctions.createNotFoundError(utils.responseMessages.USER_NOT_FOUND)

            } else {

                const sessionData = {
                    userId: userData._id,
                    deviceType: user.deviceType,
                    role: userData.role,
                    _id: userData.userData.data._id
                };

                const accessToken = await sessionManager(sessionData)

                const message = utils.responseMessages.LOGGED_IN

                const dataToSend = {
                    accessToken,
                    role: userData.role,
                    userId: userData._id,
                    email: userData.email,
                    profilePic: userData.userData.data.profilePic || { original: "", thumb: "" }

                }


                return utils.universalFunctions.sendSuccess(message, dataToSend, response)

            }
        } else {
            throw utils.universalFunctions.createNotFoundError(utils.responseMessages.USER_NOT_FOUND)
        }

    } catch (err) {

        return utils.universalFunctions.sendError(err, response)

    }

}


const uploadFile = async (request, response) => {
    try {
        const payload = request.body

        let fileName = payload.fileName.replace(/\s+/g, ''); // removes spaces

        if (req.file.size > 3145728) {

            throw utils.universalFunctions.createBadRequestError(utils.responseMessages.FILE_LIMIT_EXCEEDED)

        } else {

            const url = await utils.s3.uploadFile(fileName, request.file.path, request.file.mimetype)


            const message = utils.responseMessages.SUCCESS

            const dataToSend = {
                image: url
            }

            return utils.universalFunctions.sendSuccess(message, dataToSend, response)

        }



    } catch (error) {
        return utils.universalFunctions.sendError(error, res)
    }
}


module.exports = {
    userLogin,
    uploadFile
}