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
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Full name, email, and password are required.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
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
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <button
          className="flex flex-col items-center gap-2 w-full mb-12 hover:opacity-80 transition-opacity"
          type="button"
          onClick={() => navigate(ROUTES.home)}
        >
          <span className="text-3xl font-black text-blue-400 tracking-wider">
            SENTINEL
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            SITUATIONAL AWARENESS ENGINE
          </span>
        </button>

        {/* Auth Card */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700 bg-slate-900/50">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`flex-1 py-4 px-6 font-bold uppercase text-sm tracking-wide transition-all duration-300 ${
                tab === "login"
                  ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex-1 py-4 px-6 font-bold uppercase text-sm tracking-wide transition-all duration-300 ${
                tab === "register"
                  ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* Login Tab */}
          {tab === "login" && (
            <form
              onSubmit={handleLoginSubmit}
              className="p-8 space-y-6 animate-in fade-in duration-300"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Welcome Back
                </h2>
                <p className="text-gray-400 text-sm">
                  Access the protocol monitoring dashboard.
                </p>
              </div>

              {error ? (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3">
                  {error}
                </p>
              ) : null}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@protocol.sentinel"
                  className="w-full px-4 py-3 bg-slate-900/50 text-white border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  PASSWORD
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 bg-slate-900/50 text-white border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                />
              </div>

              <div className="flex justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={handleForgotPasswordOpen}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase transition-colors"
                >
                  FORGOT PASSWORD?
                </button>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
              >
                {pending ? "CONNECTING…" : "INITIALIZE SESSION"}
              </button>

              <p className="text-center text-xs text-gray-500 uppercase tracking-widest">
                SECURE ENDPOINT ALPHA-7
              </p>
            </form>
          )}

          {/* Register Tab */}
          {tab === "register" && (
            <form
              onSubmit={handleRegisterSubmit}
              className="p-8 space-y-6 animate-in fade-in duration-300"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Protocol Enrollment
                </h2>
                <p className="text-gray-400 text-sm">
                  Initialize your mission-critical identity across Sentinel
                  Protocol.
                </p>
              </div>

              {error ? (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3">
                  {error}
                </p>
              ) : null}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full px-4 py-3 bg-slate-900/50 text-white border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@protocol"
                    className="w-full px-4 py-3 bg-slate-900/50 text-white border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    PHONE
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-slate-900/50 text-white border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    ACCOUNT ROLE
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-900/50 text-white border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  PASSWORD
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 bg-slate-900/50 text-white border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 bg-slate-900/50 text-white border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
              >
                {pending ? "ENROLLING…" : "INITIATE ENROLLMENT"}
              </button>

              <p className="text-center text-sm text-gray-400">
                Already enrolled?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-blue-400 hover:text-blue-300 font-bold"
                >
                  LOGIN HERE
                </button>
              </p>
            </form>
          )}
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

        {/* Footer Links */}
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
    </section>
  );
}

export default AuthPage;
