function HeroSection() {
  return (
    <section className="hero-section">
      <span className="status-pill">SYSTEM STATUS: ACTIVE MONITORING</span>

      <h1>
        AI-Powered Flood <br />
        <span>Early Warning</span>
        <br />
        &amp; Management.
      </h1>

      <p>
        Utilizing predictive neural networks and real-time telemetry to protect
        communities before the storm peaks.
      </p>

      <div className="hero-actions">
        <button className="primary-btn" type="button">
          View Live Alerts
        </button>
        <button className="secondary-btn" type="button">
          Register as Victim
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
