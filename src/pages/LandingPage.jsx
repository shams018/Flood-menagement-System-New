import HeroSection from "../components/HeroSection";
import MapAlertsSection from "../components/MapAlertsSection";
import RegionalStatusSection from "../components/RegionalStatusSection";
import StatusTicker from "../components/StatusTicker";

/** Landing / marketing page (default at `/`). */
function LandingPage() {
  return (
    <>
      <StatusTicker />
      <div className="hero-shell">
        <HeroSection />
      </div>
      <RegionalStatusSection />
      <MapAlertsSection />
    </>
  );
}

export default LandingPage;
