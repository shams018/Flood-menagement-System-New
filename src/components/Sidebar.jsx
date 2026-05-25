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
    <div className="w-[280px] shrink-0 bg-slate-950/95 p-4 flex flex-col justify-between border-r border-white/10 shadow-2xl shadow-black/40">
      <div className="space-y-8">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-700/80 p-4 shadow-lg shadow-black/10">
          <h1 className="text-sm font-semibold tracking-[0.34em] text-cyan-300 uppercase">
            Sentinel AI
          </h1>
          <p className="mt-3 text-sm text-gray-300 leading-6">
            ChatGPT-style insights for flood response, live coordination, and AI
            support.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-700/80 p-4 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.32em] text-gray-500 font-semibold mb-3">
            Channels
          </p>
          <div className="space-y-3">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => onSelectChannel(ch.id)}
                className={`w-full text-left rounded-2xl px-4 py-3 transition-all border ${
                  activeChannel === ch.id
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-200 shadow-inner"
                    : "border-slate-700 bg-slate-950 text-gray-300 hover:border-slate-500 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{ch.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{ch.hint}</p>
                  </div>
                  {activeChannel === ch.id ? (
                    <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-cyan-200">
                      Active
                    </span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-700/80 p-4 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.32em] text-gray-500 font-semibold mb-3">
            Recent activity
          </p>
          <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-950/90 p-4 text-[12px] text-gray-500">
                Loading saved chat previews...
              </div>
            ) : savedMessages.length === 0 ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-950/90 p-4 text-[12px] text-gray-500">
                No threads yet. Start a conversation to save previews.
              </div>
            ) : (
              savedMessages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  className="w-full text-left rounded-3xl border border-slate-800 bg-slate-950/90 p-4 transition hover:border-cyan-500/30 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                      {message.is_ai_message ? "AI" : "You"}
                    </span>
                    {message.created_at ? (
                      <time className="text-[10px] text-gray-500">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-gray-100 leading-5 line-clamp-3">
                    {message.body.length > 72
                      ? `${message.body.slice(0, 72)}...`
                      : message.body}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 p-4 text-[11px] text-gray-400">
        <p className="font-semibold text-gray-200 mb-2">
          ChatGPT-style quick controls
        </p>
        <p className="leading-relaxed">
          Use the left panel to switch channels, review recent threads, and keep
          chat context organized.
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
