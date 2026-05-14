import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header, Button, showNotification, NetworkBackground } from "@/components";
import { businessService } from "@/services/businessService/businessService";
import type { Business } from "@/services/businessService/businessService";

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  shop: "Shop",
  driver: "Driver",
  plumber: "Plumber",
};

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const b = await businessService.getBusinessById(Number(id));
        setBusiness(b);
      } catch (e: any) {
        showNotification(
          e.response?.data?.error || "Business not found",
          "error"
        );
        navigate("/businesses");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading || !business) {
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

  const hoursStr =
    business.businessHours && (business.businessHours as { display?: string }).display
      ? (business.businessHours as { display: string }).display
      : business.businessHours && typeof (business.businessHours as { general?: string }).general === "string"
      ? (business.businessHours as { general: string }).general
      : business.businessHours
      ? Object.entries(business.businessHours)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      <NetworkBackground />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      <Header showAuthButtons={false} />

      <div className="flex-1 max-w-[800px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative z-10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <button
                type="button"
                onClick={() => navigate("/businesses")}
                className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6"
              >
                <i className="pi pi-arrow-left"></i>
                <span className="text-sm font-semibold">Back to businesses</span>
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
                  {business.name}
                </h1>
                <span className="px-3 py-1 rounded-xl bg-primary/20 text-primary text-sm font-semibold">
                  {CATEGORY_LABELS[business.category] || business.category}
                </span>
                {business.aadharVerified && (
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 text-xs font-semibold">
                    Aadhar verified
                  </span>
                )}
                {business.licenceVerified && (
                  <span className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-600 text-xs font-semibold">
                    Licence verified
                  </span>
                )}
              </div>

              <p className="text-text-secondary whitespace-pre-wrap mb-6">
                {business.description}
              </p>

              {(business.address || (business.latitude != null && business.longitude != null)) && (
                <div className="flex items-start gap-3 mb-4">
                  <i className="pi pi-map-marker text-primary mt-0.5"></i>
                  <div>
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                      Address
                    </p>
                    {business.address && (
                      <p className="text-text-primary">{business.address}</p>
                    )}
                    {business.latitude != null && business.longitude != null && (
                      <a
                        href={`https://www.google.com/maps?q=${business.latitude},${business.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline mt-1"
                      >
                        <i className="pi pi-map"></i>
                        <span>View on map</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {hoursStr && (
                <div className="flex items-start gap-3 mb-4">
                  <i className="pi pi-clock text-primary mt-0.5"></i>
                  <div>
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                      Business hours
                    </p>
                    <p className="text-text-primary">{hoursStr}</p>
                  </div>
                </div>
              )}

              {(business.website || (business.socialLinks && Object.keys(business.socialLinks).length > 0)) && (
                <div className="flex items-start gap-3 mb-4">
                  <i className="pi pi-link text-primary mt-0.5"></i>
                  <div className="flex flex-wrap gap-3">
                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-semibold hover:underline"
                      >
                        Website
                      </a>
                    )}
                    {business.socialLinks?.facebook && (
                      <a
                        href={business.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-semibold hover:underline"
                      >
                        Facebook
                      </a>
                    )}
                    {business.socialLinks?.instagram && (
                      <a
                        href={business.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-semibold hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}

              <p className="text-text-tertiary text-sm mt-4">
                Listed by {business.user?.name || "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
