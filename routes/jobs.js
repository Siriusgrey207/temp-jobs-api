const express = require("express");
const router = express.Router();

// We want to protect all of our routes as far as our jobs, not just one of them.

const { 
    getAllJobs, 
    getJob, 
    createJob, 
    updateJob, 
    deleteJob 
} = require("../controllers/jobs");

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);

module.exports = router;