import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header, Button, showNotification, NetworkBackground } from "@/components";
import { useSubscription } from "@/hooks/useSubscription";
import { Dialog } from "primereact/dialog";
import "primeicons/primeicons.css";

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    subscription,
    loading,
    cancelSubscription,
    loading: cancelling,
  } = useSubscription(user?.id || null, true);

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelSubscription = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (!subscription) return;

    const success = await cancelSubscription(subscription.id);
    if (success) {
      showNotification(
        "Subscription cancelled successfully. You have been moved to the free plan.",
        "success"
      );
      setShowCancelDialog(false);
    } else {
      showNotification("Failed to cancel subscription", "error");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  if (loading && !subscription) {
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
              <p className="text-xl font-bold text-text-primary">Loading subscription...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
        {/* Network Background - Global Internet Network Visualization */}
        <NetworkBackground />
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <Header showAuthButtons={false} />
        <div className="flex-1 max-w-[1000px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center relative z-10">
          <div className="relative group w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl p-10 sm:p-12 border border-white/10 shadow-2xl text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan-500/5 to-cyan-500/5 opacity-50"></div>
              <div className="relative">
                <div className="inline-flex p-6 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-3xl mb-6">
                  <i className="pi pi-credit-card text-6xl text-primary"></i>
                </div>
                <h3 className="text-2xl font-black text-text-primary mb-3 bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  No Active Subscription
                </h3>
                <p className="text-text-secondary mb-8 text-base">
                  Subscribe to a plan to unlock premium features and get the most out of Checknown
                </p>
                <Button
                  label="View Plans"
                  onClick={() => navigate("/plans")}
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  variant="gradient"
                  Size="large"
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const plan = subscription.plan;
  const isActive = subscription.status === "active";
  const isFree = plan?.isDefault || plan?.price === 0;
  const isPremium = !isFree && plan && plan.price > 0;

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
      <div className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 sm:gap-10 relative z-10">
        {/* Header Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/60 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cyan-500/10 to-emerald-500/10 opacity-50"></div>
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                <i className="pi pi-credit-card text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-2 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  My Subscription
                </h1>
                <p className="text-text-secondary text-base">
                  Manage your subscription and billing information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r ${isPremium ? 'from-primary/30 via-cyan-500/30 to-emerald-500/30' : 'from-gray-400/20 to-gray-500/20'} rounded-3xl blur-xl opacity-50`}></div>
          <div className={`relative backdrop-blur-xl ${isPremium ? 'bg-bg-primary/70' : 'bg-bg-primary/60'} rounded-3xl border ${isPremium ? 'border-primary/30' : 'border-white/10'} shadow-2xl overflow-hidden`}>
            {/* Premium Badge Bar */}
            {isPremium && (
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500"></div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-br ${isPremium ? 'from-primary/10 via-cyan-500/10 to-emerald-500/10' : 'from-gray-400/5 to-gray-500/5'} opacity-50`}></div>
            <div className="relative p-8 sm:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-16 h-16 rounded-2xl ${isPremium ? 'bg-gradient-to-br from-primary to-cyan-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg`}>
                      <i className={`pi ${isPremium ? 'pi-star' : 'pi-credit-card'} text-white text-2xl`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h2 className="text-3xl lg:text-4xl font-black text-text-primary">
                          {plan?.name || "Unknown Plan"}
                        </h2>
                        {isPremium && (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-xs font-black text-yellow-900 border border-yellow-500/50 shadow-lg">
                            <i className="pi pi-star text-xs"></i>
                            PREMIUM
                          </span>
                        )}
                        {isFree && (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-500/20 text-gray-600 rounded-full text-xs font-black border border-gray-400/30">
                            FREE
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${
                        subscription.status === "active"
                          ? "bg-green-500/20 text-green-500 border border-green-500/30"
                          : subscription.status === "expired"
                          ? "bg-red-500/20 text-red-500 border border-red-500/30"
                          : "bg-gray-500/20 text-gray-500 border border-gray-500/30"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          subscription.status === "active" ? "bg-green-500" :
                          subscription.status === "expired" ? "bg-red-500" : "bg-gray-500"
                        }`}></span>
                        {subscription.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {plan && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <i className={`pi pi-check-circle ${isPremium ? 'text-primary' : 'text-gray-500'}`}></i>
                      <span className="font-semibold">{plan.features.length} {isPremium ? 'premium' : ''} features included</span>
                    </div>
                  )}
                </div>
                {plan && (
                  <div className="text-center lg:text-right">
                    {isPremium ? (
                      <>
                        <div className="text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                          ₹{plan.price}
                        </div>
                        <p className="text-text-secondary text-base font-semibold m-0">
                          {plan.duration === 30
                            ? "per month"
                            : plan.duration === 365
                            ? "per year"
                            : ""}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-5xl lg:text-6xl font-black text-gray-500 mb-2">
                          Free
                        </div>
                        <p className="text-text-secondary text-base font-semibold m-0">
                          Basic Plan
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan-500/5 to-cyan-500/5 opacity-50"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg">
                  <i className="pi pi-info-circle text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-black text-text-primary bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  Subscription Details
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                      <i className="pi pi-calendar text-white text-lg" />
                    </div>
                    <p className="text-xs text-text-secondary font-bold uppercase tracking-wide">Start Date</p>
                  </div>
                  <p className="text-lg font-black text-text-primary m-0">
                    {formatDate(subscription.startsAt)}
                  </p>
                </div>
                {!isFree && subscription.expiresAt && (
                  <div className="p-5 bg-bg-secondary/50 backdrop-blur-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center">
                        <i className="pi pi-clock text-white text-lg" />
                      </div>
                      <p className="text-xs text-text-secondary font-bold uppercase tracking-wide">Expiry Date</p>
                    </div>
                    <p className="text-lg font-black text-text-primary m-0">
                      {formatDate(subscription.expiresAt)}
                    </p>
                  </div>
                )}
              </div>

              {plan && plan.features.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-gradient-to-br from-primary to-cyan-600 rounded-xl">
                      <i className="pi pi-list text-white text-sm"></i>
                    </div>
                    <p className="text-sm text-text-secondary font-bold uppercase tracking-wide">Plan Features</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-bg-secondary/50 backdrop-blur-sm rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center flex-shrink-0">
                          <i className="pi pi-check text-white text-xs" />
                        </div>
                        <span className="text-text-primary font-semibold">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {isActive && !isFree && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Button
              label="Change Plan"
              onClick={() => navigate("/plans")}
              variant="gradient"
              icon="pi pi-sync"
              className="w-full"
              Size="large"
            />
            <Button
              label="Cancel Subscription"
              onClick={handleCancelSubscription}
              variant="outlined"
              loading={cancelling}
              disabled={cancelling}
              icon="pi pi-times-circle"
              className="w-full border-2 border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-500"
              Size="large"
            />
          </div>
        )}

        {!isActive && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan-500/5 to-cyan-500/5 opacity-50"></div>
              <div className="relative">
                <div className="inline-flex p-4 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-2xl mb-4">
                  <i className="pi pi-exclamation-triangle text-4xl text-primary"></i>
                </div>
                <p className="text-text-secondary mb-6 text-base">
                  Your subscription has expired. Subscribe to a plan to continue enjoying premium features.
                </p>
                <Button
                  label="View Available Plans"
                  onClick={() => navigate("/plans")}
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  className="w-full sm:w-auto mx-auto"
                  variant="gradient"
                  Size="large"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog
        visible={showCancelDialog}
        onHide={() => setShowCancelDialog(false)}
        header={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
              <i className="pi pi-exclamation-triangle text-white"></i>
            </div>
            <span className="text-xl font-bold text-text-primary">Cancel Subscription</span>
          </div>
        }
        modal
        className="w-11/12 md:w-1/2 lg:w-1/3"
      >
        <div className="py-4">
          <p className="mb-6 text-text-secondary text-base">
            Are you sure you want to cancel your subscription? You will be
            downgraded to the free plan.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              label="No, Keep It"
              onClick={() => setShowCancelDialog(false)}
              variant="outlined"
              Size="medium"
            />
            <Button
              label={cancelling ? "Cancelling..." : "Yes, Cancel"}
              onClick={confirmCancel}
              loading={cancelling}
              variant="primary"
              className="bg-red-500 hover:bg-red-600"
              Size="medium"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

