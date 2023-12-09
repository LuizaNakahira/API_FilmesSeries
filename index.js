const express = require("express")
const path = require("path")
require("dotenv").config()
const bodyParser = require("body-parser");

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./control/userAPI'))
app.use('/install', require('./control/installAPI'))
app.use('/reviews', require('./control/reviewAPI'))
app.use('/works',require('./control/workAPI'))
 
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_doc.json')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(3001, () => {
    console.log('App running....')
})