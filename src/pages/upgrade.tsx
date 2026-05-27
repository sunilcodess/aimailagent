import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with email generation",
    features: [
      { text: "3 emails per day", included: true },
      { text: "English language", included: true },
      { text: "Copy to clipboard", included: true },
      { text: "Hindi & Hinglish", included: false },
      { text: "Follow-up emails", included: false },
      { text: "Industry templates", included: false },
      { text: "A/B subject testing", included: false },
      { text: "Student email support", included: false },
      { text: "WhatsApp sharing", included: false },
    ],
    cta: "Current Plan",
    highlighted: false,
    icon: null,
  },
  {
    name: "Pro Monthly",
    price: "₹99",
    period: "/month",
    description: "Everything you need to convert",
    features: [
      { text: "Unlimited email generations", included: true },
      { text: "All languages", included: true },
      { text: "Follow-up emails", included: true },
      { text: "Industry-based templates", included: true },
      { text: "subject testing", included: true },
      { text: "Student email support", included: true },
      { text: "WhatsApp sharing", included: true },
      { text: "Copy to clipboard", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Upgrade to Pro",
    highlighted: false,
    icon: Zap,
  },
  {
    name: "Pro Yearly",
    price: "₹1099",
    period: "/year",
    features: [
      { text: "Everything in Pro Monthly", included: true },
      { text: "Unlimited generations", included: true },
      { text: "All features included", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Upgrade to Pro Yearly",
    highlighted: false,
    icon: Crown,
  },
];

const upgrade = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background px-4 py-12">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center space-y-8">
        <div className="text-center space-y-2 ">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Sparkles className="h-4 w-4" />
            upgrade
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent upgrade
          </h1>

          <p className="text-muted-foreground">
            Choose the plan that works for you. Upgrade anytime.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="
                w-full
                max-w-[340px]
                h-full
                flex-col
                justify-between
                shadow-lg
                border
                border-border/60
                transition-all
                duration-300
                cursor-pointer
                hover:border-purple-500
                hover:shadow-[0_0_30px_rgba(168,85,247,0.45)]
                hover:-translate-y-2"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  {plan.icon && <plan.icon className="h-5 w-5 text-primary" />}

                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>

                <CardDescription>{plan.description}</CardDescription>

                <div className="pt-2">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>

                  <span className="text-muted-foreground ml-1">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex flex-col flex-1 justify-between">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li
                      key={f.text}
                      className={`flex items-center gap-2 text-sm ${
                        f.included
                          ? "text-foreground"
                          : "text-muted-foreground line-through"
                      }`}
                    >
                      {f.included ? (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}

                      {f.text}
                    </li>
                  ))}
                </ul>

                <Button
                  className="
                    w-full
                    transition-all
                    duration-300
                    hover:bg-gradient-to-r
                    hover:from-purple-600
                    hover:text-white"
                  variant="outline"
                  onClick={() => navigate("/")}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            ← Back to Generator
          </Button>
        </div>
      </div>
    </div>
  );
};

export default upgrade;
