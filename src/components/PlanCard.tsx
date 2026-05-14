import { Button } from "@/components";
import type { Plan } from "@/services/planService/planService";

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan: boolean;
  isPopular: boolean;
  onSubscribe: (plan: Plan) => void;
  subscribing: boolean;
}

export default function PlanCard({
  plan,
  isCurrentPlan,
  isPopular,
  onSubscribe,
  subscribing,
}: PlanCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `₹${price}`;
  };

  const formatDuration = (duration: number) => {
    if (duration === 0) return "Lifetime";
    if (duration === 30) return "per month";
    if (duration === 365) return "per year";
    return `${duration} days`;
  };

  const getPlanIcon = () => {
    if (plan.price === 0) return "pi-gift";
    if (plan.duration === 30) return "pi-calendar";
    return "pi-star";
  };

  const isFree = plan.price === 0;
  const isPremium = !isFree;

  return (
    <div
      className={`relative flex flex-col transition-all duration-300 ${
        isCurrentPlan ? "transform scale-105 z-10" : "hover:scale-[1.02]"
      }`}
    >
      {isCurrentPlan ? (
        <>
          {/* Glow Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 via-yellow-500/30 to-yellow-600/30 rounded-3xl blur-xl opacity-50"></div>

          {/* Current Plan Card */}
          <div className="relative backdrop-blur-xl bg-bg-primary/80 rounded-3xl border-2 border-yellow-400/50 shadow-2xl p-6 lg:p-8 flex flex-col">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-t-3xl"></div>

            {/* Plan Header */}
            <div className="text-center mb-6 pt-2">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                  <i className={`pi ${getPlanIcon()} text-2xl text-yellow-900`}></i>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black mb-4 text-yellow-700">
                {plan.name}
              </h2>
              <div className="mb-2">
                <span className="text-5xl lg:text-6xl font-black text-yellow-600">
                  {formatPrice(plan.price)}
                </span>
                {plan.price > 0 && (
                  <span className="text-text-secondary text-base ml-2 font-semibold">
                    {formatDuration(plan.duration)}
                  </span>
                )}
              </div>
            </div>

            {/* Features List */}
            <div className="flex-1 mb-8">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center mt-0.5 shadow-md">
                      <i className="pi pi-check text-sm text-yellow-900 font-bold"></i>
                    </div>
                    <span className="text-base leading-relaxed text-yellow-800 font-semibold">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Current Plan Indicator */}
            <div className="w-full py-4 px-4 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 rounded-2xl text-center border-2 border-yellow-400/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2">
                <i className="pi pi-check-circle text-yellow-600 text-xl"></i>
                <span className="text-yellow-800 font-black text-base">
                  Your Active Plan
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="relative group">
          {/* Glow Background */}
          <div className={`absolute -inset-1 bg-gradient-to-r rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            isPopular 
              ? 'from-primary/30 via-cyan-500/30 to-emerald-500/30' 
              : isFree
              ? 'from-gray-400/20 to-gray-500/20'
              : 'from-primary/20 to-cyan-500/20'
          }`}></div>

          {/* Plan Card */}
          <div className={`relative backdrop-blur-xl rounded-3xl border p-6 lg:p-8 flex flex-col transition-all duration-300 ${
            isPopular
              ? "bg-bg-primary/80 border-primary/50 shadow-2xl"
              : isFree
              ? "bg-bg-primary/70 border-white/10 shadow-xl"
              : "bg-bg-primary/70 border-white/10 shadow-xl hover:border-primary/30"
          }`}>
            {/* Premium/Popular Top Bar */}
            {isPopular && (
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-t-3xl"></div>
            )}
            {isFree && (
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-t-3xl"></div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6 pt-2">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  isPopular
                    ? 'bg-gradient-to-br from-primary to-cyan-600'
                    : isFree
                    ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                    : 'bg-gradient-to-br from-primary/80 to-cyan-600/80'
                }`}>
                  <i className={`pi ${getPlanIcon()} text-2xl text-white`}></i>
                </div>
              </div>
              <h2 className={`text-2xl lg:text-3xl font-black mb-4 ${
                isPopular ? 'text-text-primary' : isFree ? 'text-gray-600' : 'text-text-primary'
              }`}>
                {plan.name}
              </h2>
              <div className="mb-2">
                {isPremium ? (
                  <span className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatPrice(plan.price)}
                  </span>
                ) : (
                  <span className="text-5xl lg:text-6xl font-black text-gray-500">
                    {formatPrice(plan.price)}
                  </span>
                )}
                {plan.price > 0 && (
                  <span className="text-text-secondary text-base ml-2 font-semibold">
                    {formatDuration(plan.duration)}
                  </span>
                )}
              </div>
            </div>

            {/* Features List */}
            <div className="flex-1 mb-8">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 shadow-md ${
                      isPopular
                        ? 'bg-gradient-to-br from-primary to-cyan-600'
                        : isFree
                        ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                        : 'bg-gradient-to-br from-primary/80 to-cyan-600/80'
                    }`}>
                      <i className="pi pi-check text-sm text-white font-bold"></i>
                    </div>
                    <span className="text-base leading-relaxed text-text-primary font-semibold">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Button
              label={isFree ? "Select Free Plan" : "Subscribe Now"}
              onClick={() => onSubscribe(plan)}
              loading={subscribing}
              disabled={subscribing}
              className="w-full"
              variant={isPopular ? "gradient" : isFree ? "outlined" : "primary"}
              icon={isFree ? "pi pi-check" : "pi pi-credit-card"}
              Size="large"
            />
          </div>
        </div>
      )}
    </div>
  );
}
