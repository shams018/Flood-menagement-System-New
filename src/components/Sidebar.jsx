import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

const CHANNELS = [
  { id: "general", label: "General", hint: "All logged-in operators" },
  {
    id: "support",
    label: "Support & AI",
    hint: "Reach our AI Assistant & HQ team",
  },
];

function Sidebar({ activeChannel, onSelectChannel }) {
  const { token } = useAuth();
  const [savedMessages, setSavedMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setSavedMessages([]);
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      setLoading(true);
      try {
        const res = await apiFetch(
          `/api/chat/messages?channel=${encodeURIComponent(activeChannel)}`,
        );
        const data = await res.json();
        if (!cancelled) {
          const lastMessages = (data.messages || []).slice(-4).reverse();
          setSavedMessages(lastMessages);
        }
      } catch {
        if (!cancelled) setSavedMessages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeChannel, token]);

  return (
    <div className="w-72 bg-slate-900/80 p-4 flex flex-col justify-between border-r border-white/10 shadow-xl">
      <div>
        <div className="mb-6">
          <h1 className="text-sm font-semibold tracking-[0.32em] text-cyan-300 uppercase">
            Sentinel Chat
          </h1>
          <p className="text-xs text-gray-400 mt-2">
            Secure flood response chat with AI assistance and saved thread
            previews.
          </p>
        </div>

        <div className="mb-5">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">
            Channels
          </p>
          <div className="space-y-2">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => onSelectChannel(ch.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all border ${
                  activeChannel === ch.id
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-200"
                    : "border-transparent bg-slate-800 text-gray-300 hover:border-slate-500 hover:bg-slate-800/90"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">#{ch.label}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{ch.hint}</p>
                  </div>
                  {activeChannel === ch.id ? (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                      Active
                    </span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">
            Recent messages
          </p>
          <div className="space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3 text-[12px] text-gray-400">
                Loading saved chat...
              </div>
            ) : savedMessages.length === 0 ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3 text-[12px] text-gray-400">
                No saved messages yet. Start typing in the chat to save the
                thread.
              </div>
            ) : (
              savedMessages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-2xl border border-slate-700 bg-slate-800 p-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500 mb-2">
                    {message.is_ai_message ? "AI" : "You"}
                  </p>
                  <p className="text-sm text-gray-100 leading-snug break-words">
                    {message.body.length > 80
                      ? `${message.body.slice(0, 80)}...`
                      : message.body}
                  </p>
                  {message.created_at ? (
                    <time className="text-[10px] text-gray-500 mt-2 block">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </time>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          General: Live team chat. Support: AI assistant and HQ coordination.
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
