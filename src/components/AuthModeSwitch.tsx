import { useLocation, useNavigate } from "react-router-dom";

export default function AuthModeSwitch() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";

  return (
    <div className="auth-resend-switch" role="tablist" aria-label="Authentication mode">
      <button
        type="button"
        role="tab"
        aria-selected={!isSignup}
        onClick={() => !isSignup || navigate("/login", { state: location.state })}
        className={`auth-resend-switch-btn ${!isSignup ? "is-active" : ""}`}
      >
        Log in
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={isSignup}
        onClick={() => isSignup || navigate("/signup", { state: location.state })}
        className={`auth-resend-switch-btn ${isSignup ? "is-active" : ""}`}
      >
        Sign up
      </button>
    </div>
  );
}
