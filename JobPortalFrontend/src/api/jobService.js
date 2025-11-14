import api from './api';

const jobService = {
  // Get all jobs with pagination
  getAllJobs: async (page = 0, size = 10) => {
    const response = await api.get('/jobs', {
      params: { page, size }
    });
    return response.data;
  },

  // Search jobs with filters
  searchJobs: async (searchParams) => {
    const response = await api.post('/jobs/search', searchParams);
    return response.data;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create new job (Employer only)
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job (Employer only)
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job (Employer only)
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Close job posting (Employer only)
  closeJob: async (id) => {
    const response = await api.put(`/jobs/${id}/close`);
    return response.data;
  },

  // Get jobs posted by employer
  getEmployerJobs: async () => {
    const response = await api.get('/jobs/employer/my-jobs');
    return response.data;
  },

  // Save job (Applicant only)
  saveJob: async (id) => {
    const response = await api.post(`/jobs/${id}/save`);
    return response.data;
  },

  // Unsave job (Applicant only)
  unsaveJob: async (id) => {
    const response = await api.delete(`/jobs/${id}/save`);
    return response.data;
  },

  // Get saved jobs (Applicant only)
  getSavedJobs: async () => {
    const response = await api.get('/jobs/saved');
    return response.data;
  }
};

export default jobService;
