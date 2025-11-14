import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AtSign,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import applicationService from "../api/applicationService";
import jobService from "../api/jobService";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", tone: "border-yellow-400/40 bg-yellow-500/10 text-yellow-200", icon: Clock },
  { value: "REVIEWED", label: "Reviewed", tone: "border-blue-400/40 bg-blue-500/10 text-blue-200", icon: ShieldCheck },
  { value: "SHORTLISTED", label: "Shortlisted", tone: "border-purple-400/40 bg-purple-500/10 text-purple-200", icon: Sparkles },
  { value: "ACCEPTED", label: "Accepted", tone: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200", icon: CheckCircle2 },
  { value: "REJECTED", label: "Rejected", tone: "border-red-400/40 bg-red-500/10 text-red-200", icon: XCircle }
];

const APPLICANT_TABS = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" }
];

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

export default function ViewApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [notesDraft, setNotesDraft] = useState({});

  useEffect(() => {
    if (!jobId) return;
    loadData();
  }, [jobId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobResponse, applicationsResponse] = await Promise.all([
        jobService.getJobById(jobId),
        applicationService.getJobApplications(jobId)
      ]);
      setJob(jobResponse);
      setApplications(applicationsResponse || []);
    } catch (error) {
      console.error("Failed to load applications", error);
      toast.error(error?.response?.data?.error || "Unable to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = useMemo(() => {
    if (filterStatus === "all") return applications;
    return applications.filter((application) => application.status === filterStatus);
  }, [applications, filterStatus]);

  const statusMeta = (status) => STATUS_OPTIONS.find((option) => option.value === status) || STATUS_OPTIONS[0];

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId + status);
    try {
      const request = {
        status,
        notes: notesDraft[applicationId] || ""
      };
      const updated = await applicationService.updateApplicationStatus(applicationId, request);
      setApplications((prev) => prev.map((app) => (app.id === applicationId ? updated : app)));
      toast.success(`Application marked as ${statusMeta(status).label.toLowerCase()}`);
    } catch (error) {
      console.error("Failed to update application", error);
      toast.error(error?.response?.data?.error || "Couldn't update application status");
    } finally {
      setUpdatingId(null);
    }
  };

  const headerStats = useMemo(() => {
    const total = applications.length;
    const shortlisted = applications.filter((app) => app.status === "SHORTLISTED").length;
    const accepted = applications.filter((app) => app.status === "ACCEPTED").length;
    const rejected = applications.filter((app) => app.status === "REJECTED").length;
    return [
      {
        label: "Total applicants",
        value: total,
        icon: Users,
        gradient: "from-sky-400/40 to-sky-500/10"
      },
      {
        label: "Shortlisted",
        value: shortlisted,
        icon: Sparkles,
        gradient: "from-purple-400/40 to-purple-500/10"
      },
      {
        label: "Accepted",
        value: accepted,
        icon: CheckCircle2,
        gradient: "from-emerald-400/40 to-emerald-500/10"
      },
      {
        label: "Rejected",
        value: rejected,
        icon: XCircle,
        gradient: "from-red-400/40 to-red-500/10"
      }
    ];
  }, [applications]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%)]" />
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-white/40"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <h1 className="mt-4 text-4xl font-semibold text-white">
                {job?.title || "Job Applications"}
              </h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-200/80">
                {job?.company && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    <Building className="h-4 w-4" />
                    {job.company}
                  </span>
                )}
                {job?.location && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                )}
                {job?.jobType && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    <Briefcase className="h-4 w-4" />
                    {job.jobType.replace("_", " ")}
                  </span>
                )}
              </div>
              {job?.applicationDeadline && (
                <p className="mt-3 text-sm text-slate-300">
                  Applications close on {formatDate(job.applicationDeadline)}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-200/70 shadow-lg">
              <div className="flex items-center gap-3 text-base font-semibold text-white">
                <ClipboardCheck className="h-5 w-5 text-blue-300" />
                Pipeline snapshot
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {headerStats.map(({ label, value, icon: Icon, gradient }) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-2xl border border-white/10 bg-gradient-to-br ${gradient} p-4`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-200/80">
                      <span>{label}</span>
                      <Icon className="h-4 w-4 text-white/70" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {APPLICANT_TABS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilterStatus(value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    filterStatus === value
                      ? "bg-white text-slate-900 shadow"
                      : "bg-white/10 text-slate-200/80 hover:bg-white/20"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
            >
              <Filter className="h-4 w-4" /> Refresh list
            </button>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/70">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading candidates...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-slate-200/70">
                <p className="text-lg font-semibold text-white">No applicants in this stage</p>
                <p className="mt-2 text-slate-300">
                  Adjust your filters or invite talent to apply to this role.
                </p>
                <Link
                  to="/employer/manage-jobs"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                >
                  Manage listings
                </Link>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredApplications.map((application) => {
                  const meta = statusMeta(application.status);
                  const Icon = meta.icon;
                  const applicant = application.applicant || {};
                  const applicantName = applicant.name || applicant.fullName || "Unnamed candidate";
                  const applicationNotes = notesDraft[application.id] ?? application.notes ?? "";

                  return (
                    <motion.article
                      key={application.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg"
                    >
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.tone}`}>
                              <Icon className="h-3.5 w-3.5" />
                              {meta.label}
                            </span>
                            <span className="text-xs text-slate-400">Applied {formatDate(application.appliedAt)}</span>
                          </div>

                          <div>
                            <h2 className="text-2xl font-semibold text-white">{applicantName}</h2>
                            <p className="mt-1 text-sm text-slate-300">{applicant.bio || "Profile summary not provided"}</p>
                          </div>

                          <div className="grid gap-3 text-sm text-slate-200/80 sm:grid-cols-2">
                            {applicant.email && (
                              <div className="inline-flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-200" />
                                <a href={`mailto:${applicant.email}`} className="hover:underline">
                                  {applicant.email}
                                </a>
                              </div>
                            )}
                            {applicant.phone && (
                              <div className="inline-flex items-center gap-2">
                                <Phone className="h-4 w-4 text-blue-200" />
                                <a href={`tel:${applicant.phone}`} className="hover:underline">
                                  {applicant.phone}
                                </a>
                              </div>
                            )}
                            {applicant.experience && (
                              <div className="inline-flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-blue-200" />
                                {applicant.experience}
                              </div>
                            )}
                            {applicant.education && (
                              <div className="inline-flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-200" />
                                {applicant.education}
                              </div>
                            )}
                          </div>

                          {applicant.skills && (
                            <div className="flex flex-wrap gap-2 text-xs text-slate-200/80">
                              {applicant.skills.split(",").map((skill) => (
                                <span key={skill.trim()} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          {application.coverLetter && (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200/80">
                              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200/60">
                                Candidate pitch
                              </p>
                              <p className="mt-2 whitespace-pre-line">{application.coverLetter}</p>
                            </div>
                          )}

                          {applicant.resumeUrl && (
                            <a
                              href={applicant.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition hover:text-white"
                            >
                              <Download className="h-4 w-4" />
                              View resume / portfolio
                            </a>
                          )}
                        </div>

                        <div className="w-full max-w-xs space-y-4">
                          <div>
                            <label htmlFor={`notes-${application.id}`} className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200/60">
                              Share an update (optional)
                            </label>
                            <textarea
                              id={`notes-${application.id}`}
                              rows={3}
                              value={applicationNotes}
                              onChange={(event) =>
                                setNotesDraft((prev) => ({ ...prev, [application.id]: event.target.value }))
                              }
                              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-300 outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                              placeholder="Let the candidate know what's next"
                            />
                          </div>

                          <div className="grid gap-2">
                            {STATUS_OPTIONS.map(({ value, label, tone }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => handleStatusChange(application.id, value)}
                                disabled={updatingId === application.id + value}
                                className={`inline-flex items-center justify-between rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                                  tone
                                } ${updatingId === application.id + value ? "opacity-60" : "hover:scale-[1.01]"}`}
                              >
                                <span>{label}</span>
                                {updatingId === application.id + value ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <AtSign className="h-4 w-4" />
                                )}
                              </button>
                            ))}
                          </div>
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
