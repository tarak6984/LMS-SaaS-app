import { PricingTable } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const Subscription = async () => {
    const user = await currentUser();
    
    if (!user) redirect("/sign-in");

    // Mock subscription data - in a real app, this would come from your database
    const currentPlan = "free"; // This would be determined by user's actual subscription
    const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "forever",
            features: [
                "Create up to 3 companions",
                "15-minute sessions",
                "Basic voice features",
                "Session history",
                "Community support"
            ],
            limitations: [
                "Limited companion creation",
                "Shorter session duration",
                "No priority support"
            ],
            current: currentPlan === "free"
        },
        {
            name: "Pro",
            price: "$19",
            period: "per month",
            features: [
                "Unlimited companions",
                "60-minute sessions",
                "Advanced voice features",
                "Session recordings",
                "Priority support",
                "Custom voice styles",
                "Advanced analytics",
                "Export session data"
            ],
            current: currentPlan === "pro",
            popular: true
        },
        {
            name: "Team",
            price: "$49",
            period: "per month",
            features: [
                "Everything in Pro",
                "Team management",
                "Shared companion library",
                "Admin dashboard",
                "Custom integrations",
                "Dedicated support",
                "Usage analytics",
                "Custom branding"
            ],
            current: currentPlan === "team"
        }
    ];

    return (
        <main className="max-w-6xl mx-auto">
            {/* Header Section */}
            <section className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Unlock the full potential of AI-powered learning
                </p>
            </section>

            {/* Current Subscription Status */}
            {currentPlan !== "free" && (
                <section className="mb-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Image src="/icons/check.svg" alt="Active" width={24} height={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900">Current Plan: {plans.find(p => p.current)?.name}</h3>
                                <p className="text-blue-700 text-sm">
                                    Next billing date: {nextBillingDate.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Button variant="outline" size="sm">
                                Manage Billing
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                Cancel Subscription
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing Plans */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative border rounded-lg p-6 ${
                            plan.popular
                                ? "border-primary bg-primary/5 transform scale-105"
                                : "border-gray-200"
                        } ${
                            plan.current
                                ? "ring-2 ring-green-500 bg-green-50"
                                : ""
                        }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>
                        )}
                        
                        {plan.current && (
                            <div className="absolute -top-3 right-4">
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Current Plan
                                </span>
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline justify-center space-x-1">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-gray-600">/{plan.period}</span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <Image src="/icons/check.svg" alt="Included" width={16} height={16} />
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                            {plan.limitations?.map((limitation, index) => (
                                <li key={index} className="flex items-center space-x-3 text-gray-500">
                                    <span className="text-red-400">×</span>
                                    <span className="text-sm">{limitation}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            className={`w-full ${
                                plan.current
                                    ? "bg-green-600 hover:bg-green-700"
                                    : plan.popular
                                    ? "bg-primary hover:bg-primary/90"
                                    : "bg-gray-600 hover:bg-gray-700"
                            }`}
                            disabled={plan.current}
                        >
                            {plan.current
                                ? "Current Plan"
                                : plan.name === "Free"
                                ? "Downgrade to Free"
                                : `Upgrade to ${plan.name}`}
                        </Button>
                    </div>
                ))}
            </section>

            {/* Clerk Pricing Table (fallback) */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-center mb-8">Or use Clerk's integrated billing</h2>
                <PricingTable />
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
                        <p className="text-gray-600 text-sm">
                            Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">What happens to my data if I cancel?</h3>
                        <p className="text-gray-600 text-sm">
                            Your companions and session history remain accessible. You'll revert to free plan limitations.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                        <p className="text-gray-600 text-sm">
                            We offer a 30-day money-back guarantee for all paid plans if you're not satisfied.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                        <p className="text-gray-600 text-sm">
                            Yes! All new users start with a free account. No credit card required to get started.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Subscription;
