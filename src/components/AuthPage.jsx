import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

function AuthPage() {
  const [tab, setTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "User",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    navigate(ROUTES.dashboard);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
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

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase transition-colors"
                >
                  FORGOT PASSWORD?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
              >
                INITIALIZE SESSION
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
                    <option>User</option>
                    <option>Organization</option>
                    <option>Emergency Services</option>
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

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
              >
                INITIATE ENROLLMENT
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
