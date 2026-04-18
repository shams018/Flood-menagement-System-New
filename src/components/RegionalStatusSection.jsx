const stats = [
  { icon: "o", value: "1,248", label: "REGISTERED VICTIMS", highlight: true },
  { icon: "+", value: "45", label: "RESCUE TEAMS ACTIVE" },
  { icon: "*", value: "82", label: "SHELTERS AVAILABLE" },
  { icon: "!", value: "12", label: "ACTIVE ALERTS", alert: true },
];

function RegionalStatusSection() {
  return (
    <section className="regional-section">
      <article className="regional-main-card">
        <div className="main-card-top">
          <div>
            <p className="meta">GLOBAL RISK PROFILE</p>
            <h2>REGIONAL STATUS</h2>
          </div>
          <button className="watch-pill" type="button">
            <span className="watch-dot" />
            WATCH
          </button>
        </div>

        <div className="status-line">
          <span className="big-number">04</span>
          <span className="label">ACTIVE SECTORS UNDER REVIEW</span>
        </div>
        <div className="progress-track">
          <span className="progress-fill" />
        </div>
      </article>

      <div className="metrics-grid">
        {stats.map((item) => (
          <article
            key={item.label}
            className={`metric-card ${item.highlight ? "highlight" : ""} ${
              item.alert ? "alert" : ""
            }`}
          >
            <span className="metric-icon">{item.icon}</span>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RegionalStatusSection;
