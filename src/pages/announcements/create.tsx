import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header, Button, showNotification, NetworkBackground } from "@/components";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useAuth } from "@/contexts/AuthContext";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { announcementService } from "@/services/announcementService/announcementService";

export default function CreateAnnouncement() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createAnnouncement, updateAnnouncement, loading } = useAnnouncements();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode && id) {
      const loadAnnouncement = async () => {
        try {
          const data = await announcementService.getAnnouncementById(Number(id));
          setTitle(data.title);
          setDescription(data.description);
        } catch (error: any) {
          showNotification(
            error.response?.data?.error || "Failed to load announcement",
            "error"
          );
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
      });

      if (result) {
        navigate("/announcements");
      }
    } else {
      if (!user.pincode) {
        showNotification(
          "Pincode is required. Please update your profile.",
          "error"
        );
        return;
      }

      const result = await createAnnouncement(user.id, {
        title: title.trim(),
        description: description.trim(),
      });

      if (result) {
        navigate("/announcements");
      }
    }
  };

  if (loadingAnnouncement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
        {/* Network Background - Global Internet Network Visualization */}
        <NetworkBackground />
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <Header showAuthButtons={false} />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl p-12 border border-white/10 shadow-2xl text-center">
              <div className="inline-flex p-6 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-3xl mb-6">
                <i className="pi pi-spin pi-spinner text-6xl text-primary"></i>
              </div>
              <p className="text-xl font-bold text-text-primary">Loading announcement...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      {/* Network Background - Global Internet Network Visualization */}
      <NetworkBackground />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header showAuthButtons={false} />

      <div className="flex-1 max-w-[900px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 sm:gap-10 relative z-10">
        {/* Header Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/60 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-sky-500/10 to-cyan-500/10 opacity-50"></div>
            <div className="relative flex items-center gap-4">
              <button
                onClick={() => navigate("/announcements")}
                className="p-3 hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0"
                title="Back to Announcements"
              >
                <i className="pi pi-arrow-left text-text-primary text-xl"></i>
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                    <i className={`pi ${isEditMode ? 'pi-pencil' : 'pi-plus'} text-white text-xl`}></i>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                    {isEditMode ? "Edit Announcement" : "Create Announcement"}
                  </h1>
                </div>
                <p className="text-text-secondary text-base sm:text-lg ml-14">
                  {isEditMode
                    ? "Update your announcement details"
                    : "Share information with your local community"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-50"></div>
            <div className="relative flex flex-col gap-8">
              {/* Title Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-bold text-text-primary">
                  <div className="p-1.5 bg-gradient-to-br from-primary to-cyan-600 rounded-lg">
                    <i className="pi pi-tag text-white text-xs"></i>
                  </div>
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <InputText
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a clear and descriptive title..."
                    className="w-full input-standard px-5 py-4 text-base bg-bg-secondary/50 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-primary transition-all"
                    maxLength={200}
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <p className="text-xs text-text-secondary">
                    Make it clear and attention-grabbing
                  </p>
                  <p className="text-xs font-semibold text-text-secondary">
                    {title.length}/200
                  </p>
                </div>
              </div>

              {/* Description Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-bold text-text-primary">
                  <div className="p-1.5 bg-gradient-to-br from-primary to-cyan-600 rounded-lg">
                    <i className="pi pi-file-edit text-white text-xs"></i>
                  </div>
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <InputTextarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed information about your announcement. Include all relevant details that your community should know..."
                    className="w-full px-5 py-4 text-base bg-bg-secondary/50 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-primary transition-all resize-none"
                    rows={12}
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <p className="text-xs text-text-secondary">
                    Be specific and include all important details
                  </p>
                  <p className="text-xs font-semibold text-text-secondary">
                    {description.length} characters
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  label={
                    loading
                      ? isEditMode
                        ? "Updating..."
                        : "Creating..."
                      : isEditMode
                      ? "Update Announcement"
                      : "Create Announcement"
                  }
                  disabled={loading || !title.trim() || !description.trim()}
                  className="flex-1"
                  icon={loading ? "pi pi-spin pi-spinner" : isEditMode ? "pi pi-check" : "pi pi-plus"}
                  variant="gradient"
                  Size="large"
                />
                <Button
                  type="button"
                  label="Cancel"
                  onClick={() => navigate("/announcements")}
                  variant="outlined"
                  className="sm:w-auto"
                  Size="large"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
