import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Filter, Eye, Trash2, Share2, CheckCircle2, Archive, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

const STATUS_FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Closed", value: "CLOSED" }
];

const statusTone = {
  ACTIVE: "text-emerald-300 bg-emerald-500/10 border border-emerald-400/40",
  DRAFT: "text-amber-300 bg-amber-500/10 border border-amber-400/40",
  CLOSED: "text-slate-300 bg-slate-500/10 border border-slate-400/40",
};

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (err) {
    return value;
  }
};

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [closingId, setClosingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/employer/my-jobs");
      setJobs(res.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return (jobs || [])
      .filter((job) => {
        if (filter === "ALL") return true;
        return (job.status || "ACTIVE") === filter;
      })
      .filter((job) => {
        if (!search.trim()) return true;
        const query = search.trim().toLowerCase();
        return (
          job.title?.toLowerCase().includes(query) ||
          job.company?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query)
        );
      });
  }, [jobs, filter, search]);

  const handleCloseJob = async (jobId) => {
    try {
      setClosingId(jobId);
      await api.put(`/jobs/${jobId}/close`);
      toast.success("Job marked as closed");
      fetchJobs();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to close job");
    } finally {
      setClosingId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job listing permanently?")) return;
    try {
      setDeletingId(jobId);
      await api.delete(`/jobs/${jobId}`);
      toast.success("Job deleted");
      fetchJobs();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to delete job");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = async (jobId) => {
    const url = `${window.location.origin}/jobs/${jobId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch (err) {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.15),_transparent_55%)]" />
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">Manage listings</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Keep your job pipeline sharp and actionable</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200/70">
                Track active roles, review draft openings, and sunset positions that have been filled — all from one command centre.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-200/70 shadow-lg">
              <div className="flex items-center gap-3 text-base font-semibold text-white">
                <ClipboardList className="h-5 w-5 text-blue-300" />
                Smart management tips
              </div>
              <p className="mt-3 leading-6">
                Refresh listings every few weeks to stay top-of-mind and convert qualified applicants faster.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    filter === value
                      ? "bg-white text-slate-900 shadow"
                      : "bg-white/5 text-slate-200/80 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Filter className="h-4 w-4 text-slate-300" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, company, or location"
                className="min-w-[220px] flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/70">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading jobs...
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-slate-200/70">
                No jobs found for this filter. Adjust your search or create a new listing.
              </div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence>
                  {filteredJobs.map((job) => {
                    const status = job.status || "ACTIVE";
                    return (
                      <motion.article
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusTone[status] || "border border-slate-500/50 bg-slate-500/10 text-slate-200"}`}>
                                {status === "CLOSED" ? <Archive className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                              </span>
                              <span className="text-xs text-slate-400">Posted {formatDate(job.createdAt)}</span>
                            </div>
                            <h2 className="text-2xl font-semibold text-white">{job.title}</h2>
                            <p className="text-sm text-slate-300">
                              {job.company}
                              {job.location ? ` • ${job.location}` : ""}
                            </p>
                            {job.description && (
                              <p className="text-sm text-slate-200/80 line-clamp-3">{job.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                {job.jobType || "FULL_TIME"}
                              </span>
                              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                {job.workMode || "ONSITE"}
                              </span>
                              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                {job.experienceLevel || "ENTRY"}
                              </span>
                              {job.salary && (
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                  {job.salary}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 md:items-end">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleCopyLink(job.id)}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
                              >
                                <Share2 className="h-4 w-4" /> Share
                              </button>
                              <Link
                                to={`/employer/applications/${job.id}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
                              >
                                <Eye className="h-4 w-4" /> View applicants
                              </Link>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {status !== "CLOSED" && (
                                <button
                                  type="button"
                                  onClick={() => handleCloseJob(job.id)}
                                  disabled={closingId === job.id}
                                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-60"
                                >
                                  {closingId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Close
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteJob(job.id)}
                                disabled={deletingId === job.id}
                                className="inline-flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                              >
                                {deletingId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
