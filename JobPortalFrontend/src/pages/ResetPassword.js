import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import authService from "../api/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Reset link is invalid or missing. Please request a new one.");
      return;
    }

    if (!form.password || !form.confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password should be at least 8 characters long.");
      return;
    }

    try {
      setSubmitting(true);
      await authService.resetPassword(token, form.password);
      toast.success("Password updated. You can now sign in.");
      navigate("/login");
    } catch (error) {
      const message = error?.response?.data?.error || "Reset link is no longer valid.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl"
        >
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-semibold text-white">Set a new password</h1>
              <p className="text-sm text-slate-200/80">
                Choose a secure password you haven&apos;t used recently. You&apos;ll use this to access JobConnect from now on.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 px-4 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                  placeholder="Enter a strong password"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 px-4 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 py-3 text-sm font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-white/40 via-white/10 to-transparent opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                {submitting ? "Updating password..." : "Update password"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400">
              Link expired? <Link to="/forgot-password" className="font-semibold text-white underline-offset-4 hover:underline">Request a new reset email</Link>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
