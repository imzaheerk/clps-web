import { Link, Outlet, useLocation } from "react-router-dom";
import AuthInfoPanel from "./AuthInfoPanel";
import AuthModeSwitch from "./AuthModeSwitch";
import BrandMark from "./BrandMark";

export default function AuthLayout() {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  return (
    <div className="auth-resend min-h-screen bg-black text-[#f8fafc] relative overflow-hidden">
      <div className="landing-resend-bg pointer-events-none" aria-hidden="true">
        <div className="landing-resend-ray landing-resend-ray-left" />
        <div className="landing-resend-ray landing-resend-ray-right" />
        <div className="landing-resend-glow landing-resend-glow-top" />
      </div>

      <div className="auth-resend-shell relative z-10 flex min-h-screen w-full">
        <div
          className={`auth-resend-main w-full lg:w-[58%] xl:w-[60%] flex flex-col ${
            isSignup ? "overflow-y-auto" : "overflow-x-hidden"
          }`}
        >
          <div
            className={`flex flex-1 justify-center px-4 sm:px-6 lg:px-10 xl:px-12 ${
              isSignup
                ? "items-start py-6 sm:py-8 lg:py-10"
                : "items-center py-6 sm:py-8 lg:py-10 min-h-screen"
            }`}
          >
            <div
              className={`w-full flex flex-col ${
                isSignup ? "max-w-[44rem]" : "max-w-[34rem]"
              }`}
            >
              <Link to="/" className="auth-resend-back">
                <i className="pi pi-arrow-left text-xs" />
                Back to home
              </Link>

              <div className="auth-resend-brand lg:hidden">
                <BrandMark size="lg" to="/" />
                <p className="auth-resend-brand-tagline">Connecting people over the internet</p>
              </div>

              <AuthModeSwitch />

              <div
                key={location.pathname}
                className={
                  isSignup
                    ? "auth-resend-signup-shell auth-form-enter-from-left"
                    : "resend-auth-card auth-form-enter-from-left"
                }
              >
                <Outlet />
              </div>
            </div>
          </div>
        </div>

        <AuthInfoPanel
          key={isSignup ? "auth-info-signup" : "auth-info-login"}
          variant={isSignup ? "signup" : "login"}
          className={isSignup ? "auth-info-enter-from-right" : "auth-info-enter-from-right"}
        />
      </div>
    </div>
  );
}
