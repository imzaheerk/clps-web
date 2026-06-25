import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout, PageHeader, showNotification, LoadingState } from "@/components";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useAuth } from "@/contexts/AuthContext";
import { businessService } from "@/services/businessService/businessService";
import type { BusinessCategory, CreateBusinessInput } from "@/services/businessService/businessService";

const inputClass = "auth-resend-input w-full";

const CATEGORY_OPTIONS: { label: string; value: BusinessCategory }[] = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Shop", value: "shop" },
  { label: "Driver", value: "driver" },
  { label: "Plumber", value: "plumber" },
];

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  shop: "Shop",
  driver: "Driver",
  plumber: "Plumber",
};

const BUSINESS_HOURS_OPTIONS: { label: string; value: string }[] = [
  { label: "24/7", value: "24/7" },
  { label: "Mon-Sat", value: "Mon-Sat" },
  { label: "9 AM - 6 PM", value: "9 AM - 6 PM" },
  { label: "Mon-Fri 9 AM - 6 PM", value: "Mon-Fri 9 AM - 6 PM" },
  { label: "Sat 9 AM - 2 PM", value: "Sat 9 AM - 2 PM" },
];

const composeTips = [
  "Choose the category that best matches what you offer.",
  "Add a clear description so people know your services at a glance.",
  "Use Get location to auto-fill address and map coordinates.",
  "Business hours help customers know when you're available.",
];

export default function BusinessForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<BusinessCategory | null>(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [businessHoursPreset, setBusinessHoursPreset] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const b = await businessService.getBusinessById(Number(id));
          if (b.userId !== user?.id) {
            showNotification("You can only edit your own business", "error");
            navigate("/business");
            return;
          }
          setName(b.name);
          setCategory(b.category as BusinessCategory);
          setDescription(b.description);
          setAddress(b.address || "");
          setLatitude(b.latitude != null ? String(b.latitude) : "");
          setLongitude(b.longitude != null ? String(b.longitude) : "");
          if (b.businessHours) {
            const disp =
              (b.businessHours as { display?: string }).display ||
              (b.businessHours as { general?: string }).general ||
              Object.entries(b.businessHours)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ");
            setBusinessHoursPreset(disp || "");
          }
          setWebsite(b.website || "");
          setFacebook(b.socialLinks?.facebook || "");
          setInstagram(b.socialLinks?.instagram || "");
        } catch (e: any) {
          showNotification(e.response?.data?.error || "Failed to load business", "error");
          navigate("/business");
        } finally {
          setLoadingData(false);
        }
      })();
    }
  }, [id, isEdit, user?.id, navigate]);

  const buildPayload = (): CreateBusinessInput => {
    const payload: CreateBusinessInput = {
      name: name.trim(),
      category: category!,
      description: description.trim() || "",
    };
    if (address.trim()) payload.address = address.trim();
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!Number.isNaN(lat)) payload.latitude = lat;
    if (!Number.isNaN(lng)) payload.longitude = lng;
    if (businessHoursPreset.trim()) {
      payload.businessHours = { display: businessHoursPreset.trim() };
    }
    if (website.trim()) payload.website = website.trim();
    const links: Record<string, string> = {};
    if (facebook.trim()) links.facebook = facebook.trim();
    if (instagram.trim()) links.instagram = instagram.trim();
    if (Object.keys(links).length) payload.socialLinks = links;
    return payload;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showNotification("Geolocation is not supported by your browser", "error");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { Accept: "application/json", "User-Agent": "CLSP-Business-App" } }
          );
          const data = await res.json();
          if (data?.display_name) setAddress(data.display_name);
        } catch {
          showNotification("Could not fetch address for location", "warn");
        } finally {
          setGettingLocation(false);
        }
      },
      () => {
        showNotification("Could not get your location. Check permissions.", "error");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) {
      showNotification("Please fill business name and category", "error");
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      const payload = buildPayload();
      if (isEdit && id) {
        await businessService.updateBusiness(Number(id), payload);
        showNotification("Business updated", "success");
      } else {
        await businessService.createBusiness(payload);
        showNotification("Business created", "success");
      }
      navigate("/business");
    } catch (e: any) {
      showNotification(
        e.response?.data?.error || e.response?.data?.message || "Failed to save business",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const previewCategory = category ? CATEGORY_LABELS[category] || category : null;

  if (loadingData) {
    return (
      <PageLayout maxWidth="lg">
        <LoadingState message="Loading business…" />
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="lg">
      <button
        type="button"
        className="resend-btn resend-btn-secondary self-start"
        onClick={() => navigate("/business")}
      >
        <i className="pi pi-arrow-left" />
        Back to businesses
      </button>

      <PageHeader
        icon={isEdit ? "pi pi-pencil" : "pi pi-briefcase"}
        title={isEdit ? "Edit business" : "Add business"}
        description={
          isEdit
            ? "Update your listing so customers see accurate details."
            : "Create a listing with category, location, hours, and links."
        }
      />

      <div className="app-compose-layout">
        <form onSubmit={handleSubmit} className="app-panel app-compose-form">
          <div className="app-panel-head">
            <h2 className="app-panel-title">
              <i className="pi pi-file-edit" />
              {isEdit ? "Listing details" : "Business details"}
            </h2>
            <p className="app-panel-copy">
              {isEdit
                ? "Changes are saved to your public listing immediately."
                : "Required fields are marked with an asterisk."}
            </p>
          </div>

          <fieldset className="app-compose-fieldset">
            <legend className="app-compose-fieldset-title">
              <i className="pi pi-building" />
              Basics
            </legend>
            <div className="app-form-stack">
              <div className="app-form-grid">
                <div className="sm:col-span-2">
                  <label className="app-form-label" htmlFor="biz-name">
                    Business name <span className="text-red-400">*</span>
                  </label>
                  <InputText
                    id="biz-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sunrise Café"
                    className={inputClass}
                    maxLength={200}
                  />
                  <p className="app-form-hint">{name.length}/200 characters</p>
                </div>
                <div>
                  <label className="app-form-label" htmlFor="biz-category">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <Dropdown
                    inputId="biz-category"
                    value={category}
                    options={CATEGORY_OPTIONS}
                    onChange={(e) => setCategory(e.value)}
                    placeholder="Select category"
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="app-form-label" htmlFor="biz-desc">
                  Description
                </label>
                <InputTextarea
                  id="biz-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What do you offer? Services, specialties, or anything customers should know…"
                  className={`${inputClass} min-h-[7rem] resize-y`}
                  rows={5}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="app-compose-fieldset">
            <legend className="app-compose-fieldset-title">
              <i className="pi pi-map-marker" />
              Location
            </legend>
            <div className="app-form-stack">
              <div>
                <label className="app-form-label" htmlFor="biz-address">
                  Address
                </label>
                <div className="app-input-with-action">
                  <InputText
                    id="biz-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, city, pincode"
                    className={inputClass}
                    maxLength={500}
                  />
                  <button
                    type="button"
                    className="resend-btn resend-btn-secondary app-input-action-btn"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                  >
                    {gettingLocation ? (
                      <>
                        <i className="pi pi-spin pi-spinner" />
                        Locating…
                      </>
                    ) : (
                      <>
                        <i className="pi pi-map-marker" />
                        Get location
                      </>
                    )}
                  </button>
                </div>
                {(latitude || longitude) && (
                  <p className="app-form-hint">
                    Coordinates: {latitude || "—"}, {longitude || "—"}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="app-compose-fieldset">
            <legend className="app-compose-fieldset-title">
              <i className="pi pi-globe" />
              Hours &amp; online
            </legend>
            <div className="app-form-stack">
              <div>
                <label className="app-form-label" htmlFor="biz-hours">
                  Business hours
                </label>
                <Dropdown
                  inputId="biz-hours"
                  value={businessHoursPreset}
                  options={BUSINESS_HOURS_OPTIONS}
                  onChange={(e) => setBusinessHoursPreset(e.value ?? "")}
                  placeholder="e.g. 24/7, Mon–Sat, 9 AM – 6 PM"
                  className="w-full"
                />
              </div>
              <div>
                <label className="app-form-label" htmlFor="biz-website">
                  Website
                </label>
                <InputText
                  id="biz-website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className={inputClass}
                  maxLength={500}
                />
              </div>
              <div className="app-form-grid">
                <div>
                  <label className="app-form-label" htmlFor="biz-facebook">
                    Facebook
                  </label>
                  <InputText
                    id="biz-facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/…"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="app-form-label" htmlFor="biz-instagram">
                    Instagram
                  </label>
                  <InputText
                    id="biz-instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/…"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {isEdit && (
            <div className="app-compose-notice">
              <i className="pi pi-shield" />
              <p>
                <strong>Verification:</strong> Aadhar and licence verification are set by admin after
                reviewing your documents. You cannot change them here.
              </p>
            </div>
          )}

          <div className="app-action-row border-t border-white/10 pt-5 mt-2">
            <button
              type="submit"
              className="resend-btn resend-btn-primary flex-1 sm:flex-none"
              disabled={loading || !name.trim() || !category}
            >
              {loading ? (
                <>
                  <i className="pi pi-spin pi-spinner" />
                  {isEdit ? "Saving…" : "Creating…"}
                </>
              ) : (
                <>
                  <i className={isEdit ? "pi pi-check" : "pi pi-plus"} />
                  {isEdit ? "Save changes" : "Create business"}
                </>
              )}
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-secondary flex-1 sm:flex-none"
              onClick={() => navigate("/business")}
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
                Listing tips
              </h2>
            </div>
            <ul className="app-tip-list-bullets">
              {composeTips.map((tip) => (
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
              <p className="app-panel-copy">How your listing may appear in search</p>
            </div>
            <article className="app-list-card app-compose-preview-card app-compose-preview-list-card">
              <div className="app-list-card-main">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="app-list-card-title">{name.trim() || "Your business name"}</h3>
                  {previewCategory ? (
                    <span className="resend-pill">{previewCategory}</span>
                  ) : (
                    <span className="resend-pill resend-pill--muted">Category</span>
                  )}
                </div>
                <p className="app-list-card-desc">
                  {description.trim() || "Your description will appear here as you type…"}
                </p>
                {address.trim() ? (
                  <p className="app-list-card-meta">
                    <i className="pi pi-map-marker" />
                    {address}
                  </p>
                ) : (
                  <p className="app-list-card-meta app-list-card-meta--muted">
                    <i className="pi pi-map-marker" />
                    Add an address to show on the map
                  </p>
                )}
                {businessHoursPreset ? (
                  <p className="app-list-card-meta">
                    <i className="pi pi-clock" />
                    {businessHoursPreset}
                  </p>
                ) : null}
              </div>
            </article>
          </section>

          {!isEdit && (
            <section className="app-panel app-panel--compact">
              <p className="app-panel-stat m-0">
                <i className="pi pi-check-circle text-[#ff6000]" />
                Listings appear in local business search once published.
              </p>
            </section>
          )}
        </aside>
      </div>
    </PageLayout>
  );
}
