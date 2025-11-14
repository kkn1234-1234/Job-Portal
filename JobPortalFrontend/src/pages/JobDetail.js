import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Building, Briefcase, Clock, IndianRupee, 
  Calendar, Bookmark, BookmarkCheck, Send, CheckCircle,
  GraduationCap, Award, FileText, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import jobService from '../api/jobService';
import applicationService from '../api/applicationService';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    resumeUrl: ''
  });

  useEffect(() => {
    loadJobDetails();
    if (isAuthenticated && user?.role === 'APPLICANT') {
      checkApplicationStatus();
      checkSavedStatus();
    }
  }, [id]);

  const loadJobDetails = async () => {
    try {
      const data = await jobService.getJobById(id);
      setJob(data);
    } catch (error) {
      console.error('Error loading job details:', error);
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const experienceRange = job?.minExperience && job?.maxExperience
    ? `${job.minExperience} - ${job.maxExperience} years`
    : job?.minExperience
    ? `Min ${job.minExperience} years`
    : job?.maxExperience
    ? `Max ${job.maxExperience} years`
    : null;

  const formattedDeadline = job?.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  const checkApplicationStatus = async () => {
    try {
      const applied = await applicationService.hasApplied(id);
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const checkSavedStatus = async () => {
    try {
      const savedJobs = await jobService.getSavedJobs();
      setIsSaved(savedJobs.some(savedJob => savedJob.id === parseInt(id)));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await jobService.unsaveJob(id);
        setIsSaved(false);
        toast.success('Job removed from saved');
      } else {
        await jobService.saveJob(id);
        setIsSaved(true);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (user?.role !== 'APPLICANT') {
      toast.error('Only applicants can apply for jobs');
      return;
    }

    if (hasApplied) {
      toast.info('You have already applied for this job');
      return;
    }

    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      await applicationService.applyForJob({
        jobId: parseInt(id),
        coverLetter: applicationForm.coverLetter,
        resumeUrl: applicationForm.resumeUrl || user?.resumeUrl
      });
      
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setShowApplicationModal(false);
      setApplicationForm({ coverLetter: '', resumeUrl: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              {/* Job Header */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="h-5 w-5 mr-2" />
                      <span className="text-lg">{job.company}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  {isAuthenticated && user?.role === 'APPLICANT' && (
                    <button
                      onClick={handleSaveJob}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-6 w-6" />
                      ) : (
                        <Bookmark className="h-6 w-6" />
                      )}
                    </button>
                  )}
                </div>

                {/* Job Tags */}
                <div className="flex flex-wrap gap-2">
                  {job.jobType && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {job.jobType.replace('_', ' ')}
                    </span>
                  )}
                  {job.workMode && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {job.workMode}
                    </span>
                  )}
                  {job.experienceLevel && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {job.experienceLevel}
                    </span>
                  )}
                  {job.status === 'ACTIVE' && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                      Actively Hiring
                    </span>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
                  <p className="text-gray-700 whitespace-pre-line">{job.responsibilities}</p>
                </div>
              )}

              {/* Skills */}
              {job.skills && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                  <p className="text-gray-700 whitespace-pre-line">{job.benefits}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>
              
              <div className="space-y-4 mb-6">
                {job.salary && (
                  <div className="flex items-start">
                    <IndianRupee className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-medium text-gray-900">{job.salary}</p>
                    </div>
                  </div>
                )}

                {(job.minExperience || job.maxExperience) && (
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-medium text-gray-900">
                        {job.minExperience && job.maxExperience
                          ? `${job.minExperience} - ${job.maxExperience} years`
                          : job.minExperience
                          ? `Min ${job.minExperience} years`
                          : `Max ${job.maxExperience} years`}
                      </p>
                    </div>
                  </div>
                )}

                {job.education && (
                  <div className="flex items-start">
                    <GraduationCap className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Education</p>
                      <p className="font-medium text-gray-900">{job.education}</p>
                    </div>
                  </div>
                )}

                {job.industry && (
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Industry</p>
                      <p className="font-medium text-gray-900">{job.industry}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Posted On</p>
                    <p className="font-medium text-gray-900">
                      {new Date(job.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {job.applicationDeadline && (
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Application Deadline</p>
                      <p className="font-medium text-gray-900">
                        {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Button */}
              {isAuthenticated && user?.role === 'APPLICANT' ? (
                <button
                  onClick={handleApply}
                  disabled={hasApplied || job.status !== 'ACTIVE'}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    hasApplied
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : job.status !== 'ACTIVE'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Already Applied
                    </>
                  ) : job.status !== 'ACTIVE' ? (
                    'Applications Closed'
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Apply Now
                    </>
                  )}
                </button>
              ) : !isAuthenticated ? (
                <Link
                  to="/login"
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Login to Apply
                </Link>
              ) : null}

              {/* Employer Info */}
              {job.employer && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">About the Employer</h4>
                  <div className="space-y-2">
                    {job.employer.companyName && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Company:</span> {job.employer.companyName}
                      </p>
                    )}
                    {job.employer.companyLocation && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {job.employer.companyLocation}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-700"
                aria-label="Close application form"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-5/12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70">Applying for</p>
                      <h2 className="mt-2 text-2xl font-semibold leading-tight">{job.title}</h2>
                      <div className="mt-4 space-y-2 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-4 shadow-lg shadow-indigo-900/20 backdrop-blur">
                      <div className="space-y-4 text-sm">
                        {experienceRange && (
                          <div className="flex items-start gap-3">
                            <Briefcase className="mt-1 h-4 w-4" />
                            <div>
                              <p className="text-white/70">Experience</p>
                              <p className="font-semibold text-white">{experienceRange}</p>
                            </div>
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-start gap-3">
                            <IndianRupee className="mt-1 h-4 w-4" />
                            <div>
                              <p className="text-white/70">Compensation</p>
                              <p className="font-semibold text-white">{job.salary}</p>
                            </div>
                          </div>
                        )}
                        {formattedDeadline && (
                          <div className="flex items-start gap-3">
                            <Calendar className="mt-1 h-4 w-4" />
                            <div>
                              <p className="text-white/70">Application Deadline</p>
                              <p className="font-semibold text-white">{formattedDeadline}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-white/80">
                      <p className="font-medium uppercase tracking-[0.2em] text-white/70">Tips</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-300" />
                          <span>Connect your experience to the role requirements.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-300" />
                          <span>Showcase measurable impact from recent projects.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-300" />
                          <span>Ensure your resume link is accessible to the employer.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-slate-50 p-6 md:p-8">
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      <FileText className="h-4 w-4" />
                      Application Details
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-900">Tailor your application</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Share a concise cover letter and confirm the resume link you want the employer to review.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Cover Letter</label>
                      <textarea
                        rows={6}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        placeholder="Outline why you're the right fit, highlight impact, and note your availability."
                        value={applicationForm.coverLetter}
                        onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        2-3 short paragraphs are ideal. Keep it specific to this opportunity.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Resume URL <span className="text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        placeholder="https://example.com/resume.pdf"
                        value={applicationForm.resumeUrl}
                        onChange={(e) => setApplicationForm({ ...applicationForm, resumeUrl: e.target.value })}
                      />
                      {user?.resumeUrl && (
                        <p className="mt-2 text-xs text-slate-500">
                          No link? We'll include your profile resume: <span className="font-medium">{user.resumeUrl}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => setShowApplicationModal(false)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitApplication}
                      disabled={applying}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {applying ? (
                        <>
                          <div className="spinner mr-2 h-4 w-4 border-white border-t-transparent"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
