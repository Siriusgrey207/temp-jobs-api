const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide company name"],
        maxLength: 50,
    },
    position: {
        type: String,
        required: [true, "Please provide position"],
        maxLength: 100,
    },
    status: {
        type: String,
        enum: ["interview", "declined", "pending"],
        default: "pending",
    },
    createdBy: {
        type: mongoose.Types.ObjectId, // There is a specific type for ids generated by mongoose.
        ref: 'User', // We reference where we are getting the id from.
        required: [true, 'Please provide user']
    }
}, 
{ 
    timestamps: true // Tells mongoose to automatically add "createdAt" and "updatedAt" properties to our documents. Quite useful.
}
);

module.exports = mongoose.model('Job', JobSchema);