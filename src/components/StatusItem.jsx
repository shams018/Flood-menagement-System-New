import { CheckCircle2, Circle } from "lucide-react";

export default function StatusItem({ label, time, status }) {
  return (
    <div className="flex gap-4 mb-8 relative last:mb-0">
      <div className="flex flex-col items-center">
        <div
          className={`z-10 p-1 rounded-full ${
            status === "complete"
              ? "bg-blue-500 text-black"
              : status === "active"
                ? "bg-blue-900 border border-blue-400 animate-pulse"
                : "bg-gray-800"
          }`}
        >
          {status === "complete" ? (
            <CheckCircle2 size={16} />
          ) : (
            <Circle size={16} />
          )}
        </div>
        <div className="w-[1px] h-full bg-gray-800 absolute top-6" />
      </div>
      <div>
        <p
          className={`text-xs font-bold uppercase tracking-tight ${
            status !== "pending" ? "text-white" : "text-gray-600"
          }`}
        >
          {label}
        </p>
        <p className="text-[10px] text-gray-500 mt-1 font-mono">{time}</p>
      </div>
    </div>
  );
}
