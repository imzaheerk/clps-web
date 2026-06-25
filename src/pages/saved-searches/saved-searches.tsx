import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageLayout,
  PageHeader,
  LoadingState,
  EmptyState,
} from "@/components";
import ResendModal from "@/components/ResendModal";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import type { SavedSearch } from "@/services/savedSearchService/savedSearchService";

function formatCheckedAt(iso: string | null) {
  if (!iso) return "Never checked";
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "Checked just now";
  if (minutes < 60) return `Checked ${minutes}m ago`;
  if (hours < 24) return `Checked ${hours}h ago`;
  if (days < 7) return `Checked ${days}d ago`;
  return `Checked ${date.toLocaleDateString()}`;
}

export default function SavedSearchesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    savedSearches,
    total,
    loading,
    actionLoading,
    load,
    updateSearch,
    deleteSearch,
    checkSearch,
  } = useSavedSearches(user?.id ?? null);

  const [toDelete, setToDelete] = useState<SavedSearch | null>(null);

  useEffect(() => {
    if (user?.id) load();
  }, [user?.id, load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    const ok = await deleteSearch(toDelete.id);
    if (ok) setToDelete(null);
  };

  const runSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <PageLayout maxWidth="lg">
      <PageHeader
        icon="pi pi-bookmark"
        title="Saved searches"
        description="Get notified when new people or businesses match your saved queries"
        action={
          <button
            type="button"
            className="resend-btn resend-btn-primary"
            onClick={() => navigate("/search")}
          >
            <i className="pi pi-search" />
            New search
          </button>
        }
      />

      {loading ? (
        <LoadingState message="Loading saved searches…" />
      ) : savedSearches.length === 0 ? (
        <EmptyState
          icon="pi-bookmark"
          title="No saved searches yet"
          description='Run a search and tap "Save search" to get alerts when new matches appear.'
          action={{ label: "Go to search", icon: "pi pi-search", onClick: () => navigate("/search") }}
        />
      ) : (
        <>
          <p className="app-saved-search-count">
            {total} saved search{total === 1 ? "" : "es"}
          </p>
          <div className="app-saved-search-list">
            {savedSearches.map((item) => (
              <article key={item.id} className="app-saved-search-card">
                <div className="app-saved-search-card-main">
                  <button
                    type="button"
                    className="app-saved-search-card-title-btn"
                    onClick={() => runSearch(item.query)}
                  >
                    <h3 className="app-saved-search-card-title">
                      {item.label || item.query}
                    </h3>
                    {item.label && item.label !== item.query ? (
                      <span className="app-saved-search-card-query">{item.query}</span>
                    ) : null}
                  </button>
                  <p className="app-saved-search-card-meta">
                    <span>
                      <i className="pi pi-users" />
                      {item.lastPeopleCount} people
                    </span>
                    <span>
                      <i className="pi pi-briefcase" />
                      {item.lastBusinessCount} businesses
                    </span>
                    <span>{formatCheckedAt(item.lastCheckedAt)}</span>
                  </p>
                </div>

                <div className="app-saved-search-card-actions">
                  <label className="app-saved-search-toggle">
                    <input
                      type="checkbox"
                      checked={item.alertsEnabled}
                      disabled={actionLoading === item.id}
                      onChange={(e) =>
                        updateSearch(item.id, { alertsEnabled: e.target.checked })
                      }
                    />
                    <span>Alerts</span>
                  </label>
                  <button
                    type="button"
                    className="resend-btn resend-btn-secondary"
                    disabled={actionLoading === item.id}
                    onClick={() => checkSearch(item.id)}
                  >
                    {actionLoading === item.id ? (
                      <i className="pi pi-spin pi-spinner" />
                    ) : (
                      <i className="pi pi-refresh" />
                    )}
                    Check now
                  </button>
                  <button
                    type="button"
                    className="resend-btn resend-btn-secondary"
                    onClick={() => runSearch(item.query)}
                  >
                    <i className="pi pi-search" />
                    Run
                  </button>
                  <button
                    type="button"
                    className="resend-btn resend-btn-secondary"
                    disabled={actionLoading === item.id}
                    onClick={() => setToDelete(item)}
                  >
                    <i className="pi pi-trash" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <ResendModal
        visible={!!toDelete}
        onHide={() => !actionLoading && setToDelete(null)}
        badge="Saved search"
        title="Remove saved search?"
        description={
          toDelete ? (
            <>
              Stop tracking <strong>{toDelete.label || toDelete.query}</strong> and delete alerts
              for this query.
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
              onClick={() => setToDelete(null)}
              disabled={!!actionLoading}
            >
              Keep
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-primary"
              onClick={confirmDelete}
              disabled={!!actionLoading}
            >
              {actionLoading ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-trash" />}
              Remove
            </button>
          </div>
        }
      />
    </PageLayout>
  );
}
