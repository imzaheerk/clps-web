import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  showNotification,
  PageLayout,
  PageHeader,
  GlassCard,
  EmptyState,
} from "@/components";
import { InputText } from "primereact/inputtext";
import { searchService, SearchResult } from "@/services/searchService/searchService";
import { businessService } from "@/services/businessService/businessService";
import type { Business } from "@/services/businessService/businessService";

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  shop: "Shop",
  driver: "Driver",
  plumber: "Plumber",
};

export default function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [peopleResults, setPeopleResults] = useState<SearchResult[]>([]);
  const [businessResults, setBusinessResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  const isPhoneSearch = () => /^[0-9]{10}$/.test(searchQuery.trim());
  const isValidSearch = () => searchQuery.trim().length >= 2 || isPhoneSearch();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showNotification("Please enter a search query", "error");
      return;
    }
    if (!isValidSearch()) {
      showNotification(
        isPhoneSearch() ? "Please enter a valid 10-digit phone number" : "Please enter at least 2 characters",
        "error"
      );
      return;
    }

    const q = searchQuery.trim();
    setLoading(true);
    try {
      const [people, businessesRes] = await Promise.all([
        isPhoneSearch()
          ? searchService.searchByMobile(q, 50)
          : searchService.searchByName(q, 50),
        businessService.searchBusinesses(q, { limit: 50 }),
      ]);
      setPeopleResults(people);
      setBusinessResults(businessesRes.businesses);
      if (people.length === 0 && businessesRes.businesses.length === 0) {
        showNotification("No results found", "info");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to search. Please try again.";
      showNotification(errorMessage, "error");
      setPeopleResults([]);
      setBusinessResults([]);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = peopleResults.length > 0 || businessResults.length > 0;

  return (
    <PageLayout maxWidth="lg" showAuthButtons={false}>
      <PageHeader
        icon="pi pi-search"
        title="Search"
        description="Find people by name or number, and businesses (e.g. kirana shop, plumber, hotel)"
        variant="centered"
      />

      <GlassCard hover padding="lg" variant="default">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-50"></div>
        <div className="relative flex flex-col gap-6">
          <div className="flex gap-4 items-stretch">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-cyan-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <InputText
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people or businesses... e.g. name, kirana shop, plumber, hotel"
                className="w-full input-standard px-6 py-4 text-lg bg-bg-secondary/50 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-primary transition-all h-full"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && isValidSearch()) handleSearch();
                }}
                disabled={loading}
              />
            </div>
            <Button
              label={loading ? "Searching..." : "Search"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-search"}
              onClick={handleSearch}
              disabled={!searchQuery.trim() || loading}
              variant="gradient"
              Size="medium"
            />
          </div>
        </div>
      </GlassCard>

      {hasResults && (
        <div className="mt-8 space-y-8">
          {peopleResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-text-primary bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  People
                </h2>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
                  {peopleResults.length} result{peopleResults.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {peopleResults.map((result, index) => (
                  <div
                    key={`user-${result.id}`}
                    className="group relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div
                      className={`relative backdrop-blur-xl rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1 bg-bg-primary/70 ${
                        result.isPremium ? "border-amber-500" : "border-white/10"
                      }`}
                      onClick={() => navigate(`/profile/${result.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-xl shadow-lg">
                          <i className="pi pi-user text-white text-xl"></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-text-primary mb-2">
                            {result.name || "Unknown"}
                          </h3>
                          {result.area && result.city && result.state && (
                            <div className="flex items-center gap-2 text-text-secondary text-sm">
                              <i className="pi pi-map-marker text-primary"></i>
                              <span>{result.area}, {result.city}, {result.state}</span>
                            </div>
                          )}
                        </div>
                        <i className="pi pi-arrow-right text-2xl text-text-tertiary opacity-0 group-hover:opacity-100 transition-all"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {businessResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-text-primary bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  Businesses
                </h2>
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
                  {businessResults.length} result{businessResults.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businessResults.map((b) => (
                  <div
                    key={`business-${b.id}`}
                    className="group relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div
                      className="relative backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 bg-bg-primary/70"
                      onClick={() => navigate(`/businesses/${b.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-text-primary truncate flex-1">
                          {b.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-lg bg-primary/20 text-primary text-xs font-semibold flex-shrink-0">
                          {CATEGORY_LABELS[b.category] || b.category}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm line-clamp-2 mb-2">
                        {b.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {b.aadharVerified && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 text-xs">Aadhar ✓</span>
                        )}
                        {b.licenceVerified && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-600 text-xs">Licence ✓</span>
                        )}
                      </div>
                      {b.address && (
                        <p className="text-text-tertiary text-xs mt-2 flex items-center gap-1">
                          <i className="pi pi-map-marker"></i>
                          {b.address}
                        </p>
                      )}
                      <p className="text-primary text-sm font-semibold mt-2">View details →</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && searchQuery && isValidSearch() && !hasResults && (
        <EmptyState
          icon="pi pi-search"
          title="No results found"
          description="Try a different search (name, number, or business keyword like shop, plumber, hotel)"
          size="medium"
        />
      )}

      {!searchQuery && !loading && (
        <EmptyState
          icon="pi pi-search"
          title="Search people and businesses"
          description="Enter a name, phone number, or keyword (e.g. kirana shop, plumber, hotel, restaurant)"
          size="medium"
        />
      )}
    </PageLayout>
  );
}
