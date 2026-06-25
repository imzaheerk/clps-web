import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSignup } from "./hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Button, showNotification, PrivacyPolicyModal } from "@/components";
import { preventDefaultHandler, preventDefault } from "@/utils/eventHandlers";

export default function Signup() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || "";
  const mobileNumber = location.state?.mobileNumber || "";
  const navigate = useNavigate();

  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: mobileNumber,
    pincode: "",
    country: "",
    state: "",
    city: "",
    area: "",
    numberVisibility: "masked" as "fully_visible" | "masked",
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const { login } = useAuth();
  const { sendingOtp, creatingAccount, sendOTP, createUser, clearError } = useSignup();

  const handleSendOTP = async () => {
    if (!formData.mobileNumber.match(/^[0-9]{10}$/)) {
      showNotification("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    clearError();
    const success = await sendOTP(formData.mobileNumber);
    if (success) {
      setOtpSent(true);
    }
  };

  const handleSignup = async () => {
    if (!otpCode.match(/^[0-9]{6}$/)) {
      showNotification("Please enter a valid 6-digit OTP", "error");
      return;
    }
    if (
      !formData.name.trim() ||
      !formData.pincode.trim() ||
      !formData.country.trim() ||
      !formData.state.trim() ||
      !formData.city.trim() ||
      !formData.area.trim()
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }
    if (!privacyAccepted) {
      showNotification("Please accept the Privacy Policy to continue", "error");
      return;
    }

    clearError();
    const userData = await createUser({
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      otpCode: otpCode,
      pincode: formData.pincode,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      area: formData.area,
      numberVisibility: formData.numberVisibility,
      ...(referralCode ? { referralCode } : {}),
    });

    if (userData) {
      const token = userData.token;
      if (!token) {
        showNotification("Signup failed: No token received", "error");
        return;
      }
      const { token: _, ...userWithoutToken } = userData;
      login(token, userWithoutToken);
      navigate("/");
    }
  };

  return (
    <>
      <div className="auth-resend-form auth-resend-form--signup">
        <div className="auth-resend-form-head auth-resend-form-head--compact">
          <h2 className="auth-resend-form-title">Create your account</h2>
          <p className="auth-resend-form-lead">
            Personal details, location, and privacy — takes about a minute.
          </p>
          {referralCode ? (
            <p className="auth-resend-invite-badge">
              <i className="pi pi-gift" />
              Invited by a neighbor — you&apos;ll earn bonus premium days when you join.
            </p>
          ) : null}
        </div>

        <form onSubmit={preventDefaultHandler(handleSignup)} className="auth-resend-fields">
          <section className="auth-resend-section-card">
            <h3 className="auth-resend-section-title">Personal</h3>

            <div className="auth-resend-field">
              <label htmlFor="name" className="auth-resend-label">
                Full name <span className="auth-resend-required">*</span>
              </label>
              <InputText
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className="w-full auth-resend-input"
                required
              />
            </div>

            <div className="auth-resend-field">
              <label htmlFor="mobile" className="auth-resend-label">
                Mobile number <span className="auth-resend-required">*</span>
              </label>
              <InputText
                id="mobile"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="9876543210"
                maxLength={10}
                keyfilter="int"
                className="w-full auth-resend-input"
                required
              />
            </div>

            <div className="auth-resend-field">
              <label htmlFor="otp" className="auth-resend-label">
                One-time code <span className="auth-resend-required">*</span>
              </label>
              <div className="auth-resend-otp-row">
                <InputText
                  id="otp"
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtpCode(value);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  keyfilter="int"
                  className="auth-resend-input auth-resend-input--otp flex-1"
                  required
                  disabled={!otpSent}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      preventDefault(e);
                      handleSignup();
                    }
                  }}
                />
                <Button
                  label="Send"
                  icon="pi pi-send"
                  onClick={handleSendOTP}
                  loading={sendingOtp}
                  disabled={!formData.mobileNumber.match(/^[0-9]{10}$/) || creatingAccount}
                  variant="outlined"
                  Size="large"
                  className="auth-resend-btn-outlined auth-resend-btn-send shrink-0"
                  type="button"
                />
              </div>
              {otpSent && (
                <p className="auth-resend-hint">
                  <i className="pi pi-phone" />
                  Code sent to <strong>{formData.mobileNumber}</strong>
                </p>
              )}
            </div>
          </section>

          <section className="auth-resend-section-card">
            <h3 className="auth-resend-section-title">Location</h3>

            <div className="auth-resend-grid">
              <div className="auth-resend-field">
                <label htmlFor="country" className="auth-resend-label">
                  Country <span className="auth-resend-required">*</span>
                </label>
                <InputText
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="India"
                  className="w-full auth-resend-input"
                  required
                />
              </div>
              <div className="auth-resend-field">
                <label htmlFor="state" className="auth-resend-label">
                  State <span className="auth-resend-required">*</span>
                </label>
                <InputText
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Maharashtra"
                  className="w-full auth-resend-input"
                  required
                />
              </div>
            </div>

            <div className="auth-resend-grid">
              <div className="auth-resend-field">
                <label htmlFor="city" className="auth-resend-label">
                  City <span className="auth-resend-required">*</span>
                </label>
                <InputText
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Mumbai"
                  className="w-full auth-resend-input"
                  required
                />
              </div>
              <div className="auth-resend-field">
                <label htmlFor="pincode" className="auth-resend-label">
                  Pincode <span className="auth-resend-required">*</span>
                </label>
                <InputText
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="400001"
                  maxLength={6}
                  keyfilter="int"
                  className="w-full auth-resend-input"
                  required
                />
              </div>
            </div>

            <div className="auth-resend-field">
              <label htmlFor="area" className="auth-resend-label">
                Area / locality <span className="auth-resend-required">*</span>
              </label>
              <InputText
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="Andheri West"
                className="w-full auth-resend-input"
                required
              />
            </div>
          </section>

          <section className="auth-resend-section-card">
            <h3 className="auth-resend-section-title">Privacy</h3>
            <p className="auth-resend-section-copy">
              Choose how your number appears to others in search and on your profile.
            </p>

            <div className="auth-resend-choice-grid">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, numberVisibility: "fully_visible" })}
                className={`auth-resend-choice ${
                  formData.numberVisibility === "fully_visible" ? "is-active" : ""
                }`}
              >
                <i className="pi pi-eye" />
                <span className="auth-resend-choice-title">Fully visible</span>
                <span className="auth-resend-choice-detail">Anyone can see your number</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, numberVisibility: "masked" })}
                className={`auth-resend-choice ${
                  formData.numberVisibility === "masked" ? "is-active" : ""
                }`}
              >
                <i className="pi pi-eye-slash" />
                <span className="auth-resend-choice-title">Masked</span>
                <span className="auth-resend-choice-detail">
                  Show as 33xxxxxx; others can request to see
                </span>
              </button>
            </div>

            <label className="auth-resend-checkbox" htmlFor="privacy">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPrivacyModal(true);
                  }}
                  className="auth-resend-link"
                >
                  Privacy Policy
                </button>
              </span>
            </label>
          </section>

          <div className="auth-resend-submit auth-resend-section-card auth-resend-section-card--submit">
            <Button
              label="Create account"
              icon="pi pi-user-plus"
              onClick={handleSignup}
              loading={creatingAccount}
              disabled={!otpCode.match(/^[0-9]{6}$/) || !otpSent || !privacyAccepted || sendingOtp}
              variant="primary"
              Size="large"
              className="w-full auth-resend-btn-primary"
              type="button"
            />

            {otpSent && (
              <div className="auth-resend-inline-action">
                <button
                  type="button"
                  onClick={preventDefaultHandler(handleSendOTP)}
                  disabled={sendingOtp || creatingAccount}
                  className="auth-resend-text-btn"
                >
                  {sendingOtp ? "Sending..." : "Resend code"}
                </button>
              </div>
            )}
          </div>
        </form>

        <p className="auth-resend-switch-copy">
          Already have an account?{" "}
          <Link to="/login" className="auth-resend-link">
            Log in
          </Link>
        </p>
      </div>

      <PrivacyPolicyModal
        visible={showPrivacyModal}
        onHide={() => setShowPrivacyModal(false)}
      />
    </>
  );
}
