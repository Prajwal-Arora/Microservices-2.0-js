const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Dcumentation',
    version: '1.0.0',
    description: '',
  },
  components: {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        }
    }
},
  security: [{
    bearerAuth: []
  }],
};

const options = {
  swaggerDefinition,
  apis: ['./swagger/*.yaml'],
};

const SwaggerSpec = swaggerJsdoc(options);

module.exports = SwaggerSpec;
