const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');


const register = async (req,res) => {  

    // create the user from the response and pass it to the schema to validate the incoming data
    const user = await User.create({...req.body});

    //create your jwt token
    const token = user.createJWT();

    // send the created status code, the user is now in the database, sends back the token
    // can send the name and stuff back to the frontend if you want
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token});
}

const login = async (req,res) => {
    
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({email});

    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isCorrectPass = await user.comparePassword(password);

    if (!isCorrectPass) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name}, token});

}

module.exports = {
    register, login
}