const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  applyToJob,
  updateJob,
  getJobApplicants,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, createJob);
router.route('/:id').get(getJobById).put(protect, updateJob);
router.route('/:id/apply').post(protect, applyToJob);
router.route('/:id/applicants').get(protect, getJobApplicants);

module.exports = router;
