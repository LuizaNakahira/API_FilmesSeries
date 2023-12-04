const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', require('./control/userAPI'))
app.use('/install', require('./control/installAPI'))
app.use('/reviews', require('./control/reviewAPI'))
app.use('/works',require('./control/workAPI'))
app.use('/lookingFor', require('./control/lookingForAPI'))

app.listen(3001, () => {
    console.log('App running....')
})