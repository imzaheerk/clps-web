import { Outlet, useLocation } from "react-router-dom";
import { NetworkBackground, AuthInfoPanel } from "@/components";
import AuthModeSwitch from "./AuthModeSwitch";

export default function AuthLayout() {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  return (
    <div className="relative flex min-h-screen w-full bg-bg-secondary overflow-hidden">
      <NetworkBackground />

      <div className="relative z-10 flex w-full min-h-screen">
        <div
          className={`auth-form-panel w-full lg:w-1/2 xl:w-3/5 flex flex-col ${
            isSignup ? "overflow-y-auto" : "overflow-x-hidden"
          }`}
        >
          <div
            className={`flex flex-1 justify-center px-4 sm:px-6 lg:px-8 ${
              isSignup
                ? "items-start py-6 sm:py-10 lg:py-12"
                : "items-center py-4 sm:py-6 lg:py-8 min-h-screen lg:min-h-screen"
            }`}
          >
            <div className="w-full max-w-[700px] flex flex-col">
              <AuthModeSwitch />
              <div
                key={location.pathname}
                className={
                  isSignup ? "auth-form-enter-from-right" : "auth-form-enter-from-left"
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
          className={isSignup ? "auth-info-enter-from-right" : "auth-info-enter-from-left"}
        />
      </div>
    </div>
  );
}
