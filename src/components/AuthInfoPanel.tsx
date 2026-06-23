interface AuthInfoPanelProps {
  variant?: "login" | "signup";
  className?: string;
}

export default function AuthInfoPanel({ variant = "signup", className = "" }: AuthInfoPanelProps) {
  const isLogin = variant === "login";

  const features = [
    {
      icon: "pi pi-users",
      title: "Connect Locally",
      description: "Find and connect with people in your area",
    },
    {
      icon: "pi pi-comments",
      title: "Real-time Messaging",
      description: "Chat instantly with your connections",
    },
    {
      icon: "pi pi-megaphone",
      title: "Announcements",
      description: "Share and discover local announcements",
    },
    {
      icon: "pi pi-shield",
      title: "Secure & Private",
      description: "Your data is protected and secure",
    },
  ];

  const signupFeatures = [
    {
      icon: "pi pi-globe",
      title: "Global Network",
      description: "Join a worldwide community of connected users",
    },
    {
      icon: "pi pi-search",
      title: "Smart Discovery",
      description: "Find people based on location and interests",
    },
    {
      icon: "pi pi-bell",
      title: "Stay Updated",
      description: "Get notified about important updates and messages",
    },
    {
      icon: "pi pi-heart",
      title: "Build Relationships",
      description: "Create meaningful connections in your community",
    },
    {
      icon: "pi pi-star",
      title: "Premium Features",
      description: "Unlock advanced features with premium plans",
    },
  ];

  const displayFeatures = isLogin ? features : signupFeatures;

  return (
    <div className={`hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-center px-8 xl:px-12 py-12 relative ${className}`.trim()}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-sky-500/10 to-cyan-500/10 opacity-50"></div>
      
      <div className="relative z-10">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-4xl xl:text-5xl font-black bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Checknown
          </h1>
          <p className="text-lg xl:text-xl text-text-secondary font-medium">
            Connecting People Over the Internet
          </p>
        </div>

        {!isLogin && (
          <div className="mb-8 rounded-xl border border-white/10 bg-bg-primary/30 backdrop-blur-sm p-5">
            <h2 className="text-2xl font-extrabold text-text-primary mb-2">
              Create Account
            </h2>
            <p className="text-text-secondary">
              Fill in your details to get started
            </p>
          </div>
        )}

        {/* Main description */}
        <div className="mb-8">
          <p className="text-base xl:text-lg text-text-secondary leading-relaxed">
            {isLogin
              ? "Welcome back! Sign in to continue connecting with people in your area and stay updated with the latest announcements."
              : "Join Checknown today and start connecting with people in your area. Create your account to discover local connections, share announcements, and build meaningful relationships."}
          </p>
        </div>

        {/* Features list */}
        <div className="flex flex-col gap-4">
          {displayFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-bg-primary/30 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <i className={`${feature.icon} text-white text-lg`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base xl:text-lg font-bold text-text-primary mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm xl:text-base text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info for signup */}
        {!isLogin && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 via-sky-500/10 to-cyan-500/10 border border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <i className="pi pi-check-circle text-primary text-xl"></i>
              <h3 className="text-lg font-bold text-text-primary">
                Why Choose Checknown?
              </h3>
            </div>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <i className="pi pi-check text-primary text-sm"></i>
                <span>100% Free to get started</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="pi pi-check text-primary text-sm"></i>
                <span>Location-based connections</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="pi pi-check text-primary text-sm"></i>
                <span>Privacy-focused platform</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
