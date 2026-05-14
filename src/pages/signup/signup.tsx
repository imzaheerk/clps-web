import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { useSignup } from "./hooks";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, showNotification, NetworkBackground, AuthInfoPanel, PrivacyPolicyModal } from "@/components";
import { preventDefaultHandler, preventDefault } from "@/utils/eventHandlers";

export default function Signup() {
  const location = useLocation();
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
  const { loading, sendOTP, createUser, clearError } = useSignup();


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
    if (!formData.name.trim() || !formData.pincode.trim() || !formData.country.trim() ||
        !formData.state.trim() || !formData.city.trim() || !formData.area.trim()) {
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
    });

    if (userData) {
      // Extract token from response (API returns token in userData.token)
      const token = userData.token;
      if (!token) {
        showNotification("Signup failed: No token received", "error");
        return;
      }
      // Remove token from userData before storing (token is stored separately)
      const { token: _, ...userWithoutToken } = userData;
      login(token, userWithoutToken);
      navigate("/");
    }
  };

  return (
    <div className="relative flex min-h-screen w-screen bg-bg-secondary">
      {/* Network Background - Global Internet Network Visualization */}
      <NetworkBackground />

      <div className="relative z-10 flex w-full">
        {/* Form Panel - Left Side */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex justify-center items-start py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[700px] flex flex-col gap-6 sm:gap-8 pb-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="self-start flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300 group mb-2"
          >
            <i className="pi pi-arrow-left text-sm group-hover:-translate-x-1 transition-transform duration-300"></i>
            <span className="text-sm font-medium">Back</span>
          </button>

        <form onSubmit={preventDefaultHandler(handleSignup)}>
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Personal Information Section */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <h3 className="text-xl font-bold text-text-primary border-b border-white/10 pb-2">
                Personal Information
              </h3>
              
              <div className="flex flex-col gap-2 sm:gap-3">
                <label
                  htmlFor="name"
                  className="font-semibold text-text-primary text-sm sm:text-base"
                >
                  Full Name <span className="text-danger">*</span>
                </label>
                <InputText
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="w-full input-standard"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                <label
                  htmlFor="mobile"
                  className="font-semibold text-text-primary text-sm sm:text-base"
                >
                  Mobile Number <span className="text-danger">*</span>
                </label>
                <InputText
                  id="mobile"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                  placeholder="Eg: 9876543210"
                  maxLength={10}
                  keyfilter="int"
                  className="w-full input-standard"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                <label
                  htmlFor="otp"
                  className="font-semibold text-text-primary text-sm sm:text-base"
                >
                  OTP <span className="text-danger">*</span>
                </label>
                <div className="flex gap-2 justify-between">
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
                    className="input-otp flex-1 max-w-[500px]"
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
                    label="Send OTP"
                    icon="pi pi-send"
                    onClick={handleSendOTP}
                    loading={loading}
                    disabled={!formData.mobileNumber.match(/^[0-9]{10}$/)}
                    variant="outlined"
                    Size="large"
                    type="button"
                  />
                </div>
                {otpSent && (
                  <p className="text-sm text-text-secondary text-center flex items-center justify-center gap-2">
                    <i className="pi pi-phone"></i>
                    <span>
                      OTP sent to: <strong>{formData.mobileNumber}</strong>
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Location Information Section */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <h3 className="text-xl font-bold text-text-primary border-b border-white/10 pb-2">
                Location Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label
                    htmlFor="country"
                    className="font-semibold text-text-primary text-sm sm:text-base"
                  >
                    Country <span className="text-danger">*</span>
                  </label>
                  <InputText
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder="India"
                    className="w-full input-standard"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <label
                    htmlFor="state"
                    className="font-semibold text-text-primary text-sm sm:text-base"
                  >
                    State <span className="text-danger">*</span>
                  </label>
                  <InputText
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="Maharashtra"
                    className="w-full input-standard"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label
                    htmlFor="city"
                    className="font-semibold text-text-primary text-sm sm:text-base"
                  >
                    City <span className="text-danger">*</span>
                  </label>
                  <InputText
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Mumbai"
                    className="w-full input-standard"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <label
                    htmlFor="pincode"
                    className="font-semibold text-text-primary text-sm sm:text-base"
                  >
                    Pincode <span className="text-danger">*</span>
                  </label>
                  <InputText
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    placeholder="400001"
                    maxLength={6}
                    keyfilter="int"
                    className="w-full input-standard"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                <label
                  htmlFor="area"
                  className="font-semibold text-text-primary text-sm sm:text-base"
                >
                  Area/Locality <span className="text-danger">*</span>
                </label>
                <InputText
                  id="area"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="Andheri West"
                  className="w-full input-standard"
                  required
                />
              </div>
            </div>

            {/* Privacy & Settings Section */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <h3 className="text-xl font-bold text-text-primary border-b border-white/10 pb-2">
                Privacy & Settings
              </h3>

              <div className="flex flex-col gap-2 sm:gap-3">
                <label className="font-semibold text-text-primary text-sm sm:text-base">
                  Number visibility
                </label>
                <p className="text-text-secondary text-sm">
                  Choose how your number appears to others in search and profile.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, numberVisibility: "fully_visible" })
                    }
                    className={`flex flex-col items-center text-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      formData.numberVisibility === "fully_visible"
                        ? "border-primary bg-primary/10"
                        : "border-white/10 bg-bg-secondary/40 hover:border-white/30"
                    }`}
                  >
                    <span
                      className={`flex items-center gap-2 font-semibold ${
                        formData.numberVisibility === "fully_visible"
                          ? "text-primary"
                          : "text-text-primary"
                      }`}
                    >
                      <i className="pi pi-eye text-base" />
                      <span>Fully visible</span>
                    </span>
                    <span className="text-xs text-text-secondary text-center">
                      Anyone can see your number
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, numberVisibility: "masked" })
                    }
                    className={`flex flex-col items-center text-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      formData.numberVisibility === "masked"
                        ? "border-primary bg-primary/10"
                        : "border-white/10 bg-bg-secondary/40 hover:border-white/30"
                    }`}
                  >
                    <span
                      className={`flex items-center gap-2 font-semibold ${
                        formData.numberVisibility === "masked"
                          ? "text-primary"
                          : "text-text-primary"
                      }`}
                    >
                      <i className="pi pi-eye-slash text-base" />
                      <span>Masked</span>
                    </span>
                    <span className="text-xs text-text-secondary text-center">
                      Show as 33xxxxxx; others can request to see
                    </span>
                  </button>
                </div>
              </div>

              {/* Privacy Policy Agreement */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 min-w-[20px] min-h-[20px] rounded border-2 border-white/30 bg-bg-secondary cursor-pointer accent-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-0"
                    aria-label="I agree to the Privacy Policy"
                  />
                  <label htmlFor="privacy" className="text-text-primary text-sm sm:text-base cursor-pointer flex-1 select-none">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPrivacyModal(true);
                      }}
                      className="text-primary font-semibold underline hover:no-underline focus:outline-none"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-4 pt-2">
              <Button
                label="Create Account"
                icon="pi pi-user-plus"
                onClick={handleSignup}
                loading={loading}
                disabled={!otpCode.match(/^[0-9]{6}$/) || !otpSent || !privacyAccepted}
                variant="gradient"
                Size="large"
                className="w-full"
                type="button"
              />
              
              {otpSent && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={preventDefaultHandler(handleSendOTP)}
                    disabled={loading}
                    className="text-primary bg-transparent border-none cursor-pointer font-medium text-sm underline opacity-70 disabled:opacity-50 hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

            <div className="mt-4 sm:mt-6 pt-6 sm:pt-8 border-t border-white/10 text-center">
              <p className="text-text-secondary text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary no-underline font-semibold hover:underline transition-all"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Info Panel - Right Side (desktop only, scroll inside panel if long) */}
        <AuthInfoPanel variant="signup" />
      </div>

      <PrivacyPolicyModal
        visible={showPrivacyModal}
        onHide={() => setShowPrivacyModal(false)}
      />
    </div>
  );
}
