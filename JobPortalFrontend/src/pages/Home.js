// src/pages/Home.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/jobconnect-logo.svg";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const heroHighlights = [
    {
      title: "Precision matching",
      description: "Signal-based recommendations connect talent with product-first teams instantly.",
      icon: Sparkles
    },
    {
      title: "Collaborative hiring",
      description: "Shared scorecards and feedback keep every stakeholder aligned every step of the way.",
      icon: ShieldCheck
    },
    {
      title: "Dedicated guidance",
      description: "Strategists coach applicants and employers so momentum never stalls.",
      icon: MessageSquare
    }
  ];

  const stats = [
    {
      label: "Active opportunities",
      value: "12K+",
      description: "Curated roles across product, engineering, design, and growth.",
      icon: Briefcase
    },
    {
      label: "Hiring teams onboard",
      value: "650+",
      description: "From high-growth startups to Fortune 500 innovators.",
      icon: Building2
    },
    {
      label: "Monthly matches",
      value: "48K",
      description: "Professionals discovering roles aligned to their ambitions.",
      icon: Users
    },
    {
      label: "Avg. time-to-offer",
      value: "12 days",
      description: "Decisions accelerated by transparent workflows.",
      icon: TrendingUp
    }
  ];

  const applicantHighlights = [
    {
      title: "Personalized career radar",
      description: "Alerts tuned to your stack, seniority, and compensation expectations.",
      icon: Sparkles
    },
    {
      title: "Transparent progression",
      description: "Know exactly where you stand with timelines, prep, and feedback in one hub.",
      icon: CheckCircle2
    },
    {
      title: "Mentors who invest",
      description: "Portfolio reviews, workshops, and advocates ready to elevate your story.",
      icon: Users
    }
  ];

  const employerHighlights = [
    {
      title: "Strategic talent pipelines",
      description: "Define success signals once and keep your funnel stocked with interview-ready talent.",
      icon: Briefcase
    },
    {
      title: "Decision-grade insights",
      description: "Scorecards, references, and analytics in a single pane of glass for hiring teams.",
      icon: ShieldCheck
    },
    {
      title: "Brand storytelling",
      description: "Showcase culture, growth, and benefits in experiences candidates remember.",
      icon: Building2
    }
  ];

  const workflow = [
    {
      title: "Launch your brief",
      description: "Publish goals or openings with the competencies that matter most.",
      icon: ClipboardList
    },
    {
      title: "Review together",
      description: "Shortlist, leave notes, and sync decisions without juggling channels.",
      icon: CheckCircle2
    },
    {
      title: "Hire with confidence",
      description: "Move forward backed by structured interviews, insights, and concierge support.",
      icon: ShieldCheck
    }
  ];

  const testimonials = [
    {
      name: "Aditi Sharma",
      role: "Product Lead",
      company: "Zerodha Tech Labs",
      content:
        "The JobConnect website let us publish roles, review pipelines, and send offers without hopping tools. Our leadership team had real-time visibility from day one.",
      rating: 5
    },
    {
      name: "Rahul Mehra",
      role: "Senior Data Scientist",
      company: "Tata Digital",
      content:
        "I built my profile, tracked interviews, and chatted with mentors in one place. The clean UI and instant alerts kept my job search human and fast.",
      rating: 5
    },
    {
      name: "Priya Nair",
      role: "Head of People",
      company: "BYJU'S",
      content:
        "Our hiring squad loves the JobConnect dashboards. Website analytics, status updates, and notes travel with every candidate—we hire faster and tell a better story.",
      rating: 5
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-600/25 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="px-4 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                <img src={logo} alt="JobConnect" className="h-10 w-auto drop-shadow" />
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-200/80">
                  JobConnect
                  <span className="h-1 w-1 rounded-full bg-blue-300" />
                  Future of hiring
                </div>
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Opportunity engineered for ambitious applicants and modern hiring teams.
                </h1>
                <p className="text-base text-slate-300 sm:text-lg lg:text-xl">
                  Discover curated roles, transparent processes, and collaborative hiring experiences designed to move at
                  the speed of business. Whether you&apos;re growing your career or your company, JobConnect keeps momentum on
                  your side.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.015]"
                    >
                      Create your account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60"
                    >
                      Employers sign in
                    </Link>
                  </>
                ) : (
                  <Link
                    to={user?.role === "EMPLOYER" ? "/employer/dashboard" : "/applicant/dashboard"}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.015]"
                  >
                    Go to your workspace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => navigate("/jobs")}
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <Search className="mr-2 h-4 w-4" /> Explore open roles
                </button>
              </div>

              <p className="text-xs text-slate-400 sm:text-sm">
                Trusted weekly by product-led companies and 50K+ professionals accelerating their next move.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-blue-500/40 to-indigo-500/40 blur-2xl" />
              <div className="relative space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/70">Platform highlights</p>
                <div className="space-y-5">
                  {heroHighlights.map(({ title, description, icon: Icon }) => (
                    <div key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{title}</h3>
                        <p className="mt-1 text-xs text-slate-300/90">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-white/10 bg-slate-950/60 px-4 py-16 sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, description, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 text-sm text-blue-200/90">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20">
                    <Icon className="h-5 w-5" />
                  </span>
                  {label}
                </div>
                <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
                <p className="mt-2 text-sm text-slate-300/80">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tailored Journeys */}
        <section className="px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-4xl font-semibold text-white">Purpose-built journeys for every goal</h2>
              <p className="mt-3 text-base text-slate-300 sm:text-lg">
                Whether you&apos;re searching for your next role or assembling a dream team, JobConnect adapts to how you
                work.
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-8 backdrop-blur"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-100">
                  Applicants
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">Navigate your next role with confidence</h3>
                <p className="mt-3 text-sm text-blue-50/90">
                  Showcase expertise with polished profiles, understand every stage, and stay coached throughout.
                </p>
                <div className="mt-8 space-y-5">
                  {applicantHighlights.map(({ title, description, icon: Icon }) => (
                    <div key={title} className="flex gap-4 rounded-2xl border border-white/15 bg-white/10 p-4">
                      <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white/90">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="text-base font-semibold text-white">{title}</h4>
                        <p className="mt-2 text-sm text-blue-50/80">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-8 backdrop-blur"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-violet-100">
                  Employers
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">Build high-performing teams at speed</h3>
                <p className="mt-3 text-sm text-violet-50/90">
                  Run candidate-first hiring campaigns with visibility for every stakeholder.
                </p>
                <div className="mt-8 space-y-5">
                  {employerHighlights.map(({ title, description, icon: Icon }) => (
                    <div key={title} className="flex gap-4 rounded-2xl border border-white/15 bg-white/10 p-4">
                      <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white/90">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="text-base font-semibold text-white">{title}</h4>
                        <p className="mt-2 text-sm text-violet-50/80">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="border-t border-white/10 bg-white/5 px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-4xl font-semibold text-white">A streamlined workflow for both sides</h2>
              <p className="mt-3 text-base text-slate-200/80">
                From discovery to signed offer, every interaction is orchestrated to be clear, timely, and human.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {workflow.map(({ title, description, icon: Icon }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl"
                >
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
                  <div className="relative space-y-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="text-sm text-slate-300/85">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-white/10 bg-slate-950/70 px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-4xl font-semibold text-white">Stories from teams who build on JobConnect</h2>
              <p className="mt-3 text-base text-slate-300/85">
                From the first visit to jobconnect.com to the final offer letter, the platform helps applicants and employers manage every hiring moment in one modern workspace.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map(({ name, role, company, content, rating }) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
                >
                  <div className="flex gap-1 text-yellow-300">
                    {Array.from({ length: rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm italic text-slate-200/90">“{content}”</p>
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400/90">
                      {role} · {company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 px-4 py-20 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl border border-white/15 bg-white/10 p-10 text-center shadow-2xl backdrop-blur"
          >
            <h2 className="text-4xl font-semibold text-white sm:text-5xl">Let’s build the future of work together</h2>
            <p className="text-base text-slate-200/85 sm:text-lg">
              Join thousands of professionals and hiring leaders who trust JobConnect for curated matches, transparent
              workflows, and outcomes that feel effortless.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
              >
                Create your free account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse live roles
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
