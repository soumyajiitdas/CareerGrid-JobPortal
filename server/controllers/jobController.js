const Job = require('../models/jobModel');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Organisation only)
const createJob = async (req, res) => {
  const { title, description, location, type, salaryMin, salaryMax, experienceLevel, educationLevel, requirements, termsAndConditions, applicationDeadline } = req.body;

  if (req.user.role !== 'organisation') {
    return res.status(401).json({ message: 'Not authorized as an organisation' });
  }

  const job = new Job({
    title,
    description,
    company: req.user._id,
    location,
    type,
    salaryMin: salaryMin ?? 0,
    salaryMax: salaryMax ?? 0,
    experienceLevel,
    educationLevel,
    requirements,
    termsAndConditions,
    applicationDeadline: applicationDeadline || null,
  });

  const createdJob = await job.save();
  res.status(201).json(createdJob);
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  const jobs = await Job.find({}).populate('company', 'username profile.companyName');
  res.json(jobs);
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company', 'username profile.companyName profile.description');

  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Jobseeker only)
const applyToJob = async (req, res) => {
  const { resume } = req.body;
  const job = await Job.findById(req.params.id);

  if (job) {
    const alreadyApplied = job.applications.find(
      (acc) => acc.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Job already applied' });
    }

    // Check application deadline
    if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({ message: 'Application deadline has passed for this job' });
    }

    const application = {
      user: req.user._id,
      resume: resume || req.user.profile.resume,
    };

    job.applications.push(application);
    await job.save();
    res.status(201).json({ message: 'Application submitted' });
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
};

// @desc    Update a job (deadline/terms)
// @route   PUT /api/jobs/:id
// @access  Private (Organisation only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const { applicationDeadline, termsAndConditions, salaryMin, salaryMax } = req.body;
    if (applicationDeadline !== undefined) {
      job.applicationDeadline = applicationDeadline ? new Date(applicationDeadline) : null;
    }
    if (termsAndConditions !== undefined) job.termsAndConditions = termsAndConditions;
    if (salaryMin !== undefined) job.salaryMin = salaryMin;
    if (salaryMax !== undefined) job.salaryMax = salaryMax;
    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    console.error('updateJob error:', err);
    res.status(500).json({ message: err.message || 'Failed to update job' });
  }
};

// @desc    Get applicants for a job (org only)
// @route   GET /api/jobs/:id/applicants
// @access  Private (Organisation only)
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('applications.user', 'username email contact profile.fullName profile.avatar');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(job.applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  applyToJob,
  updateJob,
  getJobApplicants,
};
