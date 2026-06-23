import { useLocation, useNavigate } from "react-router-dom";

export default function AuthModeSwitch() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";

  return (
    <div
      className={`auth-mode-switch relative grid grid-cols-2 gap-1 p-1 rounded-2xl bg-bg-primary/45 border border-white/10 backdrop-blur-md mb-5 sm:mb-6`}
      role="tablist"
      aria-label="Authentication mode"
    >
      <span
        className="auth-mode-switch-indicator absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-primary to-cyan-500 shadow-lg shadow-primary/30"
        style={{
          left: isSignup ? "calc(50% + 2px)" : "4px",
          width: "calc(50% - 6px)",
        }}
        aria-hidden
      />
      <button
        type="button"
        role="tab"
        aria-selected={!isSignup}
        onClick={() => !isSignup || navigate("/login", { state: location.state })}
        className={`relative z-10 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-colors duration-300 ${
          !isSignup ? "text-white" : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Login
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={isSignup}
        onClick={() => isSignup || navigate("/signup", { state: location.state })}
        className={`relative z-10 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-colors duration-300 ${
          isSignup ? "text-white" : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}
