const Job = require("../models/Job")
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
    // The user object is present in all of the job routes, because we placed the "authenticateUser" before all of our job routes.
    // Using this we can find the jobs created by the particular user.
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt'); // mongoose method
    return res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}

const getJob = async (req, res) => {
    // On the line below we gain access to both the userId and the jobId
    const { user: { userId }, params: { id: jobId } } = req;

    // Ensure that a single job is returned to the correct user (this is why we also check for the userId).
    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    })
    // We don't to find the correct job, but return it to somebody that didn't make it.

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    return res.status(StatusCodes.OK).json({ job });
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId; // Get the user id set it in the job document. This allows us to point to the user that created the job.
    const job = await Job.create(req.body);
    return res.status(StatusCodes.CREATED).json({ job });
}

const updateJob = async (req, res) => {
    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req;

    // When it comes to updating a job, we want to ensure that the company or the position are not empty.
    if (company === "" || position === "") {
        throw new BadRequestError("Company or Position fields cannot be empty.")
    }

    // Job.findOneAndUpdate(*find the item to be updated*, *what we want to update it with*, *options*)
    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId}, req.body, { new: true, runValidators: true });

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    return res.status(StatusCodes.OK).json({ job });
}

const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    
    // For this operation we are going to use the findOneAndRemove method.
    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId
    })

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    return res.status(StatusCodes.OK).send();
}

module.exports = { 
    getAllJobs, 
    getJob, 
    createJob, 
    updateJob, 
    deleteJob 
};