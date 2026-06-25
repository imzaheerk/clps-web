import { Link } from "react-router-dom";
import FooterTrademarkBand from "./FooterTrademarkBand";

const footerColumns: {
  title: string;
  links: { label: string; path?: string; href?: string }[];
}[] = [
  {
    title: "Features",
    links: [
      { label: "Announcements", path: "/announcements" },
      { label: "Business profiles", path: "/business" },
      { label: "Search", path: "/search" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Sign up", path: "/signup" },
      { label: "Log in", path: "/login" },
      { label: "Subscription", path: "/subscription" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", path: "/" },
      { label: "Contact", href: "mailto:contact@checknown.com" },
      { label: "Business", path: "/business" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Support", href: "mailto:contact@checknown.com" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "X", href: "https://twitter.com/checknown" },
      { label: "GitHub", href: "https://github.com/checknown" },
      { label: "LinkedIn", href: "https://linkedin.com/company/checknown" },
    ],
  },
];

const socialLinks = [
  { name: "X", icon: "pi pi-twitter", href: "https://twitter.com/checknown", ariaLabel: "Follow on X" },
  { name: "GitHub", icon: "pi pi-github", href: "https://github.com/checknown", ariaLabel: "GitHub" },
  { name: "LinkedIn", icon: "pi pi-linkedin", href: "https://linkedin.com/company/checknown", ariaLabel: "LinkedIn" },
  { name: "YouTube", icon: "pi pi-youtube", href: "https://youtube.com/@checknown", ariaLabel: "YouTube" },
];

export default function FooterSection() {
  return (
    <footer className="landing-footer">
      <FooterTrademarkBand />

      <div className="resend-container-wide landing-footer-body">
        <div className="landing-footer-layout">
          <div className="landing-footer-meta">
            <p className="landing-footer-address">
              Connecting people across the internet.
              <br />
              Local discovery, privacy-first.
            </p>

            <div className="landing-footer-social-row">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="landing-footer-social-icon"
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>

            <div className="landing-footer-status">
              <span className="landing-footer-status-dot" />
              All systems operational
            </div>
          </div>

          <div className="landing-footer-columns">
            {footerColumns.map((col) => (
              <div key={col.title} className="landing-footer-col">
                <h3 className="landing-footer-col-title">{col.title}</h3>
                <ul className="landing-footer-col-links">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.path ? (
                        <Link to={link.path} className="landing-footer-col-link">
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="landing-footer-col-link"
                          target={link.href?.startsWith("http") ? "_blank" : undefined}
                          rel={link.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
