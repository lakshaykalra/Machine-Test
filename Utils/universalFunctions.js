const crypto = require('crypto');
const nodeUtils=require('util')



class CustomError {
    constructor(statusCode, message, error) {
        this.statusCode = statusCode || 400
        this.message = message || 'Bad Request'
        this.error = error || 'Bad Request'
        this.isCustomError = true
    }
}


class CustomSuccess {
    constructor(statusCode, data, message) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
    }
}


function createBadRequestError(message) {

    return new CustomError(400, message, 'Bad Request')

}

function createNotFoundError(message) {

    return new CustomError(404, message, 'Not Found')

}

function createUnauthorizedError(message) {

    return new CustomError(401, message, 'Unauthorized')

}

function createForbiddenError(message) {

    return new CustomError(403, message, 'Forbidden')

}

 function genRandomString (length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') 
            .slice(0,length);  
};

function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};


function sendJoiError(error, response) {

    const message = error.details[0].message.replace(/"/g, '')

    return response.status(400).send(new CustomError(400, message, 'Bad Request'))

}

function sendError(error, response) {

    if (error.isCustomError) {
        delete error.isCustomError
        return response.status(error.statusCode).send(error)

    } else{

        return response.status(400).send(new CustomError(400, 'Bad Request', 'Bad Request'))

    }

}

function sendSuccess(message, data, response) {

    new CustomSuccess(200, message, data)

    delete data.message

    return response.status(200).send(new CustomSuccess(200, data, message))

}

 function makePromise(functionName,bindWith){
    let promisifyFunction=nodeUtils.promisify(functionName)

    if(bindWith){

      return promisifyFunction.bind(bindWith)

    } else{
      return promisifyFunction
    }

    
}


module.exports = {

    sendJoiError,
    createBadRequestError,
    sendError,
    createUnauthorizedError,
    createForbiddenError,
    sendSuccess,
    createNotFoundError,
    genRandomString,
    sha512,
    makePromise
    

}