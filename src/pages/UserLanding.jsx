import HeroSection from "../components/HeroSection";
import ImageCarouselSection from "../components/ImageCarouselSection";
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
      <ImageCarouselSection />
      <RegionalStatusSection />
      <MapAlertsSection />
    </>
  );
}

export default LandingPage;
