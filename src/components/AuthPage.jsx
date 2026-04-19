import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

function AuthPage() {
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <button
          className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
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

        <article className="w-full bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-2xl">
          <div className="flex border-b border-slate-700">
            <button
              type="button"
              className={`flex-1 py-4 px-6 font-bold uppercase text-sm tracking-wide transition-colors ${
                tab === "login"
                  ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setTab("login")}
            >
              LOGIN
            </button>
            <button
              type="button"
              className={`flex-1 py-4 px-6 font-bold uppercase text-sm tracking-wide transition-colors ${
                tab === "register"
                  ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setTab("register")}
            >
              REGISTER
            </button>
          </div>

          {tab === "login" ? (
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-400 text-sm">
                  Access the protocol monitoring dashboard.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  ACCESS PROTOCOL
                </label>
                <div className="px-4 py-3 bg-slate-900/50 text-gray-300 rounded border border-slate-700 text-sm">
                  Logins as User
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  IDENTIFIER
                </label>
                <div className="px-4 py-3 bg-slate-900/50 text-gray-500 rounded border border-slate-700 text-sm">
                  email@protocol.sentinel
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    SECURITY PHRASE
                  </label>
                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase"
                  >
                    FORGOT?
                  </button>
                </div>
                <div className="px-4 py-3 bg-slate-900/50 text-gray-500 rounded border border-slate-700 text-sm">
                  ***********
                </div>
              </div>

              <button
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded transition-colors text-sm"
                type="button"
                onClick={() => navigate(ROUTES.dashboard)}
              >
                INITIALIZE SESSION
              </button>
              <small className="block text-center text-xs text-gray-500 uppercase tracking-widest">
                SECURE ENDPOINT ALPHA-7
              </small>
            </div>
          ) : (
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Protocol Enrollment
                </h2>
                <p className="text-gray-400 text-sm">
                  Initialize your mission-critical identity across the Sentinel
                  Protocol network.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    FULL NAME
                  </label>
                  <div className="px-0 py-2 border-b border-slate-700 text-gray-500 text-sm"></div>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    PROTOCOL EMAIL
                  </label>
                  <div className="px-0 py-2 border-b border-slate-700 text-gray-500 text-sm"></div>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    SECURE PHONE LINE
                  </label>
                  <div className="px-0 py-2 border-b border-slate-700 text-gray-500 text-sm"></div>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    ACCOUNT ROLE
                  </label>
                  <div className="px-0 py-2 border-b border-slate-700 text-gray-300 text-sm flex justify-between items-center">
                    User
                    <span>v</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    CREATE SECURITY PHRASE
                  </label>
                  <span className="text-xs text-green-400 font-bold uppercase">
                    ENTROPY: HIGH
                  </span>
                </div>
                <div className="px-0 py-2 border-b border-slate-700 text-gray-500 text-sm">
                  *************
                </div>
              </div>

              <button
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded transition-colors text-sm"
                type="button"
              >
                INITIATE ENROLLMENT
              </button>

              <p className="text-center text-sm text-gray-400">
                Already have a secure session?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-blue-400 hover:text-blue-300 font-bold"
                >
                  Login
                </button>
              </p>
            </div>
          )}
        </article>

        <div className="flex gap-6 text-xs text-gray-400 hover:[&_a]:text-white transition-colors">
          <a
            href="#"
            className="uppercase tracking-widest font-semibold hover:text-blue-400"
          >
            EMERGENCY MAP
          </a>
          <a
            href="#"
            className="uppercase tracking-widest font-semibold hover:text-blue-400"
          >
            PRIVACY PROTOCOL
          </a>
          <a
            href="#"
            className="uppercase tracking-widest font-semibold hover:text-blue-400"
          >
            SYSTEM STATUS
          </a>
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
