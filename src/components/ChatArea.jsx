import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { API_BASE } from "../lib/config";
import { useAuth } from "../context/AuthContext";

function ChatArea({ channel }) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const lastJoinedRef = useRef(null);
  const channelRef = useRef(channel);
  const messagesEndRef = useRef(null);
  channelRef.current = channel;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const headerTitle =
    channel === "support"
      ? "# SUPPORT — HQ & field"
      : "# GENERAL — Field comms";

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
  }, [channel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = () => {
    const body = input.trim();
    if (!body || !socketRef.current?.connected) return;
    socketRef.current.emit("chat:send", { channel, body });
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 min-w-0">
      <div>
        <h2 className="text-lg font-semibold">{headerTitle}</h2>
        <p className="text-xs text-gray-400">
          {connected ? "LIVE · CONNECTED" : "RECONNECTING…"}
          {user?.full_name
            ? ` · ${user.full_name}`
            : user?.email
              ? ` · ${user.email}`
              : ""}
        </p>
      </div>

      <div className="flex-1 mt-6 space-y-4 overflow-y-auto min-h-[200px]">
        {messages.map((m) => {
          const mine =
            m.is_own_highlight ||
            (user &&
              (m.author_label === user.full_name ||
                m.author_label === user.email));
          return (
            <div
              key={m.id}
              className={
                mine
                  ? "bg-blue-400 text-black p-4 rounded-lg max-w-xl ml-auto"
                  : "bg-gray-800 p-4 rounded-lg max-w-xl"
              }
            >
              <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">
                {m.author_label}
              </p>
              <p className="text-sm whitespace-pre-wrap break-words">
                {m.body}
              </p>
              {m.created_at ? (
                <time className="text-[10px] opacity-60 mt-2 block">
                  {new Date(m.created_at).toLocaleString()}
                </time>
              ) : null}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-3">
        <input
          className="flex-1 bg-gray-800 p-3 rounded-lg outline-none min-w-0"
          placeholder={
            channel === "support"
              ? "Message HQ (location, need, status)…"
              : "Type message…"
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
          className="bg-blue-600 px-6 rounded-lg disabled:opacity-50 shrink-0"
          onClick={send}
          disabled={!connected || !input.trim()}
        >
          SEND
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
