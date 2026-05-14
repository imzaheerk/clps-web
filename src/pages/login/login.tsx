import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { useAuth } from "@/contexts/AuthContext";
import { useLogin } from "./hooks";
import { useNavigate, Link } from "react-router-dom";
import { Button, showNotification, NetworkBackground, AuthInfoPanel } from "@/components";
import { preventDefaultHandler, preventDefault } from "@/utils/eventHandlers";

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { loading, sendOTP, verifyOTP, clearError } = useLogin();

  const handleSendOTP = async () => {
    if (!mobileNumber.match(/^[0-9]{10}$/)) {
      showNotification("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    clearError();
    const success = await sendOTP(mobileNumber);
    if (success) {
      setOtpSent(true);
    }
  };

  const handleLogin = async () => {
    if (!otp.match(/^[0-9]{6}$/)) {
      showNotification("Please enter a valid 6-digit OTP", "error");
      return;
    }

    clearError();
    const userData = await verifyOTP(mobileNumber, otp);
    if (userData) {
      // Extract token from response (API returns token in userData.token)
      const token = userData.token;
      if (!token) {
        showNotification("Login failed: No token received", "error");
        return;
      }
      // Remove token from userData before storing (token is stored separately)
      const { token: _, ...userWithoutToken } = userData;
      localStorage.setItem("callspot-user", JSON.stringify(userWithoutToken));
      login(token, userWithoutToken);
      navigate("/");
    }
  };

  return (
    <div className="relative flex h-screen w-full bg-bg-secondary overflow-hidden">
      {/* Network Background - Global Internet Network Visualization */}
      <NetworkBackground />

      <div className="relative z-10 flex w-full h-full">
        {/* Form Panel - Left Side */}
        <div className="flex w-full lg:w-1/2 xl:w-3/5 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[460px] flex flex-col gap-4 sm:gap-5">
            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="self-start flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors duration-300 group mb-1.5"
            >
              <i className="pi pi-arrow-left text-xs group-hover:-translate-x-1 transition-transform duration-300"></i>
              <span className="text-xs font-medium">Back</span>
            </button>

            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-1.5 text-text-primary">
                Login
              </h2>
              <p className="text-text-secondary text-sm sm:text-base">
                Enter your mobile number and OTP to continue
              </p>
            </div>

            <form
              onSubmit={preventDefaultHandler(() => {})}
              className="flex flex-col gap-3.5 sm:gap-4"
            >
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label
              htmlFor="mobile"
              className="font-semibold text-text-primary text-sm sm:text-base"
            >
              Mobile Number
            </label>
            <InputText
              id="mobile"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  preventDefault(e);
                  handleSendOTP();
                }
              }}
              placeholder="Eg: 9876543210"
              maxLength={10}
              keyfilter="int"
              className="w-full input-standard"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2 mt-1">
            <label
              htmlFor="otp"
              className="font-semibold text-text-primary text-sm sm:text-base"
            >
              OTP
            </label>
            <InputText
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  preventDefault(e);
                  handleLogin();
                }
              }}
              placeholder="000000"
              maxLength={6}
              keyfilter="int"
              className="w-full input-otp"
              disabled={!otpSent}
            />
            {otpSent && (
              <p className="text-sm text-text-secondary text-center flex items-center justify-center gap-2">
                <i className="pi pi-phone"></i>
                <span>
                  OTP sent to: <strong>{mobileNumber}</strong>
                </span>
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-1">
            <Button
              label="Send OTP"
              icon="pi pi-send"
              onClick={handleSendOTP}
              loading={loading}
              disabled={!mobileNumber.match(/^[0-9]{10}$/)}
              variant="outlined"
              Size="large"
              className="flex-1"
              type="button"
            />
            <Button
              label="Login"
              icon="pi pi-sign-in"
              onClick={handleLogin}
              loading={loading}
              disabled={!otp.match(/^[0-9]{6}$/) || !otpSent}
              variant="gradient"
              Size="large"
              className="flex-1"
              type="button"
            />
          </div>

          {otpSent && (
            <div className="text-center">
              <button
                type="button"
                onClick={preventDefaultHandler(handleSendOTP)}
                disabled={loading}
                className="text-primary bg-transparent border-none cursor-pointer font-medium text-xs sm:text-sm underline opacity-70 disabled:opacity-50 hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          )}
            </form>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 text-center">
              <p className="text-text-secondary text-xs sm:text-sm">
                New to Checknown?{" "}
                <Link
                  to="/signup"
                  className="text-primary no-underline font-semibold hover:underline transition-all"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Info Panel - Right Side (desktop only) */}
        <AuthInfoPanel variant="login" />
      </div>
    </div>
  );
}
