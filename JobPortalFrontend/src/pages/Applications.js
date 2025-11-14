import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import applicationService from "../api/applicationService";

const STATUS_META = {
  PENDING: {
    label: "Pending review",
    badge: "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
    icon: Clock
  },
  REVIEWED: {
    label: "Reviewed",
    badge: "border-blue-400/40 bg-blue-500/10 text-blue-200",
    icon: Eye
  },
  SHORTLISTED: {
    label: "Shortlisted",
    badge: "border-purple-400/40 bg-purple-500/10 text-purple-200",
    icon: Sparkles
  },
  ACCEPTED: {
    label: "Accepted",
    badge: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
    icon: CheckCircle2
  },
  REJECTED: {
    label: "Rejected",
    badge: "border-red-400/40 bg-red-500/10 text-red-200",
    icon: XCircle
  }
};

const STATUS_ORDER = ["ALL", "PENDING", "REVIEWED", "SHORTLISTED", "ACCEPTED", "REJECTED"];

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch (err) {
    return value;
  }
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getMyApplications(0, 100);
      setApplications(response.content || []);
    } catch (error) {
      console.error("Failed to fetch applications", error);
      toast.error("Unable to load your applications");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = applications.length;
    const breakdown = STATUS_ORDER.reduce((acc, status) => {
      if (status === "ALL") return acc;
      acc[status] = applications.filter((app) => app.status === status).length;
      return acc;
    }, {});

    return {
      total,
      ...breakdown
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesStatus =
        filterStatus === "ALL" ? true : application.status === filterStatus;

      const jobTitle = application.job?.title || "";
      const company = application.job?.company || "";
      const location = application.job?.location || "";

      const matchesSearch = [jobTitle, company, location]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [applications, filterStatus, searchTerm]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">Application tracker</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Stay on top of every opportunity</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200/70">
                Monitor where each application stands, review employer updates, and take the next best step with clarity.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-200/70 shadow-lg">
              <div className="flex items-center gap-3 text-base font-semibold text-white">
                <Briefcase className="h-5 w-5 text-blue-300" />
                Quick summary
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">Total submissions</span>
                  <span className="font-semibold text-white">{stats.total}</span>
                </li>
                {STATUS_ORDER.filter((status) => status !== "ALL").map((status) => (
                  <li key={status} className="flex items-center justify-between">
                    <span className="text-slate-400">{STATUS_META[status]?.label || status}</span>
                    <span className="font-semibold text-white">{stats[status] || 0}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    filterStatus === status
                      ? "bg-white text-slate-900 shadow"
                      : "bg-white/10 text-slate-200/80 hover:bg-white/20"
                  }`}
                >
                  {status === "ALL" ? "All" : STATUS_META[status]?.label || status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Search className="h-4 w-4 text-slate-300" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by role, company, or location"
                  className="min-w-[220px] flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={loadApplications}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
              >
                <Filter className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/70">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading your applications...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-slate-200/70">
                <p className="text-lg font-semibold text-white">No applications found</p>
                <p className="mt-2 text-slate-300">
                  {applications.length === 0
                    ? "You haven't applied to any roles yet. Explore new opportunities to begin your journey."
                    : "Try adjusting your filters or search query."}
                </p>
                <Link
                  to="/jobs"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                >
                  Browse jobs
                </Link>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredApplications.map((application) => {
                  const statusInfo = STATUS_META[application.status] || {};
                  const StatusIcon = statusInfo.icon || Clock;
                  return (
                    <motion.article
                      key={application.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                                statusInfo.badge || "border-slate-500/50 bg-slate-500/10 text-slate-200"
                              }`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusInfo.label || application.status}
                            </span>
                            <span className="text-xs text-slate-400">
                              Applied {formatDate(application.appliedAt)}
                            </span>
                          </div>

                          <h2 className="text-2xl font-semibold text-white">
                            {application.job?.title || "Role unavailable"}
                          </h2>
                          <p className="text-sm text-slate-300">
                            {application.job?.company || "Company not specified"}
                          </p>

                          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                            {application.job?.location && (
                              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {application.job.location}
                              </span>
                            )}
                            {application.job?.jobType && (
                              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                <Building className="h-3.5 w-3.5" />
                                {application.job.jobType.replace("_", " ")}
                              </span>
                            )}
                          </div>

                          {application.notes && (
                            <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200/80">
                                Employer notes
                              </p>
                              <p className="mt-2 text-sm text-blue-100/90">{application.notes}</p>
                            </div>
                          )}

                          {application.coverLetter && (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200/70">
                                Your cover letter
                              </p>
                              <p className="mt-2 text-sm text-slate-200/80 whitespace-pre-line">
                                {application.coverLetter}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                          <Link
                            to={`/jobs/${application.job?.id ?? ""}`}
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 disabled:opacity-60"
                          >
                            View job details
                          </Link>
                          {statusInfo.label === STATUS_META.ACCEPTED?.label && (
                            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                              Congratulations! The employer has accepted your application. Expect a follow-up soon.
                            </div>
                          )}
                          {statusInfo.label === STATUS_META.REJECTED?.label && (
                            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-xs text-red-100">
                              This role has been closed out. Keep exploring—your next opportunity awaits.
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
