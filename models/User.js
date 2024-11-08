const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name.'], // [*whether it is required or not*, *the custom error message*]
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide email.'], // [*whether it is required or not*, *the custom error message*]
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
        unique: true, // Creates a unique index
    },
    password: {
        type: String,
        required: [true, 'Please provide password.'], // [*whether it is required or not*, *the custom error message*]
        minLength: 6,
    },
})

// Notice how here we are using "function () {}" instead of the "() => {}" syntax. This is because "function () {}" provides us access to this.
UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);                  // Generate the salt
    this.password = await bcrypt.hash(this.password, salt); // "this." refers to the current document; has the password
    next();
})
// Also, in the current version of mongoose, invoking next and passing it as an argument is not necessary.

// Here we have used the "function () {} syntax so that we have access to this.name"
UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME, })
}
// We have created a createJWT method that can be invoked anywhere to generate our jsonwebtoken. For example, this has been invoked in the controllers/auth.js

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model("User", UserSchema);