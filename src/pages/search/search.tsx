import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  showNotification,
  PageLayout,
  PageHeader,
  EmptyState,
  LoadingState,
  DiscoveryRadiusControl,
} from "@/components";
import { InputText } from "primereact/inputtext";
import { searchService, SearchResult } from "@/services/searchService/searchService";
import { businessService } from "@/services/businessService/businessService";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { useSubscription } from "@/hooks/useSubscription";
import {
  DEFAULT_DISCOVERY_RADIUS_KM,
  discoveryRadiusLabel,
  type DiscoveryRadiusKm,
} from "@/constants/discoveryRadius";
import type { Business } from "@/services/businessService/businessService";
import { businessAnalyticsService } from "@/services/businessAnalyticsService/businessAnalyticsService";

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  shop: "Shop",
  driver: "Driver",
  plumber: "Plumber",
};

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { subscription } = useSubscription(user?.id ?? null, !!user?.id);
  const isPremium =
    subscription?.status === "active" &&
    subscription?.plan &&
    !subscription.plan.isDefault &&
    subscription.plan.price > 0;

  const [discoveryRadius, setDiscoveryRadius] = useState<DiscoveryRadiusKm>(
    DEFAULT_DISCOVERY_RADIUS_KM
  );
  const { saving, saveSearch, isQuerySaved, load: loadSavedSearches } = useSavedSearches(
    user?.id ?? null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [peopleResults, setPeopleResults] = useState<SearchResult[]>([]);
  const [businessResults, setBusinessResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const isPhoneSearch = () => /^[0-9]{10}$/.test(searchQuery.trim());
  const isValidSearch = () => searchQuery.trim().length >= 2 || isPhoneSearch();

  useEffect(() => {
    if (user?.discoveryRadiusKm !== undefined) {
      setDiscoveryRadius(user.discoveryRadiusKm as DiscoveryRadiusKm);
    }
  }, [user?.discoveryRadiusKm]);

  const handleSearch = useCallback(async (queryOverride?: string) => {
    const q = (queryOverride ?? searchQuery).trim();
    if (!q) {
      showNotification("Please enter a search query", "error");
      return;
    }
    if (!(q.length >= 2 || /^[0-9]{10}$/.test(q))) {
      showNotification(
        /^[0-9]+$/.test(q) ? "Please enter a valid 10-digit phone number" : "Please enter at least 2 characters",
        "error"
      );
      return;
    }

    setSearchQuery(q);
    setLoading(true);
    setHasSearched(true);
    try {
      const isPhone = /^[0-9]{10}$/.test(q);
      const radiusParam = user ? discoveryRadius : undefined;
      const [people, businessesRes] = await Promise.all([
        isPhone
          ? searchService.searchByMobile(q, 50, radiusParam)
          : searchService.searchByName(q, 50, radiusParam),
        businessService.searchBusinesses(q, { limit: 50, discoveryRadiusKm: radiusParam }),
      ]);
      setPeopleResults(people);
      setBusinessResults(businessesRes.businesses);
      if (people.length === 0 && businessesRes.businesses.length === 0) {
        showNotification("No results found", "info");
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || "Failed to search. Please try again.", "error");
      setPeopleResults([]);
      setBusinessResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, user, discoveryRadius]);

  useEffect(() => {
    if (user?.id) loadSavedSearches(true);
  }, [user?.id, loadSavedSearches]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.trim().length >= 2) {
      setSearchQuery(q);
      handleSearch(q);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps -- run once when ?q= changes

  useEffect(() => {
    if (!hasSearched || businessResults.length === 0) return;
    businessResults.forEach((b) => {
      businessAnalyticsService.recordEvent(b.id, "impression");
    });
  }, [hasSearched, businessResults]);

  const handleSaveSearch = async () => {
    if (!user?.id) {
      showNotification("Sign in to save searches", "error");
      return;
    }
    const q = searchQuery.trim();
    if (!isValidSearch()) return;
    if (isQuerySaved(q)) {
      showNotification("This search is already saved", "info");
      return;
    }
    await saveSearch({
      query: q,
      peopleCount: peopleResults.length,
      businessCount: businessResults.length,
    });
  };

  const hasResults = peopleResults.length > 0 || businessResults.length > 0;
  const querySaved = isQuerySaved(searchQuery);

  return (
    <PageLayout maxWidth="lg">
      <PageHeader
        icon="pi pi-search"
        title="Search"
        description="Find people by name or number, and local businesses"
        action={
          user ? (
            <Link to="/saved-searches" className="resend-btn resend-btn-secondary app-search-saved-link">
              <i className="pi pi-bookmark" />
              Saved searches
            </Link>
          ) : undefined
        }
      />

      {user ? (
        <section className="app-panel app-discovery-radius-panel">
          <div className="app-panel-head">
            <h2 className="app-panel-title app-panel-title--sm">
              <i className="pi pi-compass" />
              Search radius
            </h2>
            <p className="app-panel-copy m-0">
              Showing results within{" "}
              <strong>{discoveryRadiusLabel(discoveryRadius)}</strong>
            </p>
          </div>
          <DiscoveryRadiusControl
            value={discoveryRadius}
            onChange={setDiscoveryRadius}
            isPremium={!!isPremium}
            compact
            onPremiumBlocked={() =>
              showNotification("Premium required for radius beyond 2 km", "info")
            }
          />
        </section>
      ) : null}

      <section className="app-panel app-search-bar">
        <div className="app-search-bar-inner">
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Name, phone, shop, plumber, hotel…"
            className="auth-resend-input app-search-input"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValidSearch()) handleSearch();
            }}
            disabled={loading}
          />
          <button
            type="button"
            className="resend-btn resend-btn-primary app-search-submit"
            onClick={() => handleSearch()}
            disabled={!searchQuery.trim() || loading}
          >
            {loading ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-search" />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
        <div className="app-search-bar-footer">
          <p className="app-search-hint m-0">
            Try a name, 10-digit mobile number, or business keyword
          </p>
          {hasSearched && isValidSearch() && user ? (
            <button
              type="button"
              className={`resend-btn resend-btn-secondary app-search-save-btn ${querySaved ? "is-saved" : ""}`}
              onClick={handleSaveSearch}
              disabled={saving || querySaved}
            >
              {saving ? (
                <i className="pi pi-spin pi-spinner" />
              ) : (
                <i className={`pi ${querySaved ? "pi-check" : "pi-bookmark"}`} />
              )}
              {querySaved ? "Saved" : "Save search"}
            </button>
          ) : null}
        </div>
      </section>

      {loading ? <LoadingState message="Searching…" /> : null}

      {!loading && hasResults ? (
        <div className="app-results-stack">
          {peopleResults.length > 0 ? (
            <section>
              <div className="app-section-head">
                <h2 className="app-section-title">People</h2>
                <span className="resend-pill">{peopleResults.length}</span>
              </div>
              <div className="app-result-grid">
                {peopleResults.map((result) => (
                  <button
                    key={`user-${result.id}`}
                    type="button"
                    className={`app-result-card ${result.isPremium ? "app-result-card--premium" : ""}`}
                    onClick={() => navigate(`/profile/${result.id}`)}
                  >
                    <span className="header-app-avatar">
                      {(result.name || "U")[0].toUpperCase()}
                    </span>
                    <span className="app-result-card-body">
                      <span className="app-result-card-title">{result.name || "Unknown"}</span>
                      {result.area && result.city && result.state ? (
                        <span className="app-result-card-meta">
                          <i className="pi pi-map-marker" />
                          {result.area}, {result.city}
                        </span>
                      ) : null}
                    </span>
                    <i className="pi pi-arrow-right app-result-card-arrow" />
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {businessResults.length > 0 ? (
            <section>
              <div className="app-section-head">
                <h2 className="app-section-title">Businesses</h2>
                <span className="resend-pill">{businessResults.length}</span>
              </div>
              <div className="app-result-grid">
                {businessResults.map((b) => (
                  <button
                    key={`business-${b.id}`}
                    type="button"
                    className="app-result-card"
                    onClick={() => navigate(`/businesses/${b.id}`)}
                  >
                    <span className="app-action-icon">
                      <i className="pi pi-briefcase" />
                    </span>
                    <span className="app-result-card-body">
                      <span className="app-result-card-title-row">
                        <span className="app-result-card-title">{b.name}</span>
                        <span className="resend-pill resend-pill--compact">
                          {CATEGORY_LABELS[b.category] || b.category}
                        </span>
                      </span>
                      <span className="app-result-card-desc">{b.description}</span>
                      {b.address ? (
                        <span className="app-result-card-meta">
                          <i className="pi pi-map-marker" />
                          {b.address}
                        </span>
                      ) : null}
                    </span>
                    <i className="pi pi-arrow-right app-result-card-arrow" />
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      {!loading && hasSearched && !hasResults ? (
        <EmptyState
          icon="pi pi-search"
          title="No results found"
          description="Try a different name, number, or business keyword — you can still save this search to get alerts later"
          action={
            user && isValidSearch() && !querySaved
              ? { label: "Save this search", icon: "pi pi-bookmark", onClick: handleSaveSearch }
              : undefined
          }
        />
      ) : null}

      {!loading && !hasSearched ? (
        <EmptyState
          icon="pi pi-compass"
          title="Discover your network"
          description="Search for people nearby or local businesses like shops, plumbers, and restaurants"
        />
      ) : null}
    </PageLayout>
  );
}
