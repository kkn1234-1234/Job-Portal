import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  MapPin,
  UserPlus,
  Briefcase,
  ShieldCheck,
  Users,
  Sparkles,
  Building2
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/jobconnect-logo.svg";

const statusBadgeClasses = {
  APPLICANT: "bg-blue-500/20 text-blue-100",
  EMPLOYER: "bg-violet-500/20 text-violet-100"
};

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "APPLICANT",
    companyName: "",
    companyLocation: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const roleHighlights = useMemo(
    () => ({
      EMPLOYER: {
        heading: "Employer onboarding",
        subheading: "Build your hiring engine with a talent marketplace loved by high performers",
        bullets: [
          {
            icon: ShieldCheck,
            title: "Verified candidates",
            description: "Review rich applicant profiles complete with portfolios, credentials, and references."
          },
          {
            icon: Users,
            title: "Collaborative pipeline",
            description: "Invite your hiring team, leave notes, and move candidates forward together."
          },
          {
            icon: Sparkles,
            title: "Brand storytelling",
            description: "Showcase your culture while giving applicants clarity on process and expectations."
          }
        ]
      },
      APPLICANT: {
        heading: "Applicant onboarding",
        subheading: "Create a polished profile to unlock curated opportunities and real-time updates",
        bullets: [
          {
            icon: Briefcase,
            title: "Aligned roles",
            description: "Surface openings matched to your experience, interests, and growth goals."
          },
          {
            icon: Users,
            title: "Human mentorship",
            description: "Get nudges from mentors and recruiters to strengthen every application."
          },
          {
            icon: ShieldCheck,
            title: "Transparent tracking",
            description: "Stay informed on status changes, feedback, and next conversations instantly."
          }
        ]
      }
    }),
    []
  );

  const highlights = roleHighlights[form.role];

  const setRole = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
      companyName: role === "EMPLOYER" ? prev.companyName : "",
      companyLocation: role === "EMPLOYER" ? prev.companyLocation : ""
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.role === "EMPLOYER" && (!form.companyName || !form.companyLocation)) {
      toast.error("Please provide your company name and location");
      return;
    }

    setLoading(true);
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      phone: form.phone,
      companyName: form.role === "EMPLOYER" ? form.companyName : null,
      companyLocation: form.role === "EMPLOYER" ? form.companyLocation : null
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      toast.success("Registration successful!");
      if (result.user.role === "EMPLOYER") {
        navigate("/employer/dashboard");
      } else {
        navigate("/applicant/dashboard");
      }
    } else {
      toast.error(result.error);
    }
  };

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
              <Building2 className="h-5 w-5 text-blue-200" />
            </span>
            Tailored onboarding experience
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white">{highlights.heading}</h2>
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
            <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${statusBadgeClasses[form.role]}`}>
              {form.role === "EMPLOYER" ? "Employer" : "Applicant"}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-200/80">Curated onboarding</p>
              <p className="mt-1 text-base text-slate-200/90">
                Switch roles at any time — the experience adapts instantly to match your goals.
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
              <Link to="/" className="text-sm font-medium text-slate-200 transition hover:text-white">
                ← Back to Home
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-200/70">
                Already a member?
                <Link to="/login" className="font-semibold text-white underline-offset-4 transition hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-full bg-white/10 p-1 text-sm">
              {["APPLICANT", "EMPLOYER"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRole(role)}
                  className={`flex-1 rounded-full px-4 py-2 font-semibold transition ${
                    form.role === role ? "bg-white text-slate-900 shadow" : "text-slate-200/80 hover:text-white"
                  }`}
                >
                  {role === "EMPLOYER" ? "Employer" : "Applicant"}
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <motion.div
                key={form.role}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500">
                  <UserPlus className="h-7 w-7 text-white" />
                </div>
                <h1 className="mt-5 text-3xl font-semibold text-white">
                  {form.role === "EMPLOYER" ? "Create an employer account" : "Join the talent collective"}
                </h1>
                <p className="mt-2 text-sm text-slate-200/70">
                  Tell us a little about yourself so we can tailor the experience for you.
                </p>
              </motion.div>
            </div>

            <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-3 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                    placeholder="Jessica Pearson"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                  Business email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-3 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-200 mb-2">
                  Phone (optional)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-3 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {form.role === "EMPLOYER" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-200 mb-2">
                      Company name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Building className="h-5 w-5 text-slate-300" />
                      </div>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-3 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                        placeholder="Stark Industries"
                        value={form.companyName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyLocation" className="block text-sm font-medium text-slate-200 mb-2">
                      Headquarters
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-5 w-5 text-slate-300" />
                      </div>
                      <input
                        id="companyLocation"
                        name="companyLocation"
                        type="text"
                        className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-3 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                        placeholder="Bengaluru, India"
                        value={form.companyLocation}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
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
                      className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-3 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                      placeholder="Create a secure password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">At least 6 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-slate-300" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-3 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
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
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Create account
                  </div>
                )}
              </button>
            </form>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/70">
              <p className="font-semibold tracking-wide text-blue-100">Need help getting started?</p>
              <p className="mt-2">
                Our onboarding team is a message away at
                <a href="mailto:onboarding@jobconnect.io" className="ml-1 text-blue-200 underline">
                  onboarding@jobconnect.io
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
