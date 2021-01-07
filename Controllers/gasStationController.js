const utils=require('../Utils')
const models=require('../models')
const appConstants=require('../appConstants')


async function getAllGasStations(request,response){
    try{

        const query=request.query
        const services=[]

        if(query.gas=='true'){
            services.push(appConstants.GAS_STATION_SERVICES.GAS)
        }

        if(query.petrol=='true'){
            services.push(appConstants.GAS_STATION_SERVICES.PETROL)
        }

        if(query.diesel=='true'){
            services.push(appConstants.GAS_STATION_SERVICES.DIESEL)
        }



        const aggregate=[
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [Number(query.longitude), Number(query.latitude)] },
                    distanceField: 'dist.calculated',
                    includeLocs: 'dist.location',
                    query:{isBlocked:false,isDeleted:false, services: { $all: services }  },
                   
                },
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
                $geoNear: {
                    near: { type: 'Point', coordinates: [Number(query.longitude), Number(query.latitude)] },
                    distanceField: 'dist.calculated',
                    includeLocs: 'dist.location',
                    query:{isBlocked:false,isDeleted:false, services: { $all: services }},
                   
                },
            },
            {
                $group: {
                    _id: 'null',
                    sum: {
                        $sum: 1,
                    },
                },
            },
          
        ]



        const data=await Promise.all([
            utils.queries.aggregateData(models.gasStation,aggregate),
            utils.queries.aggregateData(models.gasStation,aggregateForCount),

        ])

        const message = utils.responseMessages.SUCCESS

        const dataToSend =  {
            gasStations:data[0],
            count:data[1][0].sum
            
        }


        return utils.universalFunctions.sendSuccess(message,dataToSend,response)

    } catch(err){

        return utils.universalFunctions.sendError(err, response)

    }
}


module.exports ={
    getAllGasStations
}