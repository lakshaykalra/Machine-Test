const awsSDK = require('aws-sdk');

const fs = require('fs');

const universalFunctions=require('./universalFunctions')

awsSDK.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY_ID
});
let s3 = new awsSDK.S3();


const deleteFile = async (path) => {

    let unlink = await universalFunctions.makePromise(fs.unlink)

   return  unlink(path)
}




function uploadFile(filename, fileDirectoryPath,mimeType) {

    return new Promise(async  (resolve, reject)=>{

        try{

            let readFile = await universalFunctions.makePromise(fs.readFile)

            let putObject = await universalFunctions.makePromise(s3.putObject,s3)
    
            let data = await readFile(fileDirectoryPath.toString())
    
            let params = {
                Bucket: process.env.BUCKET,
                Key: filename,
                Body: data,
                ACL: 'public-read',
                ContentType: mimeType
            }
    
            await putObject(params)
    
           await deleteFile(fileDirectoryPath)

            let link=process.env.S3_URL + encodeURIComponent(filename)
    
            resolve(link);

        } catch(error){

            reject(error)

        }
    });
}

module.exports={
    uploadFile
}