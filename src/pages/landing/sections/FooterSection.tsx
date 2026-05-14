import { Link } from "react-router-dom";

export default function FooterSection() {
  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
  ];

  const socialMediaLinks = [
    {
      name: "Facebook",
      icon: "pi pi-facebook",
      href: "https://facebook.com/checknown",
      ariaLabel: "Visit our Facebook page",
    },
    {
      name: "Twitter",
      icon: "pi pi-twitter",
      href: "https://twitter.com/checknown",
      ariaLabel: "Follow us on Twitter",
    },
    {
      name: "Instagram",
      icon: "pi pi-instagram",
      href: "https://instagram.com/checknown",
      ariaLabel: "Follow us on Instagram",
    },
  ];

  const contactInfo = [
    {
      icon: "pi pi-envelope",
      label: "Email",
      value: "contact@checknown.com",
      href: "mailto:contact@checknown.com",
    },
    {
      icon: "pi pi-phone",
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: "pi pi-phone",
      label: "Telephone",
      value: "+1 (555) 987-6543",
      href: "tel:+15559876543",
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-bg-secondary/30 backdrop-blur-sm mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl sm:text-3xl font-black mb-3 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Checknown
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">
              A modern way to connect with people around you, stay informed, and build strong local communities.
            </p>
            <div className="relative w-full h-32 sm:h-36 rounded-2xl border border-white/10 bg-bg-primary/20 overflow-hidden p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.12),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.12),transparent_45%)] pointer-events-none" />
              <div className="relative h-full flex items-end justify-center gap-2">
                <div className="w-2.5 h-8 rounded-full bg-gradient-to-t from-primary to-cyan-400 animate-pulse" />
                <div className="w-2.5 h-14 rounded-full bg-gradient-to-t from-cyan-500 to-emerald-400 animate-pulse [animation-delay:200ms]" />
                <div className="w-2.5 h-10 rounded-full bg-gradient-to-t from-primary to-cyan-400 animate-pulse [animation-delay:400ms]" />
                <div className="w-2.5 h-16 rounded-full bg-gradient-to-t from-emerald-500 to-cyan-300 animate-pulse [animation-delay:600ms]" />
                <div className="w-2.5 h-9 rounded-full bg-gradient-to-t from-primary to-cyan-400 animate-pulse [animation-delay:800ms]" />
                <div className="w-2.5 h-13 rounded-full bg-gradient-to-t from-cyan-500 to-emerald-400 animate-pulse [animation-delay:1000ms]" />
              </div>
              <div className="absolute left-4 right-4 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-6">
              Contact
            </h3>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="group flex items-center gap-4 p-3 rounded-xl bg-bg-primary/20 hover:bg-bg-primary/30 border border-white/5 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <i className={`${contact.icon} text-white text-base`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-0.5">
                      {contact.label}
                    </p>
                    <p className="text-text-primary group-hover:text-primary transition-colors duration-200 text-sm sm:text-base font-medium truncate">
                      {contact.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Social Media & Legal */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Follow Us
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {socialMediaLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="group relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                >
                  <i className={`${social.icon} text-white text-lg group-hover:scale-110 transition-transform duration-300`}></i>
                </a>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">
                Legal
              </h4>
              <ul className="space-y-1">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Checknown. All rights reserved.
          </p>
          <p className="text-text-tertiary text-sm">
            Connecting people across the internet.
          </p>
        </div>
      </div>
    </footer>
  );
}
