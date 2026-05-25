import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

function AuthPage() {
  const [tab, setTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    role: "User",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error while user types
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const emailIsValid = (v) => {
    if (!v) return false;
    // simple email regex
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  };

  const phoneIsValid = (v) => {
    if (!v) return true; // phone optional, treat empty as valid
    // allow international digits, spaces, dashes, parentheses
    return /^\+?[0-9 ()-]{7,20}$/.test(v);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value || !String(value).trim()) return "Full name is required";
        return undefined;
      case "email":
        if (!value) return "Email is required";
        if (!emailIsValid(value)) return "Enter a valid email address";
        return undefined;
      case "phone":
        if (!phoneIsValid(value)) return "Enter a valid phone number";
        return undefined;
      case "password":
        if (!value) return "Password is required";
        if (String(value).length < 8)
          return "Password must be at least 8 characters";
        return undefined;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateAll = () => {
    const names = ["fullName", "email", "phone", "password", "confirmPassword"];
    const errors = {};
    names.forEach((n) => {
      const err = validateField(n, formData[n]);
      if (err) errors[n] = err;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getDefaultRedirect = (role) => {
    if (String(role || "").toLowerCase() === "admin") {
      return ROUTES.adminDashboard;
    }
    if (
      location.state?.from?.pathname &&
      location.state.from.pathname !== ROUTES.login
    ) {
      return location.state.from.pathname;
    }
    return ROUTES.dashboard;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setPending(true);
    try {
      const data = await login(formData.email, formData.password);
      navigate(getDefaultRedirect(data.user?.role), { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setPending(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateAll()) {
      setError("Please fix the highlighted fields before continuing.");
      return;
    }

    setPending(true);
    try {
      const data = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
      });
      navigate(getDefaultRedirect(data.user?.role), { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setPending(false);
    }
  };

  const handleForgotPasswordOpen = () => {
    setForgotEmail(formData.email || "");
    setForgotError("");
    setForgotMessage("");
    setShowForgotModal(true);
  };

  const handleForgotPasswordClose = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotError("");
    setForgotMessage("");
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    if (!forgotEmail) {
      setForgotError("Please enter your email address.");
      return;
    }
    try {
      const res = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Unable to process request");
      setForgotMessage(
        data.message || "If the email exists, reset instructions were sent.",
      );
    } catch (err) {
      setForgotError(err.message || "Failed to send reset instructions");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200 mb-8">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 animate-pulse" />
              LIVE FLOOD ACCESS
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Secure login and registration for the Sentinel dashboard.
              </h1>
              <p className="max-w-3xl text-slate-300 leading-8">
                Sign in to review alerts, submit reports, and coordinate
                response efforts. New users can register instantly with a
                consistent and polished interface.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Unified Theme",
                  text: "Login and registration share the same visual style for a seamless user journey.",
                },
                {
                  title: "Secure Access",
                  text: "Encrypted sign-in ensures your flood response data stays protected.",
                },
                {
                  title: "Fast Onboarding",
                  text: "Register quickly with clear validation and a simple layout.",
                },
                {
                  title: "Live Alerts",
                  text: "Start receiving operational intelligence as soon as you sign in.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-slate-900/80 p-5"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Support
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Need help accessing your account? Use the password reset flow,
                or contact the system team for assistance.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleForgotPasswordOpen}
                  className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/15"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  System Status
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/30 overflow-hidden">
            <div className="flex border-b border-white/10 bg-slate-900/80">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`flex-1 py-4 px-6 text-sm font-bold uppercase tracking-[0.35em] transition-all duration-300 ${
                  tab === "login"
                    ? "bg-slate-950/90 text-cyan-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setTab("register")}
                className={`flex-1 py-4 px-6 text-sm font-bold uppercase tracking-[0.35em] transition-all duration-300 ${
                  tab === "register"
                    ? "bg-slate-950/90 text-cyan-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            <div className="p-8 space-y-6">
              {tab === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-black text-white">
                      Sign in to Sentinel
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Use your account to access live alerts, reports, and flood
                      intelligence.
                    </p>
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-800/60 bg-red-950/30 p-4 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@sentinel.com"
                      className="w-full h-14 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••••"
                      className="w-full h-14 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleForgotPasswordOpen}
                      className="text-xs uppercase tracking-[0.35em] text-cyan-300 transition hover:text-cyan-100"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-sm font-bold text-slate-950 uppercase tracking-[0.35em] transition hover:opacity-95 disabled:opacity-60"
                  >
                    {pending ? "CONNECTING…" : "Sign in"}
                  </button>

                  <p className="text-center text-sm text-slate-400">
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("register")}
                      className="text-cyan-300 hover:text-cyan-100 font-semibold"
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-black text-white">
                      Create your Sentinel account
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Register to submit reports, receive alerts, and join the
                      flood response network.
                    </p>
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-800/60 bg-red-950/30 p-4 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="Enter full name"
                        className={`w-full h-14 rounded-2xl border px-4 text-white outline-none transition focus:ring-1 focus:ring-cyan-400 ${fieldErrors.fullName ? "border-red-500 bg-slate-900/80" : "border-slate-700 bg-slate-900/90"}`}
                      />
                      {fieldErrors.fullName && (
                        <p className="mt-2 text-sm text-red-400">
                          {fieldErrors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="email@sentinel.com"
                        className={`w-full h-14 rounded-2xl border px-4 text-white outline-none transition focus:ring-1 focus:ring-cyan-400 ${fieldErrors.email ? "border-red-500 bg-slate-900/80" : "border-slate-700 bg-slate-900/90"}`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-2 text-sm text-red-400">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full h-14 rounded-2xl border px-4 text-white outline-none transition focus:ring-1 focus:ring-cyan-400 ${fieldErrors.phone ? "border-red-500 bg-slate-900/80" : "border-slate-700 bg-slate-900/90"}`}
                      />
                      {fieldErrors.phone && (
                        <p className="mt-2 text-sm text-red-400">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
                        Account Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full h-14 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="••••••••••"
                        className={`w-full h-14 rounded-2xl border px-4 text-white outline-none transition focus:ring-1 focus:ring-cyan-400 ${fieldErrors.password ? "border-red-500 bg-slate-900/80" : "border-slate-700 bg-slate-900/90"}`}
                      />
                      {fieldErrors.password && (
                        <p className="mt-2 text-sm text-red-400">
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="••••••••••"
                        className={`w-full h-14 rounded-2xl border px-4 text-white outline-none transition focus:ring-1 focus:ring-cyan-400 ${fieldErrors.confirmPassword ? "border-red-500 bg-slate-900/80" : "border-slate-700 bg-slate-900/90"}`}
                      />
                      {fieldErrors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-400">
                          {fieldErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-sm font-bold text-slate-950 uppercase tracking-[0.35em] transition hover:opacity-95 disabled:opacity-60"
                  >
                    {pending ? "ENROLLING…" : "Create account"}
                  </button>

                  <p className="text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className="text-cyan-300 hover:text-cyan-100 font-semibold"
                    >
                      Login instead
                    </button>
                  </p>
                </form>
              )}
            </div>
          </section>
        </div>

        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
            <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Forgot Password
                  </h3>
                  <p className="text-sm text-gray-400">
                    Enter the email address for your Sentinel account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPasswordClose}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                {forgotMessage ? (
                  <p className="text-sm text-green-300 bg-green-950/40 border border-green-800/60 rounded-xl px-4 py-3">
                    {forgotMessage}
                  </p>
                ) : null}
                {forgotError ? (
                  <p className="text-sm text-red-300 bg-red-950/40 border border-red-800/60 rounded-xl px-4 py-3">
                    {forgotError}
                  </p>
                ) : null}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    name="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="email@protocol.sentinel"
                    className="w-full px-4 py-3 bg-slate-900/50 text-white border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleForgotPasswordClose}
                    className="px-4 py-3 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex gap-6 justify-center mt-8 text-xs text-gray-400">
          <a
            href="#"
            className="uppercase tracking-widest font-semibold hover:text-blue-400 transition-colors"
          >
            EMERGENCY MAP
          </a>
          <a
            href="#"
            className="uppercase tracking-widest font-semibold hover:text-blue-400 transition-colors"
          >
            PRIVACY PROTOCOL
          </a>
          <a
            href="#"
            className="uppercase tracking-widest font-semibold hover:text-blue-400 transition-colors"
          >
            SYSTEM STATUS
          </a>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
