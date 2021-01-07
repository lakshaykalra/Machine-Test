const mongoose=blueBird.promisifyAll(require('mongoose'))
mongoose.Promise = blueBird
const appConstants=require('./appConstants')
const utils=require('./Utils')
const models=require('./models')

function connectDatabase(){

    mongoose.connect(process.env.DATABASE_URL, {
        autoReconnect: true,
        useNewUrlParser: true
    }).then((() => {
        mongoose.set('debug', true)
        console.log(`<<<<data base connected>>>>>`)
    })).catch(err => {
        console.log('<<<<<<<ERROR IN CONNECTING TO MONGODB>>>>>>>', err)
    })

};


async function createCustomer(customer){

    try{

        const salt=utils.universalFunctions.genRandomString(16)
        const password=utils.universalFunctions.sha512(customer.password,salt).passwordHash

        const customerObject={
            firstName: customer.firstName,
            lastName: customer.lastName,
        };
    
        const customerData=await utils.queries.saveData(models.customer,customerObject)

        const userObject={
            email:customer.email,
            password,
            role:customer.role,
            salt,
            userData:{
                model:'customer',
                data:customerData._id
            }
        }

        await utils.queries.saveData(models.user,userObject)

        return true

        

    } catch(error){
        throw error
    }
}


async function createGasStationAdmin(gasStationAdmin){
    try{

        const salt=utils.universalFunctions.genRandomString(16)
        const password=utils.universalFunctions.sha512(gasStationAdmin.password,salt).passwordHash

        const gasStationObject={
            gasStationLocation:{
                coordinates:[gasStationAdmin.gasStationLocation.long,gasStationAdmin.gasStationLocation.lat]
            },
            gasStationName:gasStationAdmin.gasStationName,
            services:gasStationAdmin.services

        };
    
        const gasStationData=await utils.queries.saveData(models.gasStation,gasStationObject)

        const userObject={
            email:gasStationAdmin.email,
            password,
            role:gasStationAdmin.role,
            salt,
            userData:{
                model:'gasStation',
                data:gasStationData._id
            }
        }

        await utils.queries.saveData(models.user,userObject)

        return true

    } catch(error){
        throw error
    }
}

const addUsers=false

mongoose.connection.on('connected',async ()=>{

    // creating customer

    if(addUsers){


    const queries=[createCustomer(appConstants.CUSTOMER)]

    appConstants.GAS_STATIONS_ADMINS.forEach(element=>{

        queries.push(createGasStationAdmin(element))

    })

    await Promise.all(queries)

    }


})



 function gracefulExit () {
    mongoose.connection.close(function () {
        process.exit(0);
    });
}

connectDatabase()

process.on('SIGINT',gracefulExit).on('SIGTERM', gracefulExit);