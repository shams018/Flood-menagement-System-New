import HeroSection from "../components/HeroSection";
import MapAlertsSection from "../components/MapAlertsSection";
import Navbar from "../components/navBar";
import RegionalStatusSection from "../components/RegionalStatusSection";
import StatusTicker from "../components/StatusTicker";

/** Landing / marketing page (default at `/`). */
function LandingPage() {
  return (
    <>
      <Navbar />
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
