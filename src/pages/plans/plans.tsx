import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout, PageHeader, showNotification, PlanCard, LoadingState, EmptyState } from "@/components";
import ResendModal from "@/components/ResendModal";
import { usePlans } from "@/hooks/usePlans";
import { useSubscription } from "@/hooks/useSubscription";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import type { Plan, CreatePlanInput, UpdatePlanInput } from "@/services/planService/planService";

const inputClass = "auth-resend-input w-full";

interface PlanFormFieldsProps {
  name: string;
  duration: number;
  price: number;
  features: string[];
  isPopular: boolean;
  featureDraft: string;
  idPrefix: string;
  onNameChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onPriceChange: (value: number) => void;
  onPopularChange: (value: boolean) => void;
  onFeatureDraftChange: (value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
}

function PlanFormFields({
  name,
  duration,
  price,
  features,
  isPopular,
  featureDraft,
  idPrefix,
  onNameChange,
  onDurationChange,
  onPriceChange,
  onPopularChange,
  onFeatureDraftChange,
  onAddFeature,
  onRemoveFeature,
}: PlanFormFieldsProps) {
  return (
    <div className="app-form-stack">
      <div>
        <label className="app-form-label" htmlFor={`${idPrefix}-name`}>
          Plan name <span className="text-red-400">*</span>
        </label>
        <InputText
          id={`${idPrefix}-name`}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Monthly, Yearly"
          className={inputClass}
        />
      </div>

      <div className="app-form-grid">
        <div>
          <label className="app-form-label" htmlFor={`${idPrefix}-duration`}>
            Duration (days) <span className="text-red-400">*</span>
          </label>
          <InputNumber
            inputId={`${idPrefix}-duration`}
            value={duration}
            onValueChange={(e) => onDurationChange(e.value ?? 0)}
            min={0}
            className="w-full"
            inputClassName={inputClass}
          />
        </div>
        <div>
          <label className="app-form-label" htmlFor={`${idPrefix}-price`}>
            Price (₹) <span className="text-red-400">*</span>
          </label>
          <InputNumber
            inputId={`${idPrefix}-price`}
            value={price}
            onValueChange={(e) => onPriceChange(e.value ?? 0)}
            min={0}
            className="w-full"
            inputClassName={inputClass}
          />
        </div>
      </div>

      <div className="resend-modal-form-panel">
        <label className="app-form-label" htmlFor={`${idPrefix}-feature`}>
          Features
        </label>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <InputText
            id={`${idPrefix}-feature`}
            value={featureDraft}
            onChange={(e) => onFeatureDraftChange(e.target.value)}
            placeholder="Add a feature"
            className={`${inputClass} flex-1`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddFeature();
              }
            }}
          />
          <button type="button" className="resend-btn resend-btn-secondary shrink-0" onClick={onAddFeature}>
            <i className="pi pi-plus" />
            Add
          </button>
        </div>
        {features.length > 0 ? (
          <ul className="resend-modal-feature-list">
            {features.map((feature, index) => (
              <li key={`${feature}-${index}`} className="resend-modal-feature-item">
                <span>{feature}</span>
                <button
                  type="button"
                  className="resend-modal-feature-remove"
                  onClick={() => onRemoveFeature(index)}
                  aria-label={`Remove ${feature}`}
                >
                  <i className="pi pi-times" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-text-tertiary m-0">No features added yet.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          inputId={`${idPrefix}-popular`}
          checked={isPopular}
          onChange={(e) => onPopularChange(e.checked ?? false)}
        />
        <label htmlFor={`${idPrefix}-popular`} className="text-sm text-text-secondary cursor-pointer">
          Mark as popular plan
        </label>
      </div>
    </div>
  );
}

function ModalFooter({
  onCancel,
  onConfirm,
  cancelLabel,
  confirmLabel,
  loading,
  confirmDanger,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel: string;
  confirmLabel: string;
  loading?: boolean;
  confirmDanger?: boolean;
}) {
  return (
    <div className="resend-modal-actions-row">
      <button type="button" className="resend-btn resend-btn-secondary" onClick={onCancel} disabled={loading}>
        {cancelLabel}
      </button>
      <button
        type="button"
        className={`resend-btn ${confirmDanger ? "resend-btn-danger" : "resend-btn-primary"}`}
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? (
          <>
            <i className="pi pi-spin pi-spinner" />
            Please wait…
          </>
        ) : (
          confirmLabel
        )}
      </button>
    </div>
  );
}

export default function Plans() {
  const { user } = useAuth();
  const { plans, loading, createPlan, updatePlan, deletePlan } = usePlans(true);
  const { subscription, createSubscription, loading: subscribing } = useSubscription(user?.id || null, true);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [createFormData, setCreateFormData] = useState<CreatePlanInput>({
    name: "",
    duration: 30,
    price: 0,
    features: [],
    isPopular: false,
  });
  const [newFeature, setNewFeature] = useState("");

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editFormData, setEditFormData] = useState<UpdatePlanInput>({});
  const [editNewFeature, setEditNewFeature] = useState("");

  const currentPlan = plans.find((p) => p.id === subscription?.planId);

  const handleSubscribe = (plan: Plan) => {
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

  const resetCreateForm = () => {
    setCreateFormData({ name: "", duration: 30, price: 0, features: [], isPopular: false });
    setNewFeature("");
  };

  const handleCreatePlan = async () => {
    if (!createFormData.name.trim()) {
      showNotification("Plan name is required", "error");
      return;
    }
    if (createFormData.price < 0 || createFormData.duration < 0) {
      showNotification("Price and duration cannot be negative", "error");
      return;
    }
    const result = await createPlan(createFormData);
    if (result) {
      showNotification("Plan created successfully!", "success");
      setShowCreateDialog(false);
      resetCreateForm();
    } else {
      showNotification("Failed to create plan", "error");
    }
  };

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

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;
    setDeleting(true);
    try {
      const success = await deletePlan(planToDelete.id);
      if (success) {
        showNotification("Plan deleted successfully!", "success");
        setPlanToDelete(null);
      } else {
        showNotification("Failed to delete plan", "error");
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading && plans.length === 0) {
    return (
      <PageLayout maxWidth="xl">
        <PageHeader icon="pi pi-star" title="Plans & pricing" description="Compare plans and manage subscriptions." />
        <LoadingState message="Loading plans…" />
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        icon="pi pi-star"
        title="Plans & pricing"
        description="Choose the right plan for you. Upgrade, downgrade, or manage listings anytime."
        action={
          <button type="button" className="resend-btn resend-btn-primary" onClick={() => setShowCreateDialog(true)}>
            <i className="pi pi-plus" />
            Create plan
          </button>
        }
      />

      {currentPlan ? (
        <section className="app-panel app-plans-hero">
          <div>
            <p className="app-panel-copy m-0 mb-1">Your current plan</p>
            <h2 className="app-panel-title m-0">
              <i className="pi pi-check-circle" />
              {currentPlan.name}
            </h2>
            <p className="text-sm text-text-secondary mt-2 mb-0">
              {currentPlan.price === 0 ? "Free" : `₹${currentPlan.price}`}
              {currentPlan.price > 0 ? ` · ${currentPlan.duration} days` : ""}
            </p>
          </div>
          <span className="resend-pill resend-pill--success self-start">Active</span>
        </section>
      ) : null}

      {plans.length === 0 ? (
        <EmptyState
          icon="pi pi-inbox"
          title="No plans available"
          description="Create your first plan to get started."
          action={{ label: "Create plan", onClick: () => setShowCreateDialog(true), icon: "pi pi-plus" }}
        />
      ) : (
        <section className="app-plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="app-plan-card-wrap">
              {!plan.isDefault ? (
                <div className="app-plan-admin-actions">
                  <button
                    type="button"
                    className="app-plan-admin-btn"
                    onClick={() => handleEditPlan(plan)}
                    title="Edit plan"
                    aria-label="Edit plan"
                  >
                    <i className="pi pi-pencil" />
                  </button>
                  <button
                    type="button"
                    className="app-plan-admin-btn app-plan-admin-btn--danger"
                    onClick={() => setPlanToDelete(plan)}
                    title="Delete plan"
                    aria-label="Delete plan"
                  >
                    <i className="pi pi-trash" />
                  </button>
                </div>
              ) : null}
              <PlanCard
                plan={plan}
                isCurrentPlan={subscription?.planId === plan.id}
                isPopular={plan.isPopular}
                onSubscribe={handleSubscribe}
                subscribing={subscribing}
              />
            </div>
          ))}
        </section>
      )}

      <ResendModal
        visible={showCreateDialog}
        onHide={() => {
          setShowCreateDialog(false);
          resetCreateForm();
        }}
        badge="Admin"
        title="Create new plan"
        description="Set pricing, duration, and features for a new subscription tier."
        icon="pi-plus"
        size="wide"
        footer={
          <ModalFooter
            onCancel={() => {
              setShowCreateDialog(false);
              resetCreateForm();
            }}
            onConfirm={handleCreatePlan}
            cancelLabel="Cancel"
            confirmLabel="Create plan"
            loading={loading}
          />
        }
      >
        <div className="resend-modal-scroll">
          <PlanFormFields
            idPrefix="create"
            name={createFormData.name}
            duration={createFormData.duration}
            price={createFormData.price}
            features={createFormData.features}
            isPopular={!!createFormData.isPopular}
            featureDraft={newFeature}
            onNameChange={(value) => setCreateFormData({ ...createFormData, name: value })}
            onDurationChange={(value) => setCreateFormData({ ...createFormData, duration: value })}
            onPriceChange={(value) => setCreateFormData({ ...createFormData, price: value })}
            onPopularChange={(value) => setCreateFormData({ ...createFormData, isPopular: value })}
            onFeatureDraftChange={setNewFeature}
            onAddFeature={() => {
              if (!newFeature.trim()) return;
              setCreateFormData({
                ...createFormData,
                features: [...createFormData.features, newFeature.trim()],
              });
              setNewFeature("");
            }}
            onRemoveFeature={(index) =>
              setCreateFormData({
                ...createFormData,
                features: createFormData.features.filter((_, i) => i !== index),
              })
            }
          />
        </div>
      </ResendModal>

      <ResendModal
        visible={!!editingPlan}
        onHide={() => setEditingPlan(null)}
        badge="Admin"
        title="Edit plan"
        description={editingPlan ? `Update details for ${editingPlan.name}.` : undefined}
        icon="pi-pencil"
        size="wide"
        footer={
          <ModalFooter
            onCancel={() => setEditingPlan(null)}
            onConfirm={handleUpdatePlan}
            cancelLabel="Cancel"
            confirmLabel="Save changes"
            loading={loading}
          />
        }
      >
        <div className="resend-modal-scroll">
          <PlanFormFields
            idPrefix="edit"
            name={editFormData.name || ""}
            duration={editFormData.duration ?? 0}
            price={editFormData.price ?? 0}
            features={editFormData.features || []}
            isPopular={!!editFormData.isPopular}
            featureDraft={editNewFeature}
            onNameChange={(value) => setEditFormData({ ...editFormData, name: value })}
            onDurationChange={(value) => setEditFormData({ ...editFormData, duration: value })}
            onPriceChange={(value) => setEditFormData({ ...editFormData, price: value })}
            onPopularChange={(value) => setEditFormData({ ...editFormData, isPopular: value })}
            onFeatureDraftChange={setEditNewFeature}
            onAddFeature={() => {
              if (!editNewFeature.trim()) return;
              setEditFormData({
                ...editFormData,
                features: [...(editFormData.features || []), editNewFeature.trim()],
              });
              setEditNewFeature("");
            }}
            onRemoveFeature={(index) =>
              setEditFormData({
                ...editFormData,
                features: editFormData.features?.filter((_, i) => i !== index) || [],
              })
            }
          />
        </div>
      </ResendModal>

      <ResendModal
        visible={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        badge="Subscription"
        title="Confirm subscription"
        description={
          <>
            Subscribe to <strong>{selectedPlan?.name}</strong> for{" "}
            <strong>{selectedPlan?.price === 0 ? "Free" : `₹${selectedPlan?.price}`}</strong>?
          </>
        }
        icon="pi-check-circle"
        tone="success"
        footer={
          <ModalFooter
            onCancel={() => setShowConfirmDialog(false)}
            onConfirm={confirmSubscribe}
            cancelLabel="Not now"
            confirmLabel="Subscribe"
            loading={subscribing}
          />
        }
      />

      <ResendModal
        visible={!!planToDelete}
        onHide={() => !deleting && setPlanToDelete(null)}
        badge="Admin"
        title="Delete plan?"
        description={
          <>
            Permanently remove <strong>{planToDelete?.name}</strong>? This cannot be undone.
          </>
        }
        icon="pi-trash"
        tone="danger"
        footer={
          <ModalFooter
            onCancel={() => setPlanToDelete(null)}
            onConfirm={confirmDeletePlan}
            cancelLabel="Keep plan"
            confirmLabel="Delete plan"
            loading={deleting}
            confirmDanger
          />
        }
      />
    </PageLayout>
  );
}
