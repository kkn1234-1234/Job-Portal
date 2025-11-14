import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Filter,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Building
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import jobService from "../api/jobService";
import applicationService from "../api/applicationService";

export default function Jobs() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Search and filter states
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    jobType: '',
    workMode: '',
    experienceLevel: '',
    minExperience: '',
    maxExperience: '',
    skills: '',
    industry: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    page: 0,
    size: 9
  });

  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' }
  ];

  const workModes = [
    { value: '', label: 'All Modes' },
    { value: 'ONSITE', label: 'On-site' },
    { value: 'REMOTE', label: 'Remote' },
    { value: 'HYBRID', label: 'Hybrid' }
  ];

  const experienceLevels = [
    { value: '', label: 'All Levels' },
    { value: 'ENTRY', label: 'Entry Level' },
    { value: 'MID', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior Level' },
    { value: 'EXECUTIVE', label: 'Executive' }
  ];

  useEffect(() => {
    loadJobs();
    if (isAuthenticated && user?.role === 'APPLICANT') {
      loadSavedJobs();
      loadAppliedJobs();
    }
  }, [searchParams.page]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.searchJobs(searchParams);
      setJobs(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      setCurrentPage(response.number || 0);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const saved = await jobService.getSavedJobs();
      setSavedJobs(saved.map(job => job.id));
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const loadAppliedJobs = async () => {
    try {
      const applications = await applicationService.getMyApplications(0, 100);
      setAppliedJobs(applications.content.map(app => app.job.id));
    } catch (error) {
      console.error('Error loading applied jobs:', error);
    }
  };

  const handleSearch = () => {
    setSearchParams({ ...searchParams, page: 0 });
    loadJobs();
  };

  const handleFilterChange = (field, value) => {
    setSearchParams({ ...searchParams, [field]: value, page: 0 });
  };

  const handleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      navigate('/login');
      return;
    }

    if (user?.role !== 'APPLICANT') {
      toast.error('Only applicants can save jobs');
      return;
    }

    try {
      if (savedJobs.includes(jobId)) {
        await jobService.unsaveJob(jobId);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
        toast.success('Job removed from saved');
      } else {
        await jobService.saveJob(jobId);
        setSavedJobs([...savedJobs, jobId]);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (user?.role !== 'APPLICANT') {
      toast.error('Only applicants can apply for jobs');
      return;
    }

    if (appliedJobs.includes(jobId)) {
      toast.info('You have already applied for this job');
      return;
    }

    navigate(`/jobs/${jobId}`);
  };

  const clearFilters = () => {
    setSearchParams({
      keyword: '',
      location: '',
      jobType: '',
      workMode: '',
      experienceLevel: '',
      minExperience: '',
      maxExperience: '',
      skills: '',
      industry: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      page: 0,
      size: 9
    });
  };

  const jobTypeLabels = useMemo(
    () => ({
      FULL_TIME: "Full time",
      PART_TIME: "Part time",
      CONTRACT: "Contract",
      INTERNSHIP: "Internship"
    }),
    []
  );

  const workModeLabels = useMemo(
    () => ({
      ONSITE: "On-site",
      REMOTE: "Remote",
      HYBRID: "Hybrid"
    }),
    []
  );

  const experienceLabels = useMemo(
    () => ({
      ENTRY: "Entry level",
      MID: "Mid level",
      SENIOR: "Senior level",
      EXECUTIVE: "Executive"
    }),
    []
  );

  const pillStyles = {
    jobType: "bg-blue-500/10 text-blue-200 border border-blue-500/30",
    workMode: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30",
    experience: "bg-violet-500/10 text-violet-200 border border-violet-500/30"
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.16),_transparent_55%)]" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Search Header */}
        <section className="px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-200/80">
              JobConnect
              <span className="h-1 w-1 rounded-full bg-blue-300" />
              Opportunities
            </div>
            <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Discover roles that move you forward</h1>
            <p className="mt-3 text-base text-slate-300 sm:text-lg">
              Search live opportunities, dial in filters, and connect with teams who are hiring right now.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 pl-12 pr-3 text-sm text-white placeholder-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    value={searchParams.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3 pl-12 pr-3 text-sm text-white placeholder-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    value={searchParams.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Search Jobs
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-2xl border border-white/15 px-4 py-3 text-white transition hover:bg-white/10"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-y border-white/10 bg-slate-950/60"
          >
            <div className="mx-auto max-w-6xl px-4 py-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-white">Advanced filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-blue-300 hover:text-blue-200"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Job type
                </label>
                <select
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-white focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  value={searchParams.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                >
                  {jobTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Work mode
                </label>
                <select
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-white focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  value={searchParams.workMode}
                  onChange={(e) => handleFilterChange('workMode', e.target.value)}
                >
                  {workModes.map(mode => (
                    <option key={mode.value} value={mode.value}>{mode.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Experience level
                </label>
                <select
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-white focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  value={searchParams.experienceLevel}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                >
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Min experience
                </label>
                <input
                  type="number"
                  placeholder="Years"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-white placeholder-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  value={searchParams.minExperience}
                  onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                />
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g., Java, React"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-white placeholder-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  value={searchParams.skills}
                  onChange={(e) => handleFilterChange('skills', e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSearch}
                className="rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
              >
                Apply Filters
              </button>
            </div>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Results</p>
            <h2 className="text-3xl font-semibold text-white">
              {totalElements} Jobs Found
            </h2>
            <p className="text-sm text-slate-400">Page {currentPage + 1} of {totalPages || 1}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Sort by</label>
            <select
              className="rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={searchParams.sortBy}
              onChange={(e) => {
                setSearchParams({ ...searchParams, sortBy: e.target.value, page: 0 });
                loadJobs();
              }}
            >
              <option value="createdAt">Latest</option>
              <option value="salary">Salary</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-300">
            <Briefcase className="mx-auto mb-4 h-14 w-14 text-white/60" />
            <h3 className="text-xl font-semibold text-white">No jobs found</h3>
            <p className="mt-2 text-sm text-slate-400">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur transition hover:border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                    <div className="flex items-center text-slate-300 mb-2">
                      <Building className="h-4 w-4 mr-1 text-slate-400" />
                      <span className="text-sm">{job.company}</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                  </div>
                  {isAuthenticated && user?.role === 'APPLICANT' && (
                    <button
                      onClick={() => handleSaveJob(job.id)}
                      className="text-slate-300 hover:text-blue-300 transition"
                    >
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="h-5 w-5" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.jobType && (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${pillStyles.jobType}`}>
                      {jobTypeLabels[job.jobType] || job.jobType.replace('_', ' ')}
                    </span>
                  )}
                  {job.workMode && (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${pillStyles.workMode}`}>
                      {workModeLabels[job.workMode] || job.workMode}
                    </span>
                  )}
                  {job.experienceLevel && (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${pillStyles.experience}`}>
                      {experienceLabels[job.experienceLevel] || job.experienceLevel}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-slate-300/90 mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  {job.salary && (
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1 text-slate-400" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-slate-400" />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="flex-1 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View Details
                  </button>
                  {isAuthenticated && user?.role === 'APPLICANT' && (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={appliedJobs.includes(job.id)}
                      className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        appliedJobs.includes(job.id)
                          ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:scale-[1.01]'
                      }`}
                    >
                      {appliedJobs.includes(job.id) ? 'Applied' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  const nextPage = currentPage - 1;
                  setSearchParams({ ...searchParams, page: nextPage });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === 0}
                className="rounded-xl border border-white/15 bg-white/5 p-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchParams({ ...searchParams, page: index });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`rounded-xl px-3 py-1 text-sm font-semibold transition ${
                      currentPage === index
                        ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white"
                        : "border border-white/15 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const nextPage = currentPage + 1;
                  setSearchParams({ ...searchParams, page: nextPage });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === totalPages - 1}
                className="rounded-xl border border-white/15 bg-white/5 p-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
