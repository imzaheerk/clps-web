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

  const cardClass = [
    "app-plan-card",
    isCurrentPlan ? "app-plan-card--current" : "",
    isPopular && !isCurrentPlan ? "app-plan-card--popular" : "",
    plan.price === 0 && !isCurrentPlan ? "app-plan-card--free" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass}>
      {isPopular && !isCurrentPlan && (
        <span className="app-plan-card-badge">Popular</span>
      )}
      <div className="app-plan-card-icon">
        <i className={`pi ${getPlanIcon()}`} />
      </div>
      <h2 className="app-plan-card-name">{plan.name}</h2>
      <div className="app-plan-card-price">
        <span className="app-plan-card-price-value">{formatPrice(plan.price)}</span>
        {plan.price > 0 && (
          <span className="app-plan-card-price-period">{formatDuration(plan.duration)}</span>
        )}
      </div>
      <ul className="app-feature-list app-plan-card-features">
        {plan.features.map((feature, index) => (
          <li key={index}>
            <i className="pi pi-check" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {isCurrentPlan ? (
        <div className="app-plan-card-current">
          <i className="pi pi-check-circle" />
          Your active plan
        </div>
      ) : (
        <Button
          label={plan.price === 0 ? "Select free plan" : "Subscribe now"}
          onClick={() => onSubscribe(plan)}
          loading={subscribing}
          disabled={subscribing}
          className="w-full"
          variant={isPopular ? "gradient" : plan.price === 0 ? "outlined" : "primary"}
          icon={plan.price === 0 ? "pi pi-check" : "pi pi-credit-card"}
          Size="large"
        />
      )}
    </div>
  );
}
