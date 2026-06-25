import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, PageHeader, Button, showNotification, LoadingState, EmptyState } from "@/components";
import ResendModal from "@/components/ResendModal";
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
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null);

  const loadMyBusinesses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await businessService.getMyBusinesses({ limit: 50 });
      setBusinesses(res.businesses);
    } catch (e: any) {
      showNotification(e.response?.data?.error || "Failed to load businesses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBusinesses();
  }, [user?.id]);

  const confirmDelete = async () => {
    if (!businessToDelete) return;
    setDeletingId(businessToDelete.id);
    try {
      await businessService.deleteBusiness(businessToDelete.id);
      showNotification("Business deleted", "success");
      setBusinessToDelete(null);
      await loadMyBusinesses();
    } catch (e: any) {
      showNotification(e.response?.data?.error || "Failed to delete business", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageLayout maxWidth="md">
      <PageHeader
        icon="pi pi-briefcase"
        title="My businesses"
        description="Add and manage your business listings"
        action={
          <button
            type="button"
            className="resend-btn resend-btn-primary"
            onClick={() => navigate("/business/create")}
          >
            <i className="pi pi-plus" />
            Add business
          </button>
        }
      />

      {loading ? (
        <LoadingState message="Loading businesses…" />
      ) : businesses.length === 0 ? (
        <EmptyState
          icon="pi pi-briefcase"
          title="No businesses yet"
          description="Create your first listing with category, location, and hours."
          action={{ label: "Add business", onClick: () => navigate("/business/create"), icon: "pi pi-plus" }}
        />
      ) : (
        <div className="app-tip-list">
          {businesses.map((b) => (
            <div key={b.id} className="app-list-card">
              <div className="app-list-card-main">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="app-list-card-title">{b.name}</h3>
                  <span className="resend-pill">{CATEGORY_LABELS[b.category] || b.category}</span>
                  {b.aadharVerified ? <span className="resend-pill resend-pill--success">Aadhar</span> : null}
                  {b.licenceVerified ? <span className="resend-pill resend-pill--success">Licence</span> : null}
                </div>
                <p className="app-list-card-desc">{b.description}</p>
                {b.address ? (
                  <p className="app-list-card-meta">
                    <i className="pi pi-map-marker" />
                    {b.address}
                  </p>
                ) : null}
              </div>
              <div className="app-list-card-actions">
                <Button
                  label="View"
                  icon="pi pi-eye"
                  onClick={() => navigate(`/businesses/${b.id}`)}
                  variant="outlined"
                  Size="small"
                />
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  onClick={() => navigate(`/business/${b.id}/edit`)}
                  variant="outlined"
                  Size="small"
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  onClick={() => setBusinessToDelete(b)}
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

      <ResendModal
        visible={!!businessToDelete}
        onHide={() => !deletingId && setBusinessToDelete(null)}
        badge="Business"
        title="Delete business?"
        description={
          businessToDelete ? (
            <>
              Permanently remove <strong>{businessToDelete.name}</strong>? This listing will no longer
              appear in search and cannot be recovered.
            </>
          ) : undefined
        }
        icon="pi-trash"
        tone="danger"
        footer={
          <div className="resend-modal-actions-row">
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={() => setBusinessToDelete(null)}
              disabled={deletingId !== null}
            >
              Keep business
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-danger"
              onClick={confirmDelete}
              disabled={deletingId !== null}
            >
              {deletingId !== null ? (
                <>
                  <i className="pi pi-spin pi-spinner" />
                  Deleting…
                </>
              ) : (
                "Delete business"
              )}
            </button>
          </div>
        }
      />
    </PageLayout>
  );
}
