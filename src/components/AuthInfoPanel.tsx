import BrandMark from "./BrandMark";

interface AuthInfoPanelProps {
  variant?: "login" | "signup";
  className?: string;
}

const loginSteps = [
  { step: "01", label: "Enter mobile", detail: "Use your 10-digit number" },
  { step: "02", label: "Verify OTP", detail: "We send a secure one-time code" },
  { step: "03", label: "You're in", detail: "Discover people nearby instantly" },
];

const signupHighlights = [
  { value: "2 km", label: "Default discovery radius" },
  { value: "Masked", label: "Number privacy by default" },
  { value: "Free", label: "No card required to start" },
];

const signupServices = [
  "People search by name or mobile",
  "Local business discovery",
  "Community announcements",
  "Nearby events and RSVPs",
  "Built-in chat safety controls",
];

export default function AuthInfoPanel({
  variant = "signup",
  className = "",
}: AuthInfoPanelProps) {
  const isLogin = variant === "login";

  return (
    <aside
      className={`auth-resend-aside hidden lg:flex lg:w-[42%] xl:w-[40%] flex-col ${
        isLogin ? "justify-center" : "justify-start"
      } px-8 xl:px-12 py-10 ${className}`.trim()}
    >
      <div className="auth-resend-aside-inner">
        <div className="auth-resend-kicker">
          <BrandMark size="lg" showTm={false} />
        </div>
        <h1 className="auth-resend-aside-title">
          {isLogin ? (
            <>
              Welcome <span className="auth-resend-accent">back</span>
            </>
          ) : (
            <>
              Build your <span className="auth-resend-accent">local</span> profile
            </>
          )}
        </h1>
        <p className="auth-resend-aside-lead">
          {isLogin
            ? "Sign in to pick up where you left off — messages, connections, and community updates."
            : "Set up once with your location and privacy preferences, then start meeting people around you."}
        </p>

        {isLogin ? (
          <div className="auth-resend-aside-panel">
            <p className="auth-resend-aside-panel-label">Quick steps</p>
            <div className="auth-resend-step-list">
              {loginSteps.map((item) => (
                <div key={item.step} className="auth-resend-step-item">
                  <span className="auth-resend-step-num">{item.step}</span>
                  <div>
                    <p className="auth-resend-step-label">{item.label}</p>
                    <p className="auth-resend-step-detail">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="auth-resend-aside-stats">
              {signupHighlights.map((item) => (
                <div key={item.label} className="auth-resend-aside-stat">
                  <p className="auth-resend-aside-stat-value">{item.value}</p>
                  <p className="auth-resend-aside-stat-label">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="auth-resend-aside-panel auth-resend-aside-panel--glow">
              <p className="auth-resend-aside-panel-label">What you get</p>
              <ul className="auth-resend-aside-checklist">
                <li>
                  <i className="pi pi-check" />
                  Discover profiles near your area
                </li>
                <li>
                  <i className="pi pi-check" />
                  Message with privacy controls built in
                </li>
                <li>
                  <i className="pi pi-check" />
                  Follow local announcements and updates
                </li>
              </ul>
            </div>

            <div className="auth-resend-aside-panel">
              <p className="auth-resend-aside-panel-label">Our services</p>
              <ul className="auth-resend-aside-checklist">
                {signupServices.map((service) => (
                  <li key={service}>
                    <i className="pi pi-check" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="auth-resend-aside-foot">
          <span className="resend-pill resend-pill--success">Free to start</span>
          <span className="auth-resend-aside-foot-text">Privacy-first local connections</span>
        </div>
      </div>
    </aside>
  );
}
