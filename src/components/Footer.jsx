const footerLinks = [
  "PRIVACY POLICY",
  "INCIDENT LOGS",
  "API ACCESS",
  "CONTACT SUPPORT",
];

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest text-center md:text-left">
          &copy; 2024 SENTINEL PROTOCOL. SITUATIONAL AWARENESS ENGINE.
        </p>

        <nav
          className="flex gap-6 md:gap-8 flex-wrap justify-center"
          aria-label="Footer links"
        >
          {footerLinks.map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs text-gray-400 uppercase tracking-wide hover:text-blue-400 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex gap-4" aria-label="Social links">
          <button
            type="button"
            aria-label="Share"
            className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-blue-400 rounded font-bold text-sm transition-colors border border-slate-700"
          >
            S
          </button>
          <button
            type="button"
            aria-label="GitHub"
            className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-blue-400 rounded font-bold text-sm transition-colors border border-slate-700"
          >
            G
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
