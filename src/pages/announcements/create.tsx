import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout, PageHeader, showNotification, LoadingState } from "@/components";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useAuth } from "@/contexts/AuthContext";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { announcementService } from "@/services/announcementService/announcementService";
import {
  aiCampaignService,
  type CampaignObjective,
  type CampaignTone,
  type CampaignVariant,
} from "@/services/aiCampaignService/aiCampaignService";
import {
  ANNOUNCEMENT_CATEGORIES,
  type AnnouncementCategory,
} from "@/services/announcementService/announcementService";

const inputClass = "auth-resend-input w-full";

const composeTips = [
  "Use a clear title so people know what the post is about.",
  "Include dates, location, and contact details in the description.",
  "Keep it local — announcements are shown in your pincode area.",
];

export default function CreateAnnouncement() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createAnnouncement, updateAnnouncement, loading } = useAnnouncements();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("general");
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(isEditMode);
  const [aiSeason, setAiSeason] = useState("");
  const [aiOffer, setAiOffer] = useState("");
  const [aiObjective, setAiObjective] = useState<CampaignObjective>("awareness");
  const [aiTone, setAiTone] = useState<CampaignTone>("friendly");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiVariants, setAiVariants] = useState<CampaignVariant[]>([]);
  const [aiBestTime, setAiBestTime] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const loadAnnouncement = async () => {
        try {
          const data = await announcementService.getAnnouncementById(Number(id));
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category || "general");
        } catch (error: any) {
          showNotification(error.response?.data?.error || "Failed to load announcement", "error");
          navigate("/announcements");
        } finally {
          setLoadingAnnouncement(false);
        }
      };
      loadAnnouncement();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification("Please enter a title", "error");
      return;
    }
    if (!description.trim()) {
      showNotification("Please enter a description", "error");
      return;
    }
    if (!user) return;

    if (isEditMode && id) {
      const result = await updateAnnouncement(Number(id), user.id, {
        title: title.trim(),
        description: description.trim(),
        category,
      });
      if (result) navigate("/announcements");
    } else {
      if (!user.pincode) {
        showNotification("Pincode is required. Please update your profile.", "error");
        return;
      }
      const result = await createAnnouncement(user.id, {
        title: title.trim(),
        description: description.trim(),
        category,
      });
      if (result) navigate("/announcements");
    }
  };

  const handleGenerateWithAi = async () => {
    if (!aiSeason.trim()) {
      showNotification("Enter season or occasion (e.g. Diwali)", "error");
      return;
    }
    setAiLoading(true);
    try {
      const result = await aiCampaignService.generateAnnouncementCampaign({
        businessName: user?.name || undefined,
        locationLabel: user?.pincode ? `pincode ${user.pincode}` : undefined,
        season: aiSeason.trim(),
        offer: aiOffer.trim(),
        objective: aiObjective,
        tone: aiTone,
      });
      setAiVariants(result.variants);
      setAiBestTime(result.bestPostTime);
      setCategory(result.suggestedCategory);
      showNotification("AI generated 3 campaign variants", "success");
    } catch {
      showNotification("Failed to generate campaign text", "error");
    } finally {
      setAiLoading(false);
    }
  };

  if (loadingAnnouncement) {
    return (
      <PageLayout maxWidth="lg">
        <PageHeader icon="pi pi-megaphone" title="Announcement" description="Loading…" />
        <LoadingState message="Loading announcement…" />
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="lg">
      <button
        type="button"
        className="resend-btn resend-btn-secondary self-start"
        onClick={() => navigate("/announcements")}
      >
        <i className="pi pi-arrow-left" />
        Back to announcements
      </button>

      <PageHeader
        icon={isEditMode ? "pi pi-pencil" : "pi pi-megaphone"}
        title={isEditMode ? "Edit announcement" : "Create announcement"}
        description={
          isEditMode
            ? "Update your post and keep your community informed."
            : "Share news, offers, or updates with people in your area."
        }
      />

      <div className="app-compose-layout">
        <form onSubmit={handleSubmit} className="app-panel app-compose-form">
          <div className="app-panel-head">
            <h2 className="app-panel-title">
              <i className="pi pi-file-edit" />
              {isEditMode ? "Edit details" : "Post details"}
            </h2>
            <p className="app-panel-copy">
              {isEditMode
                ? "Changes are visible immediately in your local feed."
                : "Your announcement will appear for users in your pincode."}
            </p>
          </div>

          <div className="app-form-stack">
            <div>
              <label className="app-form-label">Generate with AI (seasonal)</label>
              <div className="app-ai-campaign-box">
                <div className="app-ai-campaign-head">
                  <span className="resend-pill resend-pill--premium">AI Assistant</span>
                  <p className="app-ai-campaign-copy">
                    Generate ready-to-post seasonal announcement variants in one click.
                  </p>
                </div>
                <div className="app-ai-campaign-grid">
                  <InputText
                    value={aiSeason}
                    onChange={(e) => setAiSeason(e.target.value)}
                    placeholder="Season/occasion (Diwali, New Year...)"
                    className={inputClass}
                  />
                  <InputText
                    value={aiOffer}
                    onChange={(e) => setAiOffer(e.target.value)}
                    placeholder="Offer details (20% off, combo, etc.)"
                    className={inputClass}
                  />
                </div>
                <div className="app-ai-campaign-row">
                  <select
                    className="auth-resend-input app-form-select"
                    value={aiObjective}
                    onChange={(e) => setAiObjective(e.target.value as CampaignObjective)}
                  >
                    <option value="awareness">Awareness</option>
                    <option value="footfall">Footfall</option>
                    <option value="orders">Orders</option>
                  </select>
                  <select
                    className="auth-resend-input app-form-select"
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value as CampaignTone)}
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <button
                    type="button"
                    className="resend-btn resend-btn-secondary"
                    onClick={handleGenerateWithAi}
                    disabled={aiLoading}
                  >
                    {aiLoading ? "Generating..." : "Generate with AI"}
                  </button>
                </div>
                {aiBestTime ? <p className="app-form-hint">Suggested best posting time: {aiBestTime}</p> : null}
                {aiVariants.length > 0 ? (
                  <div className="app-ai-campaign-variants">
                    {aiVariants.map((variant, idx) => (
                      <article key={`${variant.title}-${idx}`} className="app-ai-campaign-variant">
                        <div className="app-ai-campaign-variant-head">
                          <h4>{variant.title}</h4>
                          <span className="resend-pill resend-pill--muted">Variant {idx + 1}</span>
                        </div>
                        <p>{variant.description}</p>
                        <p className="app-ai-campaign-cta-line">
                          <strong>CTA:</strong> {variant.cta}
                        </p>
                        <button
                          type="button"
                          className="resend-btn resend-btn-secondary"
                          onClick={() => {
                            setTitle(variant.title);
                            setDescription(`${variant.description}\n\nCTA: ${variant.cta}`);
                          }}
                        >
                          Use this variant
                        </button>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="app-form-label">Category</label>
              <div className="app-announcement-category-picker">
                {ANNOUNCEMENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`app-announcement-filter-chip app-announcement-filter-chip--${cat.value} ${category === cat.value ? "is-active" : ""}`}
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="app-form-label" htmlFor="ann-title">
                Title <span className="text-red-400">*</span>
              </label>
              <InputText
                id="ann-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Community meetup this Saturday"
                className={inputClass}
                maxLength={200}
              />
              <p className="app-form-hint">{title.length}/200 characters</p>
            </div>

            <div>
              <label className="app-form-label" htmlFor="ann-desc">
                Description <span className="text-red-400">*</span>
              </label>
              <InputTextarea
                id="ann-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What should people know? Include time, place, and how to reach you…"
                className={`${inputClass} min-h-[14rem] resize-y`}
                rows={12}
              />
              <p className="app-form-hint">{description.length} characters</p>
            </div>
          </div>

          <div className="app-action-row border-t border-white/10 pt-5 mt-2">
            <button
              type="submit"
              className="resend-btn resend-btn-primary flex-1 sm:flex-none"
              disabled={loading || !title.trim() || !description.trim()}
            >
              {loading ? (
                <>
                  <i className="pi pi-spin pi-spinner" />
                  {isEditMode ? "Saving…" : "Publishing…"}
                </>
              ) : (
                <>
                  <i className={isEditMode ? "pi pi-check" : "pi pi-send"} />
                  {isEditMode ? "Save changes" : "Publish announcement"}
                </>
              )}
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-secondary flex-1 sm:flex-none"
              onClick={() => navigate("/announcements")}
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
                Writing tips
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
              <p className="app-panel-copy">How your post may appear in the feed</p>
            </div>
            <article className="app-announcement-card app-compose-preview-card">
              <div className="app-announcement-card-body">
                <span className={`app-announcement-category app-announcement-category--${category}`}>
                  {ANNOUNCEMENT_CATEGORIES.find((c) => c.value === category)?.label}
                </span>
                <h3 className="app-announcement-card-title">
                  {title.trim() || "Your announcement title"}
                </h3>
                <p className="app-announcement-card-desc">
                  {description.trim() || "Your description will appear here as you type…"}
                </p>
                <div className="app-announcement-card-author">
                  <span className="app-profile-avatar app-profile-avatar--sm">
                    {(user?.name || "U")[0].toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="app-announcement-card-author-name">{user?.name || "You"}</p>
                    <p className="app-announcement-card-author-date">Just now · Local feed</p>
                  </div>
                </div>
              </div>
            </article>
          </section>

          {!isEditMode && user?.pincode ? (
            <section className="app-panel app-panel--compact">
              <p className="app-panel-stat m-0">
                <i className="pi pi-map-marker text-[#ff6000]" />
                Visible in pincode <strong>{user.pincode}</strong>
              </p>
            </section>
          ) : null}
        </aside>
      </div>
    </PageLayout>
  );
}
