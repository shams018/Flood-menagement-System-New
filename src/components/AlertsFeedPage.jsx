import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

function AlertsFeedPage() {
  const navigate = useNavigate();

  return (
    <div className="alerts-feed-page">
      <header className="alerts-top-nav">
        <button
          className="alerts-brand"
          type="button"
          onClick={() => navigate(ROUTES.home)}
        >
          SENTINEL
        </button>
        <nav className="alerts-nav-links" aria-label="Main navigation">
          <a href="#" className="active" aria-current="page">
            ALERTS
          </a>
          <a href="#">MAP</a>
          <a href="#">CHAT</a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES.login);
            }}
          >
            LOGIN
          </a>
        </nav>
        <div className="alerts-nav-actions">
          <button className="emergency-btn emergency-btn--danger" type="button">
            EMERGENCY CALL
          </button>
          <span className="alerts-avatar" aria-hidden />
        </div>
      </header>

      <section className="alerts-hero">
        <div className="alerts-hero-grid">
          <div className="alerts-hero-copy">
            <p className="alerts-kicker">REAL-TIME SITUATIONAL AWARENESS</p>
            <h1>
              <span className="alerts-headline-strong">Active Flood</span>{" "}
              <span className="alerts-headline-accent">Intelligence.</span>
            </h1>
            <p className="alerts-lede">
              Sentinel Protocol processes thousands of hydrological data points per
              second to deliver verified emergency broadcasts before the surge hits.
            </p>
          </div>
          <aside className="alerts-status-card">
            <p className="alerts-status-label">GLOBAL ALERT STATUS</p>
            <p className="alerts-status-zones">
              <span className="alerts-status-dot" />
              14 High-Risk Zones
            </p>
            <button className="alerts-subscribe-btn" type="button">
              Subscribe to Alerts
            </button>
          </aside>
        </div>

        <div className="alerts-filter-bar">
          <div className="alerts-filters-left">
            <svg
              className="alerts-funnel-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            <span className="alerts-filters-label">FILTERS</span>
            <select className="alerts-select" aria-label="Region">
              <option>REGION: ALL GLOBAL</option>
            </select>
            <select className="alerts-select" aria-label="Severity">
              <option>SEVERITY: ALL</option>
            </select>
            <select className="alerts-select" aria-label="Date sort">
              <option>DATE: RECENT FIRST</option>
            </select>
          </div>
          <div className="alerts-live-stream">
            <span>LIVE STREAM:</span>
            <span className="alerts-stream-dot alerts-stream-dot--blue" />
            <span className="alerts-stream-dot alerts-stream-dot--yellow" />
            <span className="alerts-stream-dot alerts-stream-dot--red" />
          </div>
        </div>
      </section>

      <section className="alerts-incident-feed" aria-label="Live incident reports">
        <article className="incident-card incident-card--main">
          <div
            className="incident-card-media incident-card-media--flood"
            role="img"
            aria-label="Flooded urban street"
          >
            <span className="incident-badge incident-badge--emergency">EMERGENCY</span>
            <span className="incident-impact-tag">IMPACT IN: 04 MINUTES</span>
          </div>
          <div className="incident-card-body">
            <h2 className="incident-card-title">
              Sudden Surge: Lower Manhattan Zone 4
            </h2>
            <p className="incident-card-meta">
              Lower Manhattan, NY &middot; 12:42 PM EST
            </p>
            <div className="incident-ai-box">
              <span className="incident-ai-label">AI SUMMARY</span>
              <p>
                Rapid water-level rise detected upstream. Models indicate breach risk
                at seawall nodes LM-12 to LM-15 within the next hour. Evacuation
                corridors Alpha and Bravo remain open.
              </p>
            </div>
            <div className="incident-card-toolbar">
              <div className="incident-tags">
                <span>WIND 28 KTS</span>
                <span>RISE +0.4M / 15 MIN</span>
              </div>
              <a className="incident-log-link" href="#">
                Full Incident Log <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </article>

        <article className="incident-card incident-card--warning">
          <div
            className="incident-card-media incident-card-media--estuary"
            role="img"
            aria-label="Estuary at sunset"
          >
            <span className="incident-badge incident-badge--warning">WARNING</span>
          </div>
          <div className="incident-card-body incident-card-body--compact">
            <h3 className="incident-card-title-sm">Thames Estuary Watch</h3>
            <p className="incident-card-desc">
              Elevated tidal coupling combined with upstream discharge may exceed
              advisory thresholds near barrier gates T3-T5.
            </p>
            <div className="incident-card-row">
              <time>2 HOURS AGO</time>
              <button type="button" className="incident-read-more">
                Read More
              </button>
            </div>
          </div>
        </article>

        <article className="incident-card incident-card--watch">
          <div className="incident-watch-head">
            <span className="incident-badge incident-badge--watch">WATCH</span>
            <span className="incident-clock-icon" aria-hidden>
              ◷
            </span>
          </div>
          <h3 className="incident-card-title-sm">Rhine Valley Pre-Alert</h3>
          <p className="incident-card-desc">
            Long-range precipitation models suggest sustained saturation along the
            middle Rhine basin through Thursday.
          </p>
          <div className="incident-card-row">
            <time>10 HOURS AGO</time>
            <button type="button" className="incident-read-more">
              Read More
            </button>
          </div>
        </article>

        <article className="incident-card incident-card--priority">
          <div
            className="incident-card-media incident-card-media--cyclone"
            role="img"
            aria-label="Storm satellite view"
          />
          <div className="incident-card-body incident-card-body--split">
            <p className="incident-priority-label">HIGH PRIORITY EMERGENCY</p>
            <h2 className="incident-card-title">
              Coastal Breach: Mumbai North Coastal Sector
            </h2>
            <p className="incident-card-desc">
              Storm surge modeling shows overlapping king tide and cyclonic fetch.
              Municipal seawall monitoring stations report structural stress above
              rated tolerance. Shelter capacity and evacuation routes are being
              updated in real time.
            </p>
            <div className="incident-priority-actions">
              <button type="button" className="incident-btn-primary">
                View Evacuation Map
              </button>
              <button type="button" className="incident-btn-secondary">
                Alert Details
              </button>
            </div>
          </div>
        </article>
      </section>

      <div className="alerts-feed-end">
        <div className="alerts-feed-progress" aria-hidden>
          <div className="alerts-feed-progress-track" />
          <div className="alerts-feed-progress-fill" />
        </div>
        <p className="alerts-feed-end-label">VIEWING 12 OF 84 LIVE REPORTS</p>
        <button type="button" className="alerts-load-historical">
          Load Historical Logs
          <span className="alerts-load-chevron" aria-hidden>
            ⌄
          </span>
        </button>
      </div>

    </div>
  );
}

export default AlertsFeedPage;
