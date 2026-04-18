const recentAlerts = [
  {
    level: "DANGER - LEVEL 5",
    time: "12:45 PM",
    title: "Coastal Breach Forecast: Sector 7",
    text: "Neural model predicts 85% probability of overflow within 4 hours. Immediate evacuation of lower banks recommended.",
    footer: "92% AI CONFIDENCE",
    critical: true,
  },
  {
    level: "WATCH - LEVEL 2",
    time: "11:20 AM",
    title: "Upstream Flow Increase",
    text: "Gage sensor #442 reporting steady rise. Monitor drainage systems in residential zone Delta.",
    footer: "TELEMETRY VALIDATED",
  },
  {
    level: "WATCH - LEVEL 3",
    time: "08:15 AM",
    title: "Rainfall Threshold Warning",
    text: "Accumulated rainfall has exceeded 50mm in 24 hours. Soil saturation levels at critical capacity.",
  },
];

function MapAlertsSection() {
  return (
    <section className="map-alerts-section">
      <article className="map-card">
        <div className="zone-chip">
          <span className="zone-icon">o</span>
          <div>
            <small>COORDINATION CENTER</small>
            <strong>Zone Alpha-9</strong>
          </div>
        </div>

        <div className="zoom-controls">
          <button type="button">+</button>
          <button type="button">-</button>
        </div>
      </article>

      <aside className="alerts-panel">
        <header>
          <h3>RECENT ALERTS</h3>
          <button type="button">LIVE FEED</button>
        </header>

        <div className="alerts-list">
          {recentAlerts.map((alert) => (
            <article key={alert.title} className="alert-item">
              <div className="alert-top">
                <span className={alert.critical ? "critical" : ""}>{alert.level}</span>
                <time>{alert.time}</time>
              </div>
              <h4>{alert.title}</h4>
              <p>{alert.text}</p>
              {alert.footer && <small>{alert.footer}</small>}
            </article>
          ))}
        </div>

        <button className="archives-btn" type="button">
          VIEW ALL ARCHIVES
        </button>
      </aside>
    </section>
  );
}

export default MapAlertsSection;
