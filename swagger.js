const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Jobs API",
      version: "1.0.0",
      description: "API for managing jobs",
    },
    servers: [
    { url: "http://localhost:3000/api/v1", description: "Local" },
      { url: "https://jobs-api-ci4c.onrender.com/api/v1", description: "Production" },
    ],
  },
  apis: ["./routes/*.js", "./app.js"],
};

module.exports = swaggerJSDoc(options);