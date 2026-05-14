import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header, Button, showNotification, PlanCard, NetworkBackground } from "@/components";
import { usePlans } from "@/hooks/usePlans";
import { useSubscription } from "@/hooks/useSubscription";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import type { Plan, CreatePlanInput, UpdatePlanInput } from "@/services/planService/planService";
import "primeicons/primeicons.css";

export default function Plans() {
  const { user } = useAuth();
  const { plans, loading, createPlan, updatePlan, deletePlan } = usePlans(true);
  const {
    subscription,
    createSubscription,
    loading: subscribing,
  } = useSubscription(user?.id || null, true);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Create Plan Dialog State
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreatePlanInput>({
    name: "",
    duration: 30,
    price: 0,
    features: [],
    isPopular: false,
  });
  const [newFeature, setNewFeature] = useState("");

  // Edit Plan Dialog State
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editFormData, setEditFormData] = useState<UpdatePlanInput>({});
  const [editNewFeature, setEditNewFeature] = useState("");

  const handleSubscribe = async (plan: Plan) => {
    if (!user?.id) {
      showNotification("Please login first", "error");
      return;
    }

    if (subscription?.planId === plan.id) {
      showNotification("You are already subscribed to this plan", "info");
      return;
    }

    setSelectedPlan(plan);
    setShowConfirmDialog(true);
  };

  const confirmSubscribe = async () => {
    if (!selectedPlan) return;

    const success = await createSubscription(selectedPlan.id);
    if (success) {
      showNotification("Subscription created successfully!", "success");
      setShowConfirmDialog(false);
      setSelectedPlan(null);
    } else {
      showNotification("Failed to create subscription", "error");
    }
  };

  // Create Plan Handlers
  const handleCreatePlan = async () => {
    if (!createFormData.name.trim()) {
      showNotification("Plan name is required", "error");
      return;
    }
    if (createFormData.price < 0) {
      showNotification("Price cannot be negative", "error");
      return;
    }
    if (createFormData.duration < 0) {
      showNotification("Duration cannot be negative", "error");
      return;
    }

    const result = await createPlan(createFormData);
    if (result) {
      showNotification("Plan created successfully!", "success");
      setShowCreateDialog(false);
      setCreateFormData({
        name: "",
        duration: 30,
        price: 0,
        features: [],
        isPopular: false,
      });
      setNewFeature("");
    } else {
      showNotification("Failed to create plan", "error");
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setCreateFormData({
        ...createFormData,
        features: [...createFormData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setCreateFormData({
      ...createFormData,
      features: createFormData.features.filter((_, i) => i !== index),
    });
  };

  // Edit Plan Handlers
  const handleEditPlan = (plan: Plan) => {
    if (plan.isDefault) {
      showNotification("Cannot edit the default Free plan", "error");
      return;
    }
    setEditingPlan(plan);
    setEditFormData({
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
      features: [...plan.features],
      isPopular: plan.isPopular,
    });
    setEditNewFeature("");
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;

    const result = await updatePlan(editingPlan.id, editFormData);
    if (result) {
      showNotification("Plan updated successfully!", "success");
      setEditingPlan(null);
      setEditFormData({});
    } else {
      showNotification("Failed to update plan", "error");
    }
  };

  const handleDeletePlan = async (plan: Plan) => {
    if (plan.isDefault) {
      showNotification("Cannot delete the default Free plan", "error");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${plan.name}" plan?`)) {
      return;
    }

    const success = await deletePlan(plan.id);
    if (success) {
      showNotification("Plan deleted successfully!", "success");
    } else {
      showNotification("Failed to delete plan", "error");
    }
  };

  const addEditFeature = () => {
    if (editNewFeature.trim()) {
      setEditFormData({
        ...editFormData,
        features: [...(editFormData.features || []), editNewFeature.trim()],
      });
      setEditNewFeature("");
    }
  };

  const removeEditFeature = (index: number) => {
    setEditFormData({
      ...editFormData,
      features: editFormData.features?.filter((_, i) => i !== index) || [],
    });
  };

  if (loading && plans.length === 0) {
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
              <p className="text-xl font-bold text-text-primary">Loading plans...</p>
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
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 sm:gap-10 relative z-10">
        {/* Header Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/60 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-sky-500/10 to-cyan-500/10 opacity-50"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                  <i className="pi pi-star text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-2 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                    Choose Your Plan
                  </h1>
                  <p className="text-text-secondary text-base">
                    Select the perfect plan that fits your needs. Upgrade or downgrade anytime.
                  </p>
                </div>
              </div>
              <Button
                label="Create New Plan"
                onClick={() => setShowCreateDialog(true)}
                icon="pi pi-plus"
                variant="gradient"
                Size="large"
              />
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl p-12 border border-white/10 shadow-2xl text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-50"></div>
              <div className="relative">
                <div className="inline-flex p-6 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-3xl mb-6">
                  <i className="pi pi-inbox text-6xl text-primary"></i>
                </div>
                <h3 className="text-2xl font-black text-text-primary mb-3">No Plans Available</h3>
                <p className="text-text-secondary mb-6">Create your first plan to get started.</p>
                <Button
                  label="Create New Plan"
                  onClick={() => setShowCreateDialog(true)}
                  icon="pi pi-plus"
                  variant="gradient"
                  Size="large"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className="relative group">
                <PlanCard
                  plan={plan}
                  isCurrentPlan={subscription?.planId === plan.id}
                  isPopular={plan.isPopular}
                  onSubscribe={handleSubscribe}
                  subscribing={subscribing}
                />
                {/* Admin Actions */}
                {!plan.isDefault && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <Button
                      label=""
                      onClick={() => handleEditPlan(plan)}
                      icon="pi pi-pencil"
                      variant="secondary"
                      Size="small"
                      className="!p-2 !min-w-0 backdrop-blur-sm"
                    />
                    <Button
                      label=""
                      onClick={() => handleDeletePlan(plan)}
                      icon="pi pi-trash"
                      variant="outlined"
                      className="!p-2 !min-w-0 border-red-500 text-red-500 hover:bg-red-500/10 backdrop-blur-sm"
                      Size="small"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Plan Dialog */}
      <Dialog
        visible={showCreateDialog}
        onHide={() => setShowCreateDialog(false)}
        header={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-cyan-600 rounded-xl">
              <i className="pi pi-plus text-white"></i>
            </div>
            <span className="text-xl font-bold text-text-primary">Create New Plan</span>
          </div>
        }
        modal
        className="w-11/12 md:w-2/3 lg:w-1/2"
        style={{ maxHeight: "90vh" }}
      >
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Plan Name *
            </label>
            <InputText
              value={createFormData.name}
              onChange={(e) =>
                setCreateFormData({ ...createFormData, name: e.target.value })
              }
              placeholder="e.g., Monthly, Yearly"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Duration (days) *
              </label>
              <InputNumber
                value={createFormData.duration}
                onValueChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    duration: e.value || 0,
                  })
                }
                min={0}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Price (₹) *
              </label>
              <InputNumber
                value={createFormData.price}
                onValueChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    price: e.value || 0,
                  })
                }
                min={0}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Features
            </label>
            <div className="flex gap-2 mb-2">
              <InputText
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button
                label="Add"
                onClick={addFeature}
                variant="secondary"
                Size="small"
              />
            </div>
            <div className="space-y-2">
              {createFormData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-bg-secondary p-2 rounded"
                >
                  <span className="text-text-primary">{feature}</span>
                  <Button
                    label=""
                    onClick={() => removeFeature(index)}
                    icon="pi pi-times"
                    variant="outlined"
                    className="!p-1 !min-w-0"
                    Size="small"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              inputId="isPopular"
              checked={!!createFormData.isPopular}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  isPopular: e.checked ?? false,
                })
              }
            />
            <label htmlFor="isPopular" className="text-text-primary">
              Mark as Popular
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              label="Cancel"
              onClick={() => setShowCreateDialog(false)}
              variant="secondary"
            />
            <Button
              label="Create Plan"
              onClick={handleCreatePlan}
              loading={loading}
            />
          </div>
        </div>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog
        visible={!!editingPlan}
        onHide={() => setEditingPlan(null)}
        header={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-cyan-600 rounded-xl">
              <i className="pi pi-pencil text-white"></i>
            </div>
            <span className="text-xl font-bold text-text-primary">Edit Plan: {editingPlan?.name}</span>
          </div>
        }
        modal
        className="w-11/12 md:w-2/3 lg:w-1/2"
        style={{ maxHeight: "90vh" }}
      >
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Plan Name
            </label>
            <InputText
              value={editFormData.name || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Duration (days)
              </label>
              <InputNumber
                value={editFormData.duration}
                onValueChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    duration: e.value || 0,
                  })
                }
                min={0}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Price (₹)
              </label>
              <InputNumber
                value={editFormData.price}
                onValueChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    price: e.value || 0,
                  })
                }
                min={0}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Features
            </label>
            <div className="flex gap-2 mb-2">
              <InputText
                value={editNewFeature}
                onChange={(e) => setEditNewFeature(e.target.value)}
                placeholder="Add a feature"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addEditFeature();
                  }
                }}
              />
              <Button
                label="Add"
                onClick={addEditFeature}
                variant="secondary"
                Size="small"
              />
            </div>
            <div className="space-y-2">
              {editFormData.features?.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-bg-secondary p-2 rounded"
                >
                  <span className="text-text-primary">{feature}</span>
                  <Button
                    label=""
                    onClick={() => removeEditFeature(index)}
                    icon="pi pi-times"
                    variant="outlined"
                    className="!p-1 !min-w-0"
                    Size="small"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              inputId="editIsPopular"
              checked={!!editFormData.isPopular}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  isPopular: e.checked ?? false,
                })
              }
            />
            <label htmlFor="editIsPopular" className="text-text-primary">
              Mark as Popular
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              label="Cancel"
              onClick={() => setEditingPlan(null)}
              variant="secondary"
            />
            <Button
              label="Update Plan"
              onClick={handleUpdatePlan}
              loading={loading}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        header={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-cyan-600 rounded-xl">
              <i className="pi pi-check-circle text-white"></i>
            </div>
            <span className="text-xl font-bold text-text-primary">Confirm Subscription</span>
          </div>
        }
        modal
        className="w-11/12 md:w-1/2 lg:w-1/3"
      >
        <div className="py-4">
          <p className="mb-6 text-text-secondary text-base">
            Subscribe to <strong className="text-text-primary">{selectedPlan?.name}</strong> plan for{" "}
            <strong className="text-primary">₹{selectedPlan?.price}</strong>?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              label="Cancel"
              onClick={() => setShowConfirmDialog(false)}
              variant="outlined"
              Size="medium"
            />
            <Button
              label={subscribing ? "Subscribing..." : "Subscribe"}
              onClick={confirmSubscribe}
              loading={subscribing}
              variant="gradient"
              Size="medium"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
