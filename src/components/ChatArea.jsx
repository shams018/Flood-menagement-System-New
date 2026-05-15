import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { API_BASE } from "../lib/config";
import { useAuth } from "../context/AuthContext";
import { Bot } from "lucide-react";

function ChatArea({ channel }) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const lastJoinedRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const channelRef = useRef(channel);
  const messagesEndRef = useRef(null);
  channelRef.current = channel;

  const setTypingState = (active) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (active) {
      setIsTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        typingTimeoutRef.current = null;
      }, 10000);
    } else {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const headerTitle =
    channel === "support" ? "Support & AI Assistant" : "General Field Comms";

  useEffect(() => {
    // Check AI status
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chat/ai/status`);
        const data = await res.json();
        setAiAvailable(data.aiAvailable);
      } catch {
        setAiAvailable(false);
      }
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/chat/messages?channel=${encodeURIComponent(channel)}`,
        );
        const data = await res.json();
        if (!cancelled) setMessages(data.messages || []);
      } catch {
        if (!cancelled) setMessages([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [channel]);

  useEffect(() => {
    if (!token) return undefined;
    const socketUrl = API_BASE || window.location.origin;
    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    const syncJoin = (ch) => {
      if (lastJoinedRef.current && lastJoinedRef.current !== ch) {
        socket.emit("leave", lastJoinedRef.current);
      }
      socket.emit("join", ch);
      lastJoinedRef.current = ch;
    };

    socket.on("connect", () => {
      setConnected(true);
      syncJoin(channelRef.current);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("chat:message", (msg) => {
      if (msg.channel !== channelRef.current) return;
      setMessages((prev) => {
        if (prev.some((p) => p.id === msg.id)) return prev;
        return [...prev, msg];
      });
      if (
        channelRef.current === "support" &&
        msg.author_label === "Sentinel AI Assistant"
      ) {
        setTypingState(false);
      }
    });

    socket.on("connect_error", () => setConnected(false));

    return () => {
      lastJoinedRef.current = null;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    if (lastJoinedRef.current === channel) return;
    if (lastJoinedRef.current) {
      socket.emit("leave", lastJoinedRef.current);
    }
    socket.emit("join", channel);
    lastJoinedRef.current = channel;
    if (channel !== "support") {
      setTypingState(false);
    }
  }, [channel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = () => {
    const body = input.trim();
    if (!body || !socketRef.current?.connected) return;
    socketRef.current.emit("chat:send", { channel, body });
    setInput("");
    if (channel === "support") {
      setTypingState(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 min-w-0">
      <div>
        <h2 className="text-lg font-semibold">{headerTitle}</h2>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xs text-gray-400">
            {connected ? "LIVE · CONNECTED" : "RECONNECTING…"}
            {user?.full_name
              ? ` · ${user.full_name}`
              : user?.email
                ? ` · ${user.email}`
                : ""}
          </p>
          {["support", "general"].includes(channel) && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs">
              <Bot size={12} className="text-cyan-400" />
              <span className="text-cyan-400">
                {aiAvailable ? "AI Active" : "Fallback Mode"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950/60 p-5 shadow-inner shadow-black/20">
        {messages.length === 0 ? (
          <div className="mx-auto my-20 max-w-md rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-gray-400">
            <p className="text-sm font-semibold text-gray-200 mb-2">
              No chat history yet
            </p>
            <p className="text-xs leading-relaxed">
              Start a conversation in this channel and your messages will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => {
              const mine =
                !m.is_ai_message &&
                user &&
                (m.author_label === user.full_name ||
                  m.author_label === user.email);
              const isAI = Boolean(m.is_ai_message);

              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] min-w-[30%] rounded-3xl border p-4 shadow-sm ${
                      isAI
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-100"
                        : mine
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-slate-800 border-slate-700 text-gray-100"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-60">
                      <span>
                        {isAI ? "Sentinel AI" : mine ? "You" : m.author_label}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {m.body}
                    </p>
                    {m.created_at ? (
                      <time className="mt-3 block text-[10px] opacity-60">
                        {new Date(m.created_at).toLocaleTimeString()}
                      </time>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {channel === "support" && isTyping ? (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-800 border border-cyan-500/30 text-xs text-cyan-200">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Sentinel AI Assistant is typing...
        </div>
      ) : null}

      <div className="mt-5 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-4 shadow-lg shadow-black/20">
        <div className="flex gap-3">
          <input
            className="flex-1 min-w-0 rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-gray-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            placeholder={
              channel === "support"
                ? "Ask the AI assistant about flood safety, shelters, or emergency response..."
                : "Update status or send a field report..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            type="button"
            className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
            onClick={send}
            disabled={!connected || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
