import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <section className="dashboard-page">
      <aside className="dash-sidebar">
        <div>
          <p className="dash-kicker">Sentinel - User Dashboard</p>
          <h2>Protocol Alpha</h2>
          <small>FLOOD MONITORING</small>

          <nav className="dash-menu">
            <button className="active" type="button">
              DASHBOARD
            </button>
            <button type="button">LIVE MAP</button>
            <button type="button">VICTIM REPORTS</button>
            <button type="button">NGO COORDINATION</button>
          </nav>
        </div>

        <div className="dash-side-footer">
          <button type="button">SETTINGS</button>
          <button type="button">SUPPORT</button>
          <article>
            <h4>STATUS</h4>
            <p>System operational. No active threats in your immediate zone.</p>
          </article>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <button
            type="button"
            className="dash-brand"
            onClick={() => navigate(ROUTES.home)}
          >
            SENTINEL
          </button>
          <nav>
            <a href="#">ALERTS</a>
            <a href="#">MAP</a>
            <a href="#">CHAT</a>
          </nav>
          <div className="dash-user">Marcus Thorne</div>
        </header>

        <div className="dash-grid">
          <section className="welcome-card">
            <span>STANDARD ALERT PROTOCOL</span>
            <h1>Welcome back, Marcus.</h1>
            <p>
              Your current region (Sector 7G) is under moderate observation. No
              immediate evacuation required.
            </p>
            <div>
              <button type="button">View Daily Brief</button>
              <button type="button" className="ghost">
                System Logs
              </button>
            </div>
          </section>

          <section className="weather-card">
            <small>REAL-TIME WEATHER</small>
            <h3>Sector 7G: West</h3>
            <strong>24C</strong>
            <p>Light precipitation expected.</p>
          </section>

          <section className="alerts-card">
            <h3>Active Alerts</h3>
            <article>
              <small>SEVERE RISK</small>
              <h4>Downstream Flood Level Warning</h4>
              <p>River gauge at Bridge 04 has exceeded 4.5m.</p>
            </article>
            <article>
              <small>MODERATE WATCH</small>
              <h4>Precipitation Spike Forecast</h4>
              <p>Incoming heavy storm cell expected to arrive within 2 hours.</p>
            </article>
          </section>

          <section className="actions-card">
            <h3>Quick Actions</h3>
            <button type="button">Register as Victim</button>
            <button type="button">Nearest Shelter</button>
            <button type="button">Open Chat Board</button>
          </section>

          <section className="shelter-card">
            <h3>Nearest Shelter</h3>
            <article>
              <strong>City Hall Safezone</strong>
              <p>1.2 KM</p>
            </article>
            <button type="button">GET DIRECTIONS</button>
          </section>
        </div>
      </main>
    </section>
  );
}

export default DashboardPage;
