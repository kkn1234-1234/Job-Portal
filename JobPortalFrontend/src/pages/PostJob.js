import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Rocket, Target, Sparkles } from "lucide-react";
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

export default function PostJob() {
  const initialForm = useMemo(() => ({ ...emptyForm }), []);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setForm(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.description || form.description.trim().length < 50) {
      toast.error("Tell candidates more — description must be at least 50 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/jobs", form);
      toast.success("Job published successfully");
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || "Could not publish job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.15),_transparent_55%)]" />
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-12 px-4 py-16 sm:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">Post a new opening</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Broadcast your next great opportunity</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200/70">
                Describe the role, outline expectations, and inspire top-tier talent to join forces with your team.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-200/70 shadow-lg">
              <div className="flex items-center gap-3 text-base font-semibold text-white">
                <Rocket className="h-5 w-5 text-violet-300" />
                Launch tips
              </div>
              <p className="mt-3 leading-6">
                Strong listings emphasise impact, career trajectory, and the unique problems your team is solving right now.
              </p>
            </div>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl"
        >
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                  Role title
                </label>
                <p className="mt-1 text-xs text-slate-400">Example: Lead Growth Manager</p>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label htmlFor="company" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                  Company
                </label>
                <p className="mt-1 text-xs text-slate-400">Let employers know who&apos;s hiring</p>
                <input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label htmlFor="location" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                  Location
                </label>
                <p className="mt-1 text-xs text-slate-400">Mention office city, remote setting, or hybrid guidance</p>
                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label htmlFor="salary" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                  Compensation (optional)
                </label>
                <p className="mt-1 text-xs text-slate-400">Share bands or range — candidates value transparency</p>
                <input
                  id="salary"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
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
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
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
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
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
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
                >
                  <option value="ENTRY">Entry</option>
                  <option value="MID">Mid</option>
                  <option value="SENIOR">Senior</option>
                  <option value="EXECUTIVE">Executive</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                Description
              </label>
              <p className="mt-1 text-xs text-slate-400">
                Outline mission, responsibilities, and what success looks like in this role — showcase why top performers
                should care.
              </p>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                autoComplete="off"
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
              />
              <p className="mt-1 text-xs text-slate-400">Minimum 50 characters.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="requirements" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                  Requirements (optional)
                </label>
                <p className="mt-1 text-xs text-slate-400">
                  List core experience, tools, certifications, and non-negotiable capabilities.
                </p>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={4}
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label htmlFor="responsibilities" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
                  Responsibilities (optional)
                </label>
                <p className="mt-1 text-xs text-slate-400">Highlight what this role owns weekly, monthly, and quarterly.</p>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={form.responsibilities}
                  onChange={handleChange}
                  rows={4}
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-200/60">Publishing new opportunity</p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {submitting ? "Publishing..." : "Publish job"}
                </span>
              </button>
            </div>
          </form>
        </motion.section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">Winning job ads checklist</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Clarify expectations",
                copy: "Highlight the problems this hire will solve across their first 90 days.",
              },
              {
                icon: Sparkles,
                title: "Showcase culture",
                copy: "Explain what makes your team inspiring to collaborate with daily.",
              },
              {
                icon: LogIn,
                title: "Map the journey",
                copy: "Share interview stages and decision timelines to set transparent expectations.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <Icon className="h-6 w-6 text-violet-200" />
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs text-slate-200/70">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
