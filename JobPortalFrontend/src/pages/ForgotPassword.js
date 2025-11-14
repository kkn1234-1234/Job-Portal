import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import authService from "../api/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSubmitted(true);
      toast.success("Reset instructions have been emailed if the account exists.");
    } catch (error) {
      const message = error?.response?.data?.error || "Unable to send reset email";
      toast.error(message);
    } finally {
      setLoading(false);
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
          {!submitted ? (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-semibold text-white">Forgot your password?</h1>
                <p className="text-sm text-slate-200/80">
                  Enter the email associated with your JobConnect account and we'll send over a secure reset link.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 px-4 text-sm text-white placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:bg-slate-900/60 focus:ring-2 focus:ring-blue-500/60"
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 py-3 text-sm font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-white/40 via-white/10 to-transparent opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                  {loading ? "Sending instructions..." : "Send reset link"}
                </button>
              </form>

              <p className="text-center text-sm text-slate-300">
                Remembered your password?{" "}
                <Link to="/login" className="font-semibold text-white underline-offset-4 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <h1 className="text-3xl font-semibold text-white">Check your inbox</h1>
              <p className="text-sm text-slate-200/80">
                We've sent reset instructions to <span className="font-semibold text-white">{email}</span>. The link will be valid for the next hour.
              </p>
              <p className="text-sm text-slate-400">
                Didn't receive anything? Be sure to check your spam folder or request a new email above.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
              >
                Back to login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
