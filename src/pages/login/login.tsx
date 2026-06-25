import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLogin } from "./hooks";
import { useNavigate } from "react-router-dom";
import { Button, showNotification } from "@/components";
import { preventDefaultHandler, preventDefault } from "@/utils/eventHandlers";

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { sendingOtp, verifyingOtp, sendOTP, verifyOTP, clearError } = useLogin();

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
      const token = userData.token;
      if (!token) {
        showNotification("Login failed: No token received", "error");
        return;
      }
      const { token: _, ...userWithoutToken } = userData;
      localStorage.setItem("callspot-user", JSON.stringify(userWithoutToken));
      login(token, userWithoutToken);
      navigate("/");
    }
  };

  return (
    <div className="auth-resend-form">
      <div className="auth-resend-form-head">
        <p className="auth-resend-form-kicker">Account access</p>
        <h2 className="auth-resend-form-title">Log in with your mobile</h2>
        <p className="auth-resend-form-lead">
          Enter your number and we&apos;ll send a one-time code to verify it&apos;s you.
        </p>
      </div>

      <form onSubmit={preventDefaultHandler(() => {})} className="auth-resend-fields">
        <div className="auth-resend-field">
          <label htmlFor="mobile" className="auth-resend-label">
            Mobile number
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
            placeholder="9876543210"
            maxLength={10}
            keyfilter="int"
            className="w-full auth-resend-input"
            autoFocus
          />
        </div>

        <div className="auth-resend-field">
          <label htmlFor="otp" className="auth-resend-label">
            One-time code
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
            className="w-full auth-resend-input auth-resend-input--otp"
            disabled={!otpSent}
          />
          {otpSent && (
            <p className="auth-resend-hint">
              <i className="pi pi-phone" />
              Code sent to <strong>{mobileNumber}</strong>
            </p>
          )}
        </div>

        <div className="auth-resend-actions-row">
          <Button
            label="Send code"
            icon="pi pi-send"
            onClick={handleSendOTP}
            loading={sendingOtp}
            disabled={!mobileNumber.match(/^[0-9]{10}$/) || verifyingOtp}
            variant="outlined"
            Size="large"
            className="flex-1 auth-resend-btn-outlined"
            type="button"
          />
          <Button
            label="Log in"
            icon="pi pi-sign-in"
            onClick={handleLogin}
            loading={verifyingOtp}
            disabled={!otp.match(/^[0-9]{6}$/) || !otpSent || sendingOtp}
            variant="primary"
            Size="large"
            className="flex-1 auth-resend-btn-primary"
            type="button"
          />
        </div>

        {otpSent && (
          <div className="auth-resend-inline-action">
            <button
              type="button"
              onClick={preventDefaultHandler(handleSendOTP)}
              disabled={sendingOtp || verifyingOtp}
              className="auth-resend-text-btn"
            >
              {sendingOtp ? "Sending..." : "Resend code"}
            </button>
          </div>
        )}
      </form>

      <p className="auth-resend-switch-copy">
        New here?{" "}
        <Link to="/signup" className="auth-resend-link">
          Create an account
        </Link>
      </p>
    </div>
  );
}
