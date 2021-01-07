
const jwt = require('jsonwebtoken')
const utils = require('../Utils')
const appConstants = require('../appConstants')
const models = require('../models')

const checkAuth = (req, res, next) => {

    console.log('<<<<<<<<<<<<<<i am here at auht?>???')
    const token = req.headers['x-access-token'] || req.query['x-access-token']
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {

            try {
                if (err) {
                    throw utils.universalFunctions.createUnauthorizedError(utils.responseMessages.INVALID_TOKEN)
                } else {

                    await validateSession(decoded)
                    //  const model = getModel(decoded.role)

                    const populate = [{
                        path: 'userData.data'
                    }]

                    const criteria = {
                        _id: decoded.userId
                    }


                    const userData = await utils.queries.findOneandPopulate(models.user, criteria, {}, { lean: true }, populate)

                    if (userData && userData.userData && userData.userData.data) {

                        if (userData.userData.data.isBlocked) {
                            throw utils.universalFunctions.createUnauthorizedError(utils.responseMessages.USER_BLOCKED)

                        }
                        else if (userData.userData.data.isDeleted) {
                            throw utils.universalFunctions.createNotFoundError(utils.responseMessages.USER_NOT_FOUND)

                        }

                        req.userData = userData

                        next()

                    } else {
                        throw utils.universalFunctions.createUnauthorizedError(utils.responseMessages.INVALID_TOKEN)

                    }
                }
            } catch (error) {
                return utils.universalFunctions.sendError(error, res)

            }

        })
    } else {
        return utils.universalFunctions.sendError(utils.universalFunctions.createForbiddenError(utils.responseMessages.TOKEN_NOT_PROVIDED), res)

    }

}

const validateSession = async (user) => {
    try {
        const criteria = {
            userId: user.userId,
            _id: user.sessionId,
        };
        const session = await utils.queries.findOne(models.session, criteria);
        if (session) {
            return session;
        }
        else {
            throw utils.universalFunctions.createUnauthorizedError(utils.responseMessages.INVALID_TOKEN)

        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    checkAuth,
    validateSession
}

