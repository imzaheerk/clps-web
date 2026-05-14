import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Button, showNotification, NetworkBackground } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { businessService } from "@/services/businessService/businessService";
import type { Business } from "@/services/businessService/businessService";

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  shop: "Shop",
  driver: "Driver",
  plumber: "Plumber",
};

export default function BusinessList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadMyBusinesses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await businessService.getMyBusinesses({ limit: 50 });
      setBusinesses(res.businesses);
      setTotal(res.total);
    } catch (e: any) {
      showNotification(
        e.response?.data?.error || "Failed to load businesses",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBusinesses();
  }, [user?.id]);

  const handleDelete = async (b: Business) => {
    if (!window.confirm(`Delete "${b.name}"? This cannot be undone.`)) return;
    setDeletingId(b.id);
    try {
      await businessService.deleteBusiness(b.id);
      showNotification("Business deleted", "success");
      await loadMyBusinesses();
    } catch (e: any) {
      showNotification(
        e.response?.data?.error || "Failed to delete business",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

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

      <div className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 relative z-10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/60 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                  <i className="pi pi-briefcase text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-text-primary bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                    My Businesses
                  </h1>
                  <p className="text-text-secondary text-base">
                    Add and manage your businesses
                  </p>
                </div>
              </div>
              <Button
                label="Add Business"
                icon="pi pi-plus"
                onClick={() => navigate("/business/create")}
                variant="gradient"
                Size="medium"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <i className="pi pi-spin pi-spinner text-5xl text-primary"></i>
          </div>
        ) : businesses.length === 0 ? (
          <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 p-12 text-center">
            <div className="inline-flex p-6 bg-primary/10 rounded-full mb-4">
              <i className="pi pi-briefcase text-4xl text-primary"></i>
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              No businesses yet
            </h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Create your first business to show your service, category, location and hours to others.
            </p>
            <Button
              label="Add Business"
              icon="pi pi-plus"
              onClick={() => navigate("/business/create")}
              variant="gradient"
              Size="medium"
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {businesses.map((b) => (
              <div
                key={b.id}
                className="relative backdrop-blur-xl bg-bg-primary/70 rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-text-primary">{b.name}</h3>
                    <span className="px-2 py-0.5 rounded-lg bg-primary/20 text-primary text-xs font-semibold">
                      {CATEGORY_LABELS[b.category] || b.category}
                    </span>
                    {b.aadharVerified && (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-600 text-xs">
                        Aadhar verified
                      </span>
                    )}
                    {b.licenceVerified && (
                      <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-600 text-xs">
                        Licence verified
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                    {b.description}
                  </p>
                  {b.address && (
                    <p className="text-text-tertiary text-xs mt-1 flex items-center gap-1">
                      <i className="pi pi-map-marker"></i>
                      {b.address}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    label="Edit"
                    icon="pi pi-pencil"
                    onClick={() => navigate(`/business/${b.id}/edit`)}
                    variant="outlined"
                    Size="small"
                  />
                  <Button
                    label={deletingId === b.id ? "Deleting..." : "Delete"}
                    icon={deletingId === b.id ? "pi pi-spin pi-spinner" : "pi pi-trash"}
                    onClick={() => handleDelete(b)}
                    disabled={deletingId !== null}
                    variant="outlined"
                    Size="small"
                    className="!border-red-500 !text-red-500 hover:!bg-red-500/10"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
