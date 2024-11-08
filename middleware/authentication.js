const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
    // Check for the req.headers.authorization headers
    const authHeader = req.headers.authorization;

    // Ensure correct form of the token.
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnauthenticatedError("Authentication invalid")
    }

    // Get the token
    const token = authHeader.split(" ")[1];

    // Use jwt.verify to verify the token
    try {
        // Here we are getting the payload that we have set up in our route. (relevent logic in the user model)
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the user to the job routes
        req.user = { userId: payload.userId, name: payload.name };

        // --- Alternative code for the line above
        // const user = User.findById(payload.id).select('-password'); // Find the user in the database and remove the password
        // req.user = user;
        // 

        next();
    } catch(error) {
        throw new UnauthenticatedError("Authentication invalid");
    }
}

module.exports = auth;