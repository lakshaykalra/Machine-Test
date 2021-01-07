const ROLE = {
  CUSTOMER:1,
  GAS_STATION_ADMIN:2
}

const DEVICE_TYPES = {
    IOS: 1,
    ANDROID: 2,
    WEB: 3
}


const CUSTOMER={
    email:'customer@yopmail.com',
    password:"Qwerty123",
    firstName:'Lakshay',
    lastName:'Kalra',
    role:ROLE.CUSTOMER
}

const GAS_STATION_SERVICES={
    PETROL:1,
    GAS:2,
    DIESEL:3
}

const GAS_STATIONS_ADMINS=[
    {

        email:'gasstationone@yopmail.com',
        password:"Qwerty123",
        gasStationName:'Bharat Petroleum',
        role:ROLE.GAS_STATIONS_ADMIN,
        userData:{
            model: 'gasstations'
        },
        gasStationLocation:{
            lat:30.6799823,
            long:76.7221076

        },
        services:[GAS_STATION_SERVICES.PETROL,GAS_STATION_SERVICES.GAS]

    },
    {

        email:'gasstationtwo@yopmail.com',
        password:"Qwerty123",
        gasStationName:'Hindustan Petroleum',
        role:ROLE.GAS_STATIONS_ADMIN,
        userData:{
            model: 'gasstations'
        },
        gasStationLocation:{
            lat:30.697052,
            long:76.7499767

        },
        services:[GAS_STATION_SERVICES.GAS,GAS_STATION_SERVICES.DIESEL]

    },
    {

        email:'gasstationthree@yopmail.com',
        password:"Qwerty123",
        gasStationName:'Indian Oil',
        role:ROLE.GAS_STATIONS_ADMIN,
        userData:{
            model: 'gasstations'
        },
        gasStationLocation:{
            lat:30.720585,
            long:76.7204823

        },
        services:[GAS_STATION_SERVICES.PETROL,GAS_STATION_SERVICES.GAS,GAS_STATION_SERVICES.DIESEL]

    }
]



module.exports={
    ROLE,
    DEVICE_TYPES,
    CUSTOMER,
    GAS_STATIONS_ADMINS,
    GAS_STATION_SERVICES

}