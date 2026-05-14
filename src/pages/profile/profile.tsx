import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header, Button, showNotification, NetworkBackground } from "@/components";
import { InputText } from "primereact/inputtext";
import { profileService } from "@/services/profileService/profileService";

export default function Profile() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    country: user?.country || "",
    state: user?.state || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
    area: user?.area || "",
  });

  const handleSave = async () => {
    if (!user) return;

    if (!formData.name.trim() || !formData.pincode.trim() || !formData.country.trim() || 
        !formData.state.trim() || !formData.city.trim() || !formData.area.trim()) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await profileService.updateProfile(user.id, formData);
      // Update user in context and localStorage
      localStorage.setItem("checknown-user", JSON.stringify(updatedUser));
      login("temp-token", updatedUser);
      setIsEditing(false);
      showNotification("Profile updated successfully", "success");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      name: user?.name || "",
      country: user?.country || "",
      state: user?.state || "",
      city: user?.city || "",
      pincode: user?.pincode || "",
      area: user?.area || "",
    });
    setIsEditing(false);
  };

  const handleDeactivateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await profileService.updateProfile(user.id, { isActive: false });
      localStorage.setItem("checknown-user", JSON.stringify(updatedUser));
      login("temp-token", updatedUser);
      showNotification("Account deactivated. You won't appear in search results.", "success");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to deactivate account.";
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await profileService.updateProfile(user.id, { isActive: true });
      localStorage.setItem("checknown-user", JSON.stringify(updatedUser));
      login("temp-token", updatedUser);
      showNotification("Account activated. You will appear in search results again.", "success");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to activate account.";
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };


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

      <div className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 sm:gap-10 relative z-10">
        {/* Page Header */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/60 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cyan-500/10 to-emerald-500/10 opacity-50"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                  <i className="pi pi-user text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-2 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                    My Profile
                  </h1>
                  <p className="text-text-secondary text-base">
                    Manage your account information
                  </p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  label="Edit Profile"
                  icon="pi pi-pencil"
                  onClick={() => setIsEditing(true)}
                  variant="gradient"
                  Size="medium"
                />
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        {user && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan-500/5 to-cyan-500/5 opacity-50"></div>
              <div className="relative p-6 sm:p-8 lg:p-10">
              {isEditing ? (
                <div className="flex flex-col gap-8">
                  {/* User Avatar Section */}
                  <div className="flex items-center gap-4 p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {(user.name || "U")[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-text-primary m-0 mb-1">
                        {user.name || "User"}
                      </p>
                      <p className="text-sm text-text-secondary m-0">
                        {user.mobileNumber}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <i className="pi pi-user text-primary"></i>
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <InputText
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-5 py-3 text-base bg-bg-secondary/50 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <i className="pi pi-phone text-primary"></i>
                        Mobile Number
                      </label>
                      <InputText
                        value={user.mobileNumber}
                        disabled
                        className="w-full px-5 py-3 text-base bg-bg-secondary/30 backdrop-blur-sm border-2 border-white/10 rounded-2xl opacity-70"
                      />
                      <p className="text-xs text-text-secondary m-0">
                        Mobile number cannot be changed
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <i className="pi pi-globe text-primary"></i>
                        Country <span className="text-red-500">*</span>
                      </label>
                      <InputText
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Enter country"
                        className="w-full px-5 py-3 text-base bg-bg-secondary/50 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <i className="pi pi-map text-primary"></i>
                        State <span className="text-red-500">*</span>
                      </label>
                      <InputText
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="Enter state"
                        className="w-full px-5 py-3 text-base bg-bg-secondary/50 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <i className="pi pi-building text-primary"></i>
                        City <span className="text-red-500">*</span>
                      </label>
                      <InputText
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Enter city"
                        className="w-full px-5 py-3 text-base bg-bg-secondary/50 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <i className="pi pi-inbox text-primary"></i>
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <InputText
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="Enter pincode"
                        className="w-full px-5 py-3 text-base bg-bg-secondary/50 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-primary transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-col gap-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <i className="pi pi-map-marker text-primary"></i>
                        Area/Locality <span className="text-red-500">*</span>
                      </label>
                      <InputText
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="Enter area/locality"
                        className="w-full px-5 py-3 text-base bg-bg-secondary/50 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end pt-6">
                    <Button
                      label="Cancel"
                      icon="pi pi-times"
                      onClick={handleCancel}
                      variant="outlined"
                      disabled={loading}
                      Size="large"
                    />
                    <Button
                      label={loading ? "Saving..." : "Save Changes"}
                      icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                      onClick={handleSave}
                      variant="gradient"
                      disabled={loading}
                      Size="large"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Profile Avatar */}
                  <div className="flex items-center gap-5 p-6 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-3xl">
                      {(user.name || "U")[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-text-primary mb-1">
                      {user.name || "User"}
                    </h2>
                    <p className="text-sm text-text-secondary">
                      {user.mobileNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                        <i className="pi pi-user text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">Full Name</p>
                    </div>
                    <p className="text-base font-bold text-text-primary m-0">
                      {user.name || "—"}
                    </p>
                  </div>

                  <div className="p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                        <i className="pi pi-phone text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">Mobile Number</p>
                    </div>
                    <p className="text-base font-bold text-text-primary m-0">
                      {user.mobileNumber || "—"}
                    </p>
                  </div>

                  <div className="p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                        <i className="pi pi-globe text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">Country</p>
                    </div>
                    <p className="text-base font-bold text-text-primary m-0">
                      {user.country || "—"}
                    </p>
                  </div>

                  <div className="p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                        <i className="pi pi-map text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">State</p>
                    </div>
                    <p className="text-base font-bold text-text-primary m-0">
                      {user.state || "—"}
                    </p>
                  </div>

                  <div className="p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                        <i className="pi pi-building text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">City</p>
                    </div>
                    <p className="text-base font-bold text-text-primary m-0">
                      {user.city || "—"}
                    </p>
                  </div>

                  <div className="p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                        <i className="pi pi-inbox text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">Pincode</p>
                    </div>
                    <p className="text-base font-bold text-text-primary m-0">
                      {user.pincode || "—"}
                    </p>
                  </div>

                  <div className="sm:col-span-2 p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                        <i className="pi pi-map-marker text-white text-sm"></i>
                      </div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">Area/Locality</p>
                    </div>
                    <p className="text-base font-bold text-text-primary m-0">
                      {user.area || "—"}
                    </p>
                  </div>
                </div>
                </>
              )}
              </div>
            </div>
          </div>
        )}

        {/* Account visibility (deactivate / activate) */}
        {user && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan-500/5 to-cyan-500/5 opacity-50"></div>
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                    <i className="pi pi-eye text-white text-xl"></i>
                  </div>
                  <h2 className="text-2xl font-black text-text-primary bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                    Account visibility
                  </h2>
                </div>
                <p className="text-text-secondary text-sm mb-4">
                  {user.isActive !== false
                    ? "Your account is visible in search. Others can find you by name or number."
                    : "Your account is hidden from search. No one can find you until you activate again."}
                </p>
                {user.isActive !== false ? (
                  <Button
                    label="Deactivate account"
                    icon="pi pi-eye-slash"
                    onClick={handleDeactivateProfile}
                    disabled={loading}
                    variant="outlined"
                    Size="medium"
                    className="!border-red-500 !text-red-500 hover:!bg-red-500/10 hover:!border-red-600 hover:!text-red-600"
                  />
                ) : (
                  <Button
                    label="Activate account"
                    icon="pi pi-eye"
                    onClick={handleActivateProfile}
                    disabled={loading}
                    variant="gradient"
                    Size="medium"
                  />
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
