const swaggerAutogen = require('swagger-autogen')()

output = './swagger_doc.json'
endpoints = ['./control/*.js', './helpers/*.js', './model/*.js']

swaggerAutogen(output, endpoints)