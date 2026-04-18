import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

function AuthPage() {
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();

  return (
    <section className="auth-page">
      <div className="auth-overlay">
        <button
          className="auth-logo"
          type="button"
          onClick={() => navigate(ROUTES.home)}
        >
          SENTINEL
          <span>SITUATIONAL AWARENESS ENGINE</span>
        </button>

        <article className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={tab === "login" ? "active" : ""}
              onClick={() => setTab("login")}
            >
              LOGIN
            </button>
            <button
              type="button"
              className={tab === "register" ? "active" : ""}
              onClick={() => setTab("register")}
            >
              REGISTER
            </button>
          </div>

          {tab === "login" ? (
            <div className="auth-content">
              <h2>Welcome Back</h2>
              <p>Access the protocol monitoring dashboard.</p>

              <label>ACCESS PROTOCOL</label>
              <div className="auth-input">Logins as User</div>

              <label>IDENTIFIER</label>
              <div className="auth-input muted">email@protocol.sentinel</div>

              <div className="auth-label-row">
                <label>SECURITY PHRASE</label>
                <button type="button">FORGOT?</button>
              </div>
              <div className="auth-input muted">***********</div>

              <button
                className="auth-submit"
                type="button"
                onClick={() => navigate(ROUTES.dashboard)}
              >
                INITIALIZE SESSION
              </button>
              <small>SECURE ENDPOINT ALPHA-7</small>
            </div>
          ) : (
            <div className="auth-content enrollment-content">
              <h2>Protocol Enrollment</h2>
              <p>
                Initialize your mission-critical identity across the Sentinel
                Protocol network.
              </p>

              <div className="enrollment-grid">
                <div className="enrollment-field">
                  <label>FULL NAME</label>
                  <div className="line-input muted "></div>
                </div>
                <div className="enrollment-field">
                  <label>PROTOCOL EMAIL</label>
                  <div className="line-input muted"></div>
                </div>
                <div className="enrollment-field">
                  <label>SECURE PHONE LINE</label>
                  <div className="line-input muted"></div>
                </div>
                <div className="enrollment-field">
                  <label>ACCOUNT ROLE</label>
                  <div className="line-input">
                    User
                    <span>v</span>
                  </div>
                </div>
              </div>

              <div className="auth-label-row enrollment-label-row">
                <label>CREATE SECURITY PHRASE</label>
                <span>ENTROPY: HIGH</span>
              </div>
              <div className="line-input muted">*************</div>

              <button className="auth-submit" type="button">
                INITIATE ENROLLMENT
              </button>

              <p className="auth-switch">
                Already have a secure session?{" "}
                <button type="button" onClick={() => setTab("login")}>
                  Login
                </button>
              </p>
            </div>
          )}
        </article>

        <div className="auth-links">
          <a href="#">EMERGENCY MAP</a>
          <a href="#">PRIVACY PROTOCOL</a>
          <a href="#">SYSTEM STATUS</a>
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
