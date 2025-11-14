// src/pages/EmployerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, FilePlus, Users, ClipboardList, Pencil, Trash2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  description: "",
  jobType: "FULL_TIME",
  workMode: "ONSITE",
  experienceLevel: "ENTRY",
  salary: "",
  requirements: "",
  responsibilities: "",
};

export default function EmployerDashboard() {
  const [form, setForm] = useState(emptyForm);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/employer/my-jobs");
      setJobs(res.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const stats = useMemo(() => {
    const total = jobs.length;
    const open = jobs.filter((job) => job.status !== "CLOSED").length;
    const draft = jobs.filter((job) => job.status === "DRAFT").length;
    return [
      {
        label: "Active listings",
        value: open,
        icon: Briefcase,
        tone: "from-emerald-400/40 to-emerald-500/10",
      },
      {
        label: "Total jobs",
        value: total,
        icon: ClipboardList,
        tone: "from-sky-400/40 to-sky-500/10",
      },
      {
        label: "Drafts",
        value: draft,
        icon: FilePlus,
        tone: "from-amber-400/40 to-amber-500/10",
      },
    ];
  }, [jobs]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      if (!form.description || form.description.trim().length < 50) {
        toast.error("Description must be at least 50 characters.");
        setSubmitting(false);
        return;
      }

      if (editingId) {
        await api.put(`/jobs/${editingId}`, form);
        toast.success("Job updated");
      } else {
        await api.post("/jobs", form);
        toast.success("New job published");
      }
      resetForm();
      fetchJobs();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      description: job.description || "",
      jobType: job.jobType || "FULL_TIME",
      workMode: job.workMode || "ONSITE",
      experienceLevel: job.experienceLevel || "ENTRY",
      salary: job.salary || "",
      requirements: job.requirements || "",
      responsibilities: job.responsibilities || "",
    });
    setEditingId(job.id);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job listing?")) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success("Job removed");
      fetchJobs();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || "Could not delete job");
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
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">Employer workspace</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Shape hiring that attracts exceptional talent</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200/70">
                Publish positions, monitor performance, and collaborate with your hiring team from a single command centre.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-200/70 shadow-lg">
              <div className="flex items-center gap-3 text-base font-semibold text-white">
                <Users className="h-5 w-5 text-blue-300" />
                Hiring playbook
              </div>
              <p className="mt-3 leading-6">
                Share roles, review pipelines, and unlock applicant insights together. Invite collaborators from Settings → Team.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon, tone }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${tone} p-5 shadow-lg backdrop-blur-xl`}
              >
                <div className="flex items-center justify-between text-sm text-slate-200/80">
                  <span>{label}</span>
                  <Icon className="h-5 w-5 text-white/70" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              </motion.div>
            ))}
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.4fr,1fr]">
          <motion.section
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Post a role</h2>
                <p className="mt-1 text-sm text-slate-200/70">Draft compelling listings to reach JobConnect&apos;s curated talent community.</p>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-white/40"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="title" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Role title
                  </label>
                  <p className="mt-1 text-xs text-slate-400">Example: Senior Backend Engineer</p>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Company
                  </label>
                  <p className="mt-1 text-xs text-slate-400">Enter your organisation or brand name</p>
                  <input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Location
                  </label>
                  <p className="mt-1 text-xs text-slate-400">Specify city, region, or remote / hybrid guidance</p>
                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                  Description
                </label>
                <p className="mt-1 text-xs text-slate-400">
                  Summarise what the role will accomplish, the responsibilities, and the impact this hire will drive.
                </p>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                />
                <p className="mt-1 text-xs text-slate-400">Minimum 50 characters.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label htmlFor="jobType" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Job type
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="FULL_TIME">Full time</option>
                    <option value="PART_TIME">Part time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="workMode" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Work mode
                  </label>
                  <select
                    id="workMode"
                    name="workMode"
                    value={form.workMode}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="ONSITE">Onsite</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="experienceLevel" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Experience level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={form.experienceLevel}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="ENTRY">Entry</option>
                    <option value="MID">Mid</option>
                    <option value="SENIOR">Senior</option>
                    <option value="EXECUTIVE">Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="salary" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Compensation (optional)
                  </label>
                  <p className="mt-1 text-xs text-slate-400">Share salary range, equity or bonus details if available.</p>
                  <input
                    id="salary"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    autoComplete="off"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div>
                  <label htmlFor="skills" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Key skills (optional)
                  </label>
                  <p className="mt-1 text-xs text-slate-400">List primary tools, techniques, or domain expertise.</p>
                  <input
                    id="skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    autoComplete="off"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="requirements" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Requirements (optional)
                  </label>
                  <p className="mt-1 text-xs text-slate-400">Capture experience, certifications, and must-have skills.</p>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={form.requirements}
                    onChange={handleChange}
                    rows={3}
                    autoComplete="off"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div>
                  <label htmlFor="responsibilities" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                    Responsibilities (optional)
                  </label>
                  <p className="mt-1 text-xs text-slate-400">Outline day-to-day ownership, stakeholders, and outcomes.</p>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={form.responsibilities}
                    onChange={handleChange}
                    rows={3}
                    autoComplete="off"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-200/60">
                  {editingId ? "Updating existing listing" : "Publishing new opportunity"}
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Saving..." : editingId ? "Update job" : "Publish job"}
                </button>
              </div>
            </form>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-xl backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold text-white">Submission checklist</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-200/70">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                Craft a compelling headline highlighting mission and impact.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                Provide clarity on work mode, location, and compensation range.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                Outline the hiring process and decision timeline to build trust.
              </li>
            </ul>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200/70">
              <p className="font-semibold uppercase tracking-[0.3em] text-blue-200">Need help?</p>
              <p className="mt-2">
                Share draft roles at <a href="mailto:partners@jobconnect.io" className="text-blue-200 underline">partners@jobconnect.io</a> for instant review and positioning tips.
              </p>
            </div>
          </motion.section>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Your listings</h2>
              <p className="mt-1 text-sm text-slate-200/70">Monitor performance, update descriptions, or close roles when offers are accepted.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            {loading && <p className="text-sm text-slate-200/70">Loading roles...</p>}
            {!loading && jobs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-200/70">
                No published roles yet. Use the form above to introduce your next hire.
              </div>
            )}

            {!loading && jobs.map((job) => (
              <motion.article
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-blue-200/80">{job.status || "ACTIVE"}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{job.title}</h3>
                    <p className="mt-1 text-sm text-slate-200/70">
                      {job.company}
                      {job.location ? ` • ${job.location}` : ""}
                    </p>
                    {job.description && (
                      <p className="mt-3 line-clamp-3 text-sm text-slate-200/70">{job.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(job)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
