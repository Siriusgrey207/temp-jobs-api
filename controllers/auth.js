const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
    const user = await User.create({ ...req.body }); // On this line, mongoose creates the new user and user the "User" schema to validate the provided user details.
    const token = user.createJWT(); // We invoke the method we created in the relevant model file.
    return res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token }); // Status Code 201 because we are creating a resource (a user); We are sending back the token to the front end and the user.
}

const login = async (req, res) => {
    const { email, password } = req.body;

    // Ensure that both the email and password have been provided by the user
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }

    // If both have been provided, try to find the user by searching for their email in the database.
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }

    // If the user actually exists, let's see of the provided password is a match.
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials")
    }

    // Since everything has went well, we generate the token using the method created for the model.
    const token = user.createJWT();
    return res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

module.exports = { register, login }