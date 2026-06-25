import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout, PageHeader, showNotification, DiscoveryRadiusControl } from "@/components";
import ResendModal from "@/components/ResendModal";
import { InputText } from "primereact/inputtext";
import { profileService } from "@/services/profileService/profileService";
import { useSubscription } from "@/hooks/useSubscription";
import {
  DEFAULT_DISCOVERY_RADIUS_KM,
  discoveryRadiusLabel,
  type DiscoveryRadiusKm,
} from "@/constants/discoveryRadius";

const inputClass = "auth-resend-input w-full";

const profileTips = [
  "Your pincode controls where you appear in local search.",
  "Discovery radius sets how far you can search and what shows in your feed.",
  "Use your real name so people can recognize you.",
  "Area and city help neighbours find you faster.",
];

const locationSummary = (parts: (string | undefined)[]) =>
  parts.filter(Boolean).join(", ") || "Not set";

export default function Profile() {
  const { user, login } = useAuth();
  const { subscription } = useSubscription(user?.id ?? null, !!user?.id);
  const isPremium =
    subscription?.status === "active" &&
    subscription?.plan &&
    !subscription.plan.isDefault &&
    subscription.plan.price > 0;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [radiusSaving, setRadiusSaving] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    country: user?.country || "",
    state: user?.state || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
    area: user?.area || "",
  });

  const handleSave = async () => {
    if (!user) return;

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

    setLoading(true);
    try {
      const updatedUser = await profileService.updateProfile(user.id, formData);
      localStorage.setItem("checknown-user", JSON.stringify(updatedUser));
      login("temp-token", updatedUser);
      setIsEditing(false);
      showNotification("Profile updated successfully", "success");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile. Please try again.";
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      country: user?.country || "",
      state: user?.state || "",
      city: user?.city || "",
      pincode: user?.pincode || "",
      area: user?.area || "",
    });
    setIsEditing(false);
  };

  const handleDeactivateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await profileService.updateProfile(user.id, { isActive: false });
      localStorage.setItem("checknown-user", JSON.stringify(updatedUser));
      login("temp-token", updatedUser);
      setShowDeactivateModal(false);
      showNotification("Account deactivated. You won't appear in search results.", "success");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to deactivate account.";
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await profileService.updateProfile(user.id, { isActive: true });
      localStorage.setItem("checknown-user", JSON.stringify(updatedUser));
      login("temp-token", updatedUser);
      showNotification("Account activated. You will appear in search results again.", "success");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to activate account.";
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = async (radiusKm: DiscoveryRadiusKm) => {
    if (!user || radiusKm === (user.discoveryRadiusKm ?? DEFAULT_DISCOVERY_RADIUS_KM)) return;
    setRadiusSaving(true);
    try {
      const updatedUser = await profileService.updateProfile(user.id, {
        discoveryRadiusKm: radiusKm,
      });
      localStorage.setItem("checknown-user", JSON.stringify(updatedUser));
      login("temp-token", updatedUser);
      showNotification(`Discovery radius set to ${discoveryRadiusLabel(radiusKm)}`, "success");
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Failed to update discovery radius.";
      showNotification(msg, "error");
    } finally {
      setRadiusSaving(false);
    }
  };

  const personalFields = [
    { label: "Full name", value: user?.name },
    { label: "Mobile number", value: user?.mobileNumber },
  ];

  const locationFields = [
    { label: "Country", value: user?.country },
    { label: "State", value: user?.state },
    { label: "City", value: user?.city },
    { label: "Pincode", value: user?.pincode },
    { label: "Area / locality", value: user?.area, span: true },
  ];

  const previewLocation = locationSummary([formData.area, formData.city, formData.state]);
  const viewLocation = locationSummary([user?.area, user?.city, user?.state]);

  if (!user) return null;

  if (isEditing) {
    return (
      <PageLayout maxWidth="lg">
        <button
          type="button"
          className="resend-btn resend-btn-secondary self-start"
          onClick={handleCancel}
          disabled={loading}
        >
          <i className="pi pi-arrow-left" />
          Back to profile
        </button>

        <PageHeader
          icon="pi pi-pencil"
          title="Edit profile"
          description="Update your name and location so people can find you locally."
        />

        <div className="app-compose-layout">
          <form
            className="app-panel app-compose-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="app-panel-head">
              <h2 className="app-panel-title">
                <i className="pi pi-id-card" />
                Profile details
              </h2>
              <p className="app-panel-copy">Mobile number is linked to your account and cannot be changed.</p>
            </div>

            <fieldset className="app-compose-fieldset">
              <legend className="app-compose-fieldset-title">
                <i className="pi pi-user" />
                Personal
              </legend>
              <div className="app-form-grid">
                <div>
                  <label className="app-form-label" htmlFor="profile-name">
                    Full name <span className="text-red-400">*</span>
                  </label>
                  <InputText
                    id="profile-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="app-form-label" htmlFor="profile-mobile">
                    Mobile number
                  </label>
                  <InputText
                    id="profile-mobile"
                    value={user.mobileNumber}
                    disabled
                    className={`${inputClass} opacity-70`}
                  />
                  <p className="app-form-hint">Cannot be changed</p>
                </div>
              </div>
            </fieldset>

            <fieldset className="app-compose-fieldset">
              <legend className="app-compose-fieldset-title">
                <i className="pi pi-map-marker" />
                Location
              </legend>
              <div className="app-form-stack">
                <div className="app-form-grid">
                  <div>
                    <label className="app-form-label" htmlFor="profile-country">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <InputText
                      id="profile-country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Enter country"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="app-form-label" htmlFor="profile-state">
                      State <span className="text-red-400">*</span>
                    </label>
                    <InputText
                      id="profile-state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Enter state"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="app-form-label" htmlFor="profile-city">
                      City <span className="text-red-400">*</span>
                    </label>
                    <InputText
                      id="profile-city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter city"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="app-form-label" htmlFor="profile-pincode">
                      Pincode <span className="text-red-400">*</span>
                    </label>
                    <InputText
                      id="profile-pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="Enter pincode"
                      className={inputClass}
                    />
                  </div>
                  <div className="span-2">
                    <label className="app-form-label" htmlFor="profile-area">
                      Area / locality <span className="text-red-400">*</span>
                    </label>
                    <InputText
                      id="profile-area"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="Enter area or locality"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <div className="app-action-row border-t border-white/10 pt-5 mt-2">
              <button
                type="submit"
                className="resend-btn resend-btn-primary flex-1 sm:flex-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="pi pi-spin pi-spinner" />
                    Saving…
                  </>
                ) : (
                  <>
                    <i className="pi pi-check" />
                    Save changes
                  </>
                )}
              </button>
              <button
                type="button"
                className="resend-btn resend-btn-secondary flex-1 sm:flex-none"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>

          <aside className="app-compose-aside">
            <section className="app-panel">
              <div className="app-panel-head">
                <h2 className="app-panel-title">
                  <i className="pi pi-lightbulb" />
                  Profile tips
                </h2>
              </div>
              <ul className="app-tip-list-bullets">
                {profileTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <section className="app-panel app-compose-preview">
              <div className="app-panel-head">
                <h2 className="app-panel-title">
                  <i className="pi pi-eye" />
                  Preview
                </h2>
                <p className="app-panel-copy">How you may appear in search results</p>
              </div>
              <article className="app-profile-preview-card app-compose-preview-card">
                <span className="app-profile-avatar app-profile-avatar--lg">
                  {(formData.name || "U")[0].toUpperCase()}
                </span>
                <div className="app-profile-preview-body">
                  <h3 className="app-profile-preview-name">
                    {formData.name.trim() || "Your name"}
                  </h3>
                  <p className="app-profile-preview-meta">{user.mobileNumber}</p>
                  <p className="app-profile-preview-location">
                    {previewLocation}
                    {formData.pincode ? ` · ${formData.pincode}` : ""}
                  </p>
                  <span
                    className={`resend-pill ${
                      user.isActive === false ? "resend-pill--danger" : "resend-pill--success"
                    }`}
                  >
                    {user.isActive === false ? "Hidden from search" : "Visible in search"}
                  </span>
                </div>
              </article>
            </section>

            {formData.pincode ? (
              <section className="app-panel app-panel--compact">
                <p className="app-panel-stat m-0">
                  <i className="pi pi-map-marker text-[#ff6000]" />
                  Local search pincode <strong>{formData.pincode}</strong>
                </p>
              </section>
            ) : null}
          </aside>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="lg">
      <PageHeader
        icon="pi pi-user"
        title="My profile"
        description="Your account details and visibility settings"
        action={
          <button
            type="button"
            className="resend-btn resend-btn-primary"
            onClick={() => setIsEditing(true)}
          >
            <i className="pi pi-pencil" />
            Edit profile
          </button>
        }
      />

      <div className="app-profile-page-layout">
        <div className="app-profile-main">
          <section className="app-panel app-profile-hero">
            <span className="app-profile-avatar app-profile-avatar--xl">
              {(user.name || "U")[0].toUpperCase()}
            </span>
            <div className="app-profile-hero-copy">
              <h2 className="app-profile-hero-name">{user.name || "User"}</h2>
              <p className="app-profile-hero-meta">{user.mobileNumber}</p>
              <p className="app-profile-hero-location">
                {viewLocation || "Location not set"}
                {user.pincode ? ` · ${user.pincode}` : ""}
              </p>
            </div>
            {user.isActive === false ? (
              <span className="resend-pill resend-pill--danger app-profile-hero-badge">
                Hidden from search
              </span>
            ) : (
              <span className="resend-pill resend-pill--success app-profile-hero-badge">
                Visible in search
              </span>
            )}
          </section>

          <section className="app-panel">
            <div className="app-panel-head">
              <h2 className="app-panel-title">
                <i className="pi pi-id-card" />
                Personal information
              </h2>
              <p className="app-panel-copy">Name and contact details on your account</p>
            </div>
            <div className="app-form-grid">
              {personalFields.map((field) => (
                <div key={field.label}>
                  <div className="app-profile-field">
                    <p className="app-profile-field-label">{field.label}</p>
                    <p className="app-profile-field-value">{field.value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="app-panel">
            <div className="app-panel-head">
              <h2 className="app-panel-title">
                <i className="pi pi-map-marker" />
                Location
              </h2>
              <p className="app-panel-copy">Where you appear in local search results</p>
            </div>
            <div className="app-form-grid">
              {locationFields.map((field) => (
                <div key={field.label} className={field.span ? "span-2" : undefined}>
                  <div className="app-profile-field">
                    <p className="app-profile-field-label">{field.label}</p>
                    <p className="app-profile-field-value">{field.value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="app-panel">
            <div className="app-panel-head">
              <h2 className="app-panel-title">
                <i className="pi pi-compass" />
                Discovery radius
              </h2>
              <p className="app-panel-copy">
                How far to search for people and businesses, and what appears in your local feed.
                Currently <strong>{discoveryRadiusLabel(user.discoveryRadiusKm ?? DEFAULT_DISCOVERY_RADIUS_KM)}</strong>.
              </p>
            </div>
            <DiscoveryRadiusControl
              value={user.discoveryRadiusKm ?? DEFAULT_DISCOVERY_RADIUS_KM}
              onChange={handleRadiusChange}
              isPremium={!!isPremium}
              disabled={radiusSaving}
              onPremiumBlocked={() =>
                showNotification("Premium required for radius beyond 2 km", "info")
              }
            />
          </section>

          <section className="app-panel app-panel--danger">
            <div className="app-panel-head">
              <h2 className="app-panel-title">
                <i className="pi pi-eye" />
                Account visibility
              </h2>
              <p className="app-panel-copy">
                {user.isActive !== false
                  ? "Your account is visible in search. Others can find you by name or number."
                  : "Your account is hidden from search. No one can find you until you activate again."}
              </p>
            </div>
            {user.isActive !== false ? (
              <button
                type="button"
                className="resend-btn resend-btn-danger-outline"
                onClick={() => setShowDeactivateModal(true)}
                disabled={loading}
              >
                <i className="pi pi-eye-slash" />
                Deactivate account
              </button>
            ) : (
              <button
                type="button"
                className="resend-btn resend-btn-primary"
                onClick={handleActivateProfile}
                disabled={loading}
              >
                <i className="pi pi-eye" />
                Activate account
              </button>
            )}
          </section>
        </div>

        <aside className="app-profile-aside">
          <section className="app-panel">
            <div className="app-panel-head">
              <h2 className="app-panel-title">
                <i className="pi pi-chart-bar" />
                Account summary
              </h2>
            </div>
            <ul className="app-profile-stat-list">
              <li className="app-profile-stat-item">
                <i className="pi pi-compass" />
                <span>
                  Searching within{" "}
                  {discoveryRadiusLabel(user.discoveryRadiusKm ?? DEFAULT_DISCOVERY_RADIUS_KM)}
                </span>
              </li>
              <li className="app-profile-stat-item">
                <i className="pi pi-map-marker" />
                <span>
                  {user.pincode
                    ? `Discoverable in pincode ${user.pincode}`
                    : "Add a pincode to appear in local search"}
                </span>
              </li>
              <li className="app-profile-stat-item">
                <i className="pi pi-eye" />
                <span>
                  {user.isActive !== false
                    ? "Your profile is visible to others"
                    : "Your profile is hidden from search"}
                </span>
              </li>
              <li className="app-profile-stat-item">
                <i className="pi pi-phone" />
                <span>Mobile number is verified and locked to this account</span>
              </li>
            </ul>
          </section>

          <section className="app-panel">
            <div className="app-panel-head">
              <h2 className="app-panel-title">
                <i className="pi pi-lightbulb" />
                Quick tips
              </h2>
            </div>
            <ul className="app-tip-list-bullets">
              {profileTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="app-panel app-panel--compact">
            <button
              type="button"
              className="resend-btn resend-btn-secondary w-full"
              onClick={() => setIsEditing(true)}
            >
              <i className="pi pi-pencil" />
              Edit profile
            </button>
          </section>
        </aside>
      </div>

      <ResendModal
        visible={showDeactivateModal}
        onHide={() => !loading && setShowDeactivateModal(false)}
        badge="Account"
        title="Deactivate account?"
        description={
          <>
            Hide <strong>{user.name || "your profile"}</strong> from search? Others won&apos;t be able to
            find you until you activate again.
          </>
        }
        icon="pi-eye-slash"
        tone="danger"
        footer={
          <div className="resend-modal-actions-row">
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={() => setShowDeactivateModal(false)}
              disabled={loading}
            >
              Keep active
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-danger"
              onClick={handleDeactivateProfile}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="pi pi-spin pi-spinner" />
                  Deactivating…
                </>
              ) : (
                "Deactivate account"
              )}
            </button>
          </div>
        }
      />
    </PageLayout>
  );
}
