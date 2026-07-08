const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  applyToJob,
  updateJob,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, createJob);
router.route('/:id').get(getJobById).put(protect, updateJob);
router.route('/:id/apply').post(protect, applyToJob);
router.route('/:id/applicants').get(protect, getJobApplicants);
router.route('/:id/applicants/:userId/status').put(protect, updateApplicationStatus);

module.exports = router;
