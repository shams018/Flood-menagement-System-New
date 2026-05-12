const metrics = [
  { label: "RAINFALL", value: "12.4 MM/HR" },
  { label: "TEMP", value: "24.5C" },
  { label: "HUMIDITY", value: "88%" },
  {
    label: "RISING WATER LEVELS DETECTED - SECTOR 4",
    value: "",
    warning: true,
  },
];

function StatusTicker() {
  return (
    <div
      className="flex gap-6 overflow-x-auto bg-slate-800 px-6 py-3 text-white text-sm"
      role="status"
      aria-live="polite"
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`flex items-center gap-2 whitespace-nowrap ${
            metric.warning ? "text-red-400" : "text-green-400"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${metric.warning ? "bg-red-500" : "bg-green-500"}`}
          />
          <span>{metric.label}</span>
          {metric.value && (
            <strong className="text-white">{metric.value}</strong>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatusTicker;
