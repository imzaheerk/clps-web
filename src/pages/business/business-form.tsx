import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header, Button, showNotification, NetworkBackground } from "@/components";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useAuth } from "@/contexts/AuthContext";
import { businessService } from "@/services/businessService/businessService";
import type { BusinessCategory, CreateBusinessInput } from "@/services/businessService/businessService";

const CATEGORY_OPTIONS: { label: string; value: BusinessCategory }[] = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Shop", value: "shop" },
  { label: "Driver", value: "driver" },
  { label: "Plumber", value: "plumber" },
];

const BUSINESS_HOURS_OPTIONS: { label: string; value: string }[] = [
  { label: "24/7", value: "24/7" },
  { label: "Mon-Sat", value: "Mon-Sat" },
  { label: "9 AM - 6 PM", value: "9 AM - 6 PM" },
  { label: "Mon-Fri 9 AM - 6 PM", value: "Mon-Fri 9 AM - 6 PM" },
  { label: "Sat 9 AM - 2 PM", value: "Sat 9 AM - 2 PM" },
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
            const disp = (b.businessHours as { display?: string }).display
              || (b.businessHours as { general?: string }).general
              || Object.entries(b.businessHours).map(([k, v]) => `${k}: ${v}`).join(", ");
            setBusinessHoursPreset(disp || "");
          }
          setWebsite(b.website || "");
          setFacebook(b.socialLinks?.facebook || "");
          setInstagram(b.socialLinks?.instagram || "");
        } catch (e: any) {
          showNotification(
            e.response?.data?.error || "Failed to load business",
            "error"
          );
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

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
        <NetworkBackground />
        <Header showAuthButtons={false} />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <i className="pi pi-spin pi-spinner text-5xl text-primary"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      <NetworkBackground />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Header showAuthButtons={false} />

      <div className="flex-1 max-w-[900px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 relative z-10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/60 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="relative flex items-center gap-4">
              <button
                onClick={() => navigate("/business")}
                className="p-3 hover:bg-primary/10 rounded-xl transition-all flex-shrink-0"
                title="Back"
              >
                <i className="pi pi-arrow-left text-text-primary text-xl"></i>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  {isEdit ? "Edit Business" : "Add Business"}
                </h1>
                <p className="text-text-secondary text-sm">
                  {isEdit
                    ? "Update your business details"
                    : "Service, category, location, hours and verification"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Business name <span className="text-red-500">*</span>
                </label>
                <InputText
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My Restaurant"
                  className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-xl"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  value={category}
                  options={CATEGORY_OPTIONS}
                  onChange={(e) => setCategory(e.value)}
                  placeholder="Select category"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Description (optional)
              </label>
              <InputTextarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your business and services..."
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-xl resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Address
              </label>
              <div className="flex gap-2">
                <InputText
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, city, pincode"
                  className="flex-1 px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-xl"
                  maxLength={500}
                />
                <Button
                  type="button"
                  label={gettingLocation ? "..." : "Get location"}
                  icon={gettingLocation ? "pi pi-spin pi-spinner" : "pi pi-map-marker"}
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  variant="outlined"
                  Size="medium"
                />
              </div>
              {(latitude || longitude) && (
                <p className="text-text-tertiary text-sm mt-2">
                  Lat: {latitude || "—"} · Long: {longitude || "—"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Business hours
              </label>
              <Dropdown
                value={businessHoursPreset}
                options={BUSINESS_HOURS_OPTIONS}
                onChange={(e) => setBusinessHoursPreset(e.value ?? "")}
                placeholder="e.g. 24/7, Mon-Sat, 9 AM - 6 PM"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                Website
              </label>
              <InputText
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-xl"
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Facebook URL
                </label>
                <InputText
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Instagram URL
                </label>
                <InputText
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-3 bg-bg-secondary/50 border border-white/10 rounded-xl"
                />
              </div>
            </div>

            {isEdit && (
              <div className="p-4 bg-bg-secondary/50 rounded-xl border border-white/10">
                <p className="text-sm text-text-secondary">
                  <strong className="text-text-primary">Verification:</strong> Aadhar and licence
                  verification are set by admin after checking your documents. You cannot change them here.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                type="submit"
                label={
                  loading
                    ? isEdit
                      ? "Updating..."
                      : "Creating..."
                    : isEdit
                    ? "Update Business"
                    : "Add Business"
                }
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                disabled={loading || !name.trim() || !category}
                variant="gradient"
                Size="medium"
              />
              <Button
                type="button"
                label="Cancel"
                onClick={() => navigate("/business")}
                variant="outlined"
                Size="medium"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
