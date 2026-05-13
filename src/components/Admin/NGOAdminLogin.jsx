import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes";

const NGOAdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(ROUTES.ngoPortal);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-900/90 border border-slate-700 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-slate-800 p-10 lg:p-12 text-white flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-[0.35em] mb-4 text-sky-400">NGO ADMIN</h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Secure access for NGO coordinators and disaster response leaders.
                  Login with your authorized Sentinel credential to manage NGO operations.
                </p>
              </div>
              <div className="mt-10 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Fast access</p>
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Mission logging</p>
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Resource coordination</p>
              </div>
            </div>

            <div className="p-10 lg:p-12 bg-slate-950">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">NGO Admin Login</h2>
                <p className="text-sm text-slate-400">Enter your login credentials to continue.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.35em] text-slate-500 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="ngoadmin@sentinel.org"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-4 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.35em] text-slate-500 mb-3">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="••••••••••"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-4 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-[0.3em]">
                  <button type="button" className="text-sky-400 hover:text-sky-300 transition">
                    Forgot password?
                  </button>
                  <span>NGO Identity</span>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-slate-950 shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-blue-400"
                >
                  Login as NGO Admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NGOAdminLogin;
