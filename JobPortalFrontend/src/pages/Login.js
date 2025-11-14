import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Briefcase,
  LogIn,
  Building2,
  ShieldCheck,
  Users,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/jobconnect-logo.svg";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState("EMPLOYER");
  const navigate = useNavigate();
  const { login } = useAuth();

  const RolePillIcon = useMemo(
    () => (activeRole === "EMPLOYER" ? Building2 : Users),
    [activeRole]
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await login(form.email, form.password, activeRole);
    setLoading(false);

    if (result.success) {
      const detectedRole = result.user.role;
      if (detectedRole !== activeRole) {
        toast.success(`Signed in as ${detectedRole.toLowerCase()} — switching to the matching workspace.`);
        setActiveRole(detectedRole);
      } else {
        toast.success("Login successful!");
      }

      if (detectedRole === "EMPLOYER") {
        navigate("/employer/dashboard");
      } else {
        navigate("/applicant/dashboard");
      }
    } else {
      toast.error(result.error);
    }
  };

  const roleHighlights = useMemo(
    () => ({
      EMPLOYER: {
        tagline: "Crafted for growth-focused hiring teams",
        heading: "Employer Portal",
        subheading: "Source world-class talent faster than ever",
        bullets: [
          {
            icon: ShieldCheck,
            title: "Verified professionals",
            description: "Access a curated pool of vetted candidates with ready-to-hire profiles.",
          },
          {
            icon: Users,
            title: "Collaborate effortlessly",
            description: "Share pipelines with your hiring team and keep everyone aligned in real time.",
          },
          {
            icon: CheckCircle2,
            title: "Streamlined workflow",
            description: "Manage postings, applications, and interviews from a single modern dashboard.",
          },
        ],
        formNote: "Use the company email that was onboarded with JobConnect to manage requisitions and candidate pipelines.",
        footerLabel: "Employer playbook",
        footerCopy: "Invite your recruiting crew under Settings → Team so everyone stays in sync.",
        ctaCopy: "Access employer console",
      },
      APPLICANT: {
        tagline: "Designed for career-driven professionals",
        heading: "Applicant Workspace",
        subheading: "Personalised opportunities tailored to your ambitions",
        bullets: [
          {
            icon: Briefcase,
            title: "Curated job matches",
            description: "Discover openings that align with your experience and career goals.",
          },
          {
            icon: Users,
            title: "Mentor support",
            description: "Engage with mentors and recruiters to polish your applications.",
          },
          {
            icon: ShieldCheck,
            title: "Transparent tracking",
            description: "Monitor application status, feedback, and next steps with clarity.",
          },
        ],
        formNote: "Sign in with the email you used to create your JobConnect profile to keep your applications in one place.",
        footerLabel: "Applicant success tips",
        footerCopy: "Keep achievements and portfolio links current to surface higher in recruiter searches.",
        ctaCopy: "Access applicant hub",
      },
    }),
    []
  );

  const highlights = roleHighlights[activeRole];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 sm:px-8 lg:flex-row lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl lg:block"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-blue-200">
            <span className="rounded-full bg-blue-500/20 p-2">
              <RolePillIcon className="h-5 w-5 text-blue-200" />
            </span>
            {highlights.tagline}
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white">
            {highlights.heading}
          </h2>
          <p className="mt-4 text-base text-slate-200/80">{highlights.subheading}</p>

          <div className="mt-8 space-y-6">
            {highlights.bullets.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl bg-white/5 p-4">
                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm text-slate-200/70">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="rounded-full bg-blue-500/20 p-3 text-blue-200">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-200/80">Premium Support</p>
              <p className="mt-1 text-base text-slate-200/90">
                Dedicated advisors accelerate your hiring success from day one.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl"
        >
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex justify-center lg:justify-start">
              <Link to="/">
                <img src={logo} alt="JobConnect" className="h-10 w-auto drop-shadow" />
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="text-sm font-medium text-slate-200 transition hover:text-white"
              >
                ← Back to Home
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-200/70">
                Need an account?
                <Link
                  to="/register"
                  className="font-semibold text-white underline-offset-4 transition hover:underline"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-full bg-white/10 p-1 text-sm">
              {(["EMPLOYER", "APPLICANT"]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={`flex-1 rounded-full px-4 py-2 font-semibold transition ${
                    activeRole === role
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-200/80 hover:text-white"
                  }`}
                >
                  {role === "EMPLOYER" ? "Employer" : "Applicant"}
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <h1 className="mt-5 text-3xl font-semibold text-white">
                  {activeRole === "EMPLOYER" ? "Sign in to recruit" : "Sign in to explore"}
                </h1>
                <p className="mt-2 text-sm text-slate-200/70">
                  Use your organisation credentials to access the {activeRole.toLowerCase()} workspace.
                </p>
              </motion.div>
            </div>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                  Work email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-3 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-3 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-200/80">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500/60"
                  />
                  Keep me signed in
                </label>
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-200 transition hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 py-3 text-sm font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-white/40 via-white/10 to-transparent opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Access dashboard
                  </div>
                )}
              </button>
            </form>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/70">
              <p className="font-semibold tracking-wide text-blue-100">
                Pro tip for employers
              </p>
              <p className="mt-2">
                Invite collaborators from Settings → Team to manage requisitions together.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
