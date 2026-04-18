const metrics = [
  { label: "RAINFALL", value: "12.4 MM/HR" },
  { label: "TEMP", value: "24.5C" },
  { label: "HUMIDITY", value: "88%" },
  { label: "RISING WATER LEVELS DETECTED - SECTOR 4", value: "", warning: true },
];

function StatusTicker() {
  return (
    <div className="status-ticker" role="status" aria-live="polite">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`ticker-item ${metric.warning ? "warning" : ""}`}
        >
          <span className="dot" />
          <span>{metric.label}</span>
          {metric.value && <strong>{metric.value}</strong>}
        </div>
      ))}
    </div>
  );
}

export default StatusTicker;
