import api from './api';

const applicationService = {
  // Apply for a job
  applyForJob: async (applicationData) => {
    const response = await api.post('/applications/apply', applicationData);
    return response.data;
  },

  // Withdraw application
  withdrawApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  // Update application status (Employer only)
  updateApplicationStatus: async (id, statusData) => {
    const response = await api.put(`/applications/${id}/status`, statusData);
    return response.data;
  },

  // Get my applications (Applicant)
  getMyApplications: async (page = 0, size = 10) => {
    const response = await api.get('/applications/my', {
      params: { page, size }
    });
    return response.data;
  },

  // Get applications for a job (Employer)
  getJobApplications: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  // Get all applications for employer's jobs
  getEmployerApplications: async (page = 0, size = 10) => {
    const response = await api.get('/applications/employer', {
      params: { page, size }
    });
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Check if user has applied for a job
  hasApplied: async (jobId) => {
    const response = await api.get(`/applications/check/${jobId}`);
    return response.data.hasApplied;
  },

  // Get application count for a job
  getApplicationCount: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}/count`);
    return response.data.count;
  },

  // Get applications by status (Employer)
  getApplicationsByStatus: async (status) => {
    const response = await api.get(`/applications/status/${status}`);
    return response.data;
  }
};

export default applicationService;
