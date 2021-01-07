const utils=require('../Utils')
const models=require('../models')
const appConstants=require('../appConstants')
const mongoose=require('mongoose')


async function createBooking(request,response){
    try{

        const booking=request.body

        const customerId=request.userData.userData.data._id

        const dataToSave={
            gasStationId:booking.gasStationId, 
            customerId, 
            services:booking.services
        }


       const bookingData= await utils.queries.saveData(models.booking,dataToSave)

        const message = utils.responseMessages.BOOKING_CREATED_SUCCESSFULLY

        const dataToSend =  {
            bookingId:bookingData._id
            
        }


        return utils.universalFunctions.sendSuccess(message,dataToSend,response)


    } catch(err){
        return utils.universalFunctions.sendError(err, response)
    }
}



async function getBookings(request,response){
    try{

        const query=request.query

        const gasStationId=mongoose.Types.ObjectId(request.userData.userData.data._id)


        const aggregate=[
            {

                $match:{

                    gasStationId

                }

            },
           
            {
                $lookup: {
                    from: 'customers',
                    let: {
                        id: '$customerId',
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [

                                    {
                                        $eq:['$_id','$$id']
                                    },
                                  
                                    {
                                        $eq: ['$isBlocked', false],
                                    },
                                    {
                                        $eq: ['$isDeleted', false],
                                    },
                                   
                                   
                                ],
                            },
                        },
                    }],
                    as: 'customerData',
                },
            },

            {
                $unwind: {
                    path: '$customerData',
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $sort:{
                    createdAt:-1

                }
            },

            {
                $skip:Number(query.skip)
            },

            {
                $limit:Number(query.limit)
            }


            
        ]


        const aggregateForCount=[
            {

                $match:{

                    gasStationId

                }

            },

            {
                $group: {
                    _id: 'null',
                    sum: {
                        $sum: 1,
                    },
                },
            }  
        ]


        const data=await Promise.all([
            utils.queries.aggregateData(models.booking,aggregate),
            utils.queries.aggregateData(models.booking,aggregateForCount),

        ])

        const message = utils.responseMessages.SUCCESS

        const dataToSend =  {
            bookings:data[0],
            count:data[1][0].sum
            
        }


        return utils.universalFunctions.sendSuccess(message,dataToSend,response)


    } catch(err){
        return utils.universalFunctions.sendError(err, response)
    }
}



module.exports={
    createBooking,
    getBookings
}