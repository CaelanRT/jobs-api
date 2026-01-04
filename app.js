require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger')

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: secret123
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: secret123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Jane Doe
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     JobInput:
 *       type: object
 *       required:
 *         - company
 *         - position
 *       properties:
 *         company:
 *           type: string
 *           example: Acme Corp
 *         position:
 *           type: string
 *           example: Backend Engineer
 *         status:
 *           type: string
 *           enum:
 *             - interview
 *             - declined
 *             - pending
 *           example: pending
 *     Job:
 *       allOf:
 *         - $ref: '#/components/schemas/JobInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 64a1b2c3d4e5f67890123456
 *             createdBy:
 *               type: string
 *               description: MongoDB ObjectId of the user
 *               example: 64a1b2c3d4e5f67890123456
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *     JobsResponse:
 *       type: object
 *       properties:
 *         jobs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Job'
 *         count:
 *           type: integer
 *           example: 1
 */

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

// routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.set('trust proxy', 1);
// extra packages
app.use(rateLimiter({
  windowMs: 15 * 60 *1000,
  max: 100,
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// routes
app.get('/', (req, res) => {
  res.send('<h1>jobs API</h1><a href="/docs">Documentation</a>');
})
app.get('/openapi.json', (req, res) => res.json(swaggerSpec));
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    
    await connectDB(process.env.MONGO_URI)

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
