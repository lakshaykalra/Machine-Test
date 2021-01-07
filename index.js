const express = require('express')

const bodyParser = require('body-parser')

const app = express()

const controllers = require('./Controllers')

const validators = require('./Validators')

const auth = require('./Utils/auth')

const multer = require('multer')

let tempPath = require('path').resolve(__dirname, '..')

global.blueBird = require('bluebird')

require('dotenv').config()

require('./bootstrap.js')

app.use(bodyParser.json({ limit: '100gb' }))



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempPath + '/temp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage: storage })


app.use('/user/uploadFile', upload.single('file'));


app.post('/user/uploadFile', validators.userValidator.uploadFile, controllers.userController.uploadFile);

app.post('/user/login', validators.userValidator.userLogin, controllers.userController.userLogin)

app.get('/gasStation', validators.gasStationValidator.getAllGasStations, controllers.gasStationController.getAllGasStations)

app.get('/bookings', auth.checkAuth, validators.bookingValidator.getBookings, controllers.bookingController.getBookings)

app.post('/booking', auth.checkAuth, validators.bookingValidator.createBooking, controllers.bookingController.createBooking)



app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})

process.on('uncaughtException', (err) => {
  console.log('<<<<<<uncaught exception occured>>>>', err)
})
