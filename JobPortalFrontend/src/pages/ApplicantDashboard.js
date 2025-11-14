import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Bookmark,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Calendar,
  MapPin,
  Building,
  IndianRupee,
  Eye
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import applicationService from "../api/applicationService";
import jobService from "../api/jobService";
import toast from "react-hot-toast";

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0,
    accepted: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load applications
      const appsResponse = await applicationService.getMyApplications(0, 100);
      const apps = appsResponse.content || [];
      setApplications(apps);
      
      // Calculate stats
      const statsData = {
        total: apps.length,
        pending: apps.filter(a => a.status === 'PENDING').length,
        reviewed: apps.filter(a => a.status === 'REVIEWED').length,
        shortlisted: apps.filter(a => a.status === 'SHORTLISTED').length,
        rejected: apps.filter(a => a.status === 'REJECTED').length,
        accepted: apps.filter(a => a.status === 'ACCEPTED').length
      };
      setStats(statsData);

      const saved = await jobService.getSavedJobs();
      setSavedJobs(saved);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statusMeta = useMemo(() => ({
    PENDING: {
      badge: "border border-amber-400/50 bg-amber-500/15 text-amber-200",
      icon: <Clock className="h-4 w-4 text-amber-300" />
    },
    REVIEWED: {
      badge: "border border-sky-400/50 bg-sky-500/15 text-sky-200",
      icon: <Eye className="h-4 w-4 text-sky-300" />
    },
    SHORTLISTED: {
      badge: "border border-violet-400/50 bg-violet-500/15 text-violet-200",
      icon: <AlertCircle className="h-4 w-4 text-violet-300" />
    },
    ACCEPTED: {
      badge: "border border-emerald-400/50 bg-emerald-500/15 text-emerald-200",
      icon: <CheckCircle className="h-4 w-4 text-emerald-300" />
    },
    REJECTED: {
      badge: "border border-rose-400/50 bg-rose-500/15 text-rose-200",
      icon: <XCircle className="h-4 w-4 text-rose-300" />
    }
  }), []);

  const getStatusBadge = (status) =>
    statusMeta[status]?.badge ||
    "border border-slate-500/40 bg-slate-500/10 text-slate-200";

  const getStatusIcon = (status) =>
    statusMeta[status]?.icon || <AlertCircle className="h-4 w-4 text-slate-200" />;

  const filteredApplications = useMemo(() => {
    if (filterStatus === "all") {
      return applications;
    }
    return applications.filter((app) => app.status === filterStatus);
  }, [applications, filterStatus]);

  const statCards = useMemo(() => ([
    {
      label: "Total applications",
      value: stats.total,
      icon: FileText,
      gradient: "from-sky-500/30 via-blue-500/20 to-indigo-500/10"
    },
    {
      label: "Pending review",
      value: stats.pending,
      icon: Clock,
      gradient: "from-amber-500/30 via-orange-500/20 to-yellow-500/10"
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted,
      icon: AlertCircle,
      gradient: "from-violet-500/30 via-purple-500/20 to-indigo-500/10"
    },
    {
      label: "Offers accepted",
      value: stats.accepted,
      icon: CheckCircle,
      gradient: "from-emerald-500/30 via-teal-500/20 to-green-500/10"
    }
  ]), [stats]);

  const tabItems = useMemo(() => ([
    { key: "overview", label: "Overview" },
    { key: "applications", label: `Applications (${applications.length})` },
    { key: "saved", label: `Saved jobs (${savedJobs.length})` }
  ]), [applications.length, savedJobs.length]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute -bottom-36 -right-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">Applicant cockpit</p>
              <h1 className="text-4xl font-semibold text-white">Welcome back, {user?.fullName || user?.name || "there"}.</h1>
              <p className="max-w-xl text-sm text-slate-200/80">
                Track every application, measure traction, and jump into new roles without losing sight of your pipeline.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
            >
              <Search className="h-4 w-4" />
              Browse opportunities
            </Link>
          </div>
        </motion.section>

        <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, gradient }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 + 0.05 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
              <div className="relative flex items-center justify-between">
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-200/70">{label}</span>
                  <span className="text-4xl font-semibold text-white">{value}</span>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-white">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-wrap gap-3 rounded-full border border-white/10 bg-white/5 p-1 text-sm">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 rounded-full px-4 py-2 font-semibold transition ${
                  activeTab === tab.key ? "bg-white text-slate-900 shadow" : "text-slate-200/80 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-10 space-y-10">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Recent activity</h2>
                  {applications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("applications")}
                      className="text-sm font-semibold text-blue-200 transition hover:text-white"
                    >
                      View all applications →
                    </button>
                  )}
                </div>

                {applications.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                    <Briefcase className="mx-auto mb-4 h-16 w-16 text-white/60" />
                    <h3 className="text-lg font-semibold text-white">You haven't applied to any roles yet</h3>
                    <p className="mt-2 text-sm text-slate-300">Browse the latest openings and start building your pipeline.</p>
                    <Link
                      to="/jobs"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]"
                    >
                      <Search className="h-4 w-4" />
                      Browse jobs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application) => (
                      <div key={application.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-semibold text-white">{application.job?.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                              <span className="inline-flex items-center gap-1">
                                <Building className="h-4 w-4 text-white/60" />
                                {application.job?.company}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-white/60" />
                                {application.job?.location}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-white/60" />
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getStatusBadge(application.status)}`}>
                              {getStatusIcon(application.status)}
                              {application.status}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate(`/jobs/${application.job?.id}`)}
                            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                          >
                            View job
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "applications" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold text-white">All applications</h2>
                  <select
                    value={filterStatus}
                    onChange={(event) => setFilterStatus(event.target.value)}
                    className="w-full max-w-xs rounded-xl border border-white/15 bg-slate-900/60 px-4 py-2 text-sm text-white outline-none transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="all">All status</option>
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {filteredApplications.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
                    Nothing to display for this filter yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {filteredApplications.map((application) => (
                      <div key={application.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white">{application.job?.title}</h3>
                            <div className="space-y-1 text-sm text-slate-300">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-white/60" />
                                {application.job?.company}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-white/60" />
                                {application.job?.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-white/60" />
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getStatusBadge(application.status)}`}>
                            {application.status}
                          </span>
                        </div>

                        {application.notes && (
                          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
                            <p className="font-semibold uppercase tracking-[0.2em] text-slate-300/80">Employer notes</p>
                            <p className="mt-2 text-slate-200/90">{application.notes}</p>
                          </div>
                        )}

                        <div className="mt-5 flex gap-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/jobs/${application.job?.id}`)}
                            className="flex-1 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                          >
                            View job
                          </button>
                          {application.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await applicationService.withdrawApplication(application.id);
                                  toast.success("Application withdrawn");
                                  loadDashboardData();
                                } catch (error) {
                                  toast.error("Failed to withdraw application");
                                }
                              }}
                              className="flex-1 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Saved jobs</h2>
                {savedJobs.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                    <Bookmark className="mx-auto mb-4 h-16 w-16 text-white/60" />
                    <h3 className="text-lg font-semibold text-white">No saved jobs yet</h3>
                    <p className="mt-2 text-sm text-slate-300">Bookmark promising roles to revisit when you are ready to apply.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {savedJobs.map((job) => (
                      <div key={job.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                          <div className="space-y-2 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-white/60" />
                              {job.company}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-white/60" />
                              {job.location}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-2">
                                <IndianRupee className="h-4 w-4 text-white/60" />
                                {job.salary}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 flex gap-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]"
                          >
                            View & apply
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await jobService.unsaveJob(job.id);
                                toast.success("Job removed from saved");
                                loadDashboardData();
                              } catch (error) {
                                toast.error("Failed to remove job");
                              }
                            }}
                            className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
