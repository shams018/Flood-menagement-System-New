const footerLinks = [
  "PRIVACY POLICY",
  "INCIDENT LOGS",
  "API ACCESS",
  "CONTACT SUPPORT",
];

function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-copy">
        &copy; 2024 SENTINEL PROTOCOL. SITUATIONAL AWARENESS ENGINE.
      </p>

      <nav className="footer-links" aria-label="Footer links">
        {footerLinks.map((item) => (
          <a key={item} href="#">
            {item}
          </a>
        ))}
      </nav>

      <div className="footer-icons" aria-label="Social links">
        <button type="button" aria-label="Share">
          S
        </button>
        <button type="button" aria-label="GitHub">
          G
        </button>
      </div>
    </footer>
  );
}

export default Footer;
