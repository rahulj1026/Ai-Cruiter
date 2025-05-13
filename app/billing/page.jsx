"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Basic",
    priceUSD: 5,
    priceINR: 420, // Approx ₹84/USD
    interviews: 20,
    features: ["Basic interview templates", "Email support"],
  },
  {
    name: "Standard",
    priceUSD: 12,
    priceINR: 1000,
    interviews: 50,
    features: [
      "All interview templates",
      "Priority support",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    priceUSD: 25,
    priceINR: 2100,
    interviews: 120,
    features: ["All interview templates", "24/7 support", "Advanced analytics"],
  },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BillingPage() {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user?.email) return;
      const { data, error } = await supabase
        .from("Users")
        .select("credits")
        .eq("email", user.email)
        .single();
      if (data) setCredits(data.credits || 0);
    };
    fetchCredits();
  }, [user?.email]);

  const handleRazorpayPayment = async (plan) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: plan.priceINR * 100, // amount in paise
      currency: "INR",
      name: "AI Interview Platform",
      description: `${plan.name} Plan - ${plan.interviews} interviews`,
      handler: async function (response) {
        // Save payment info and add credits
        await fetch("/api/add-credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            credits: plan.interviews,
            orderId: response.razorpay_payment_id,
            planName: plan.name,
            planPrice: plan.priceUSD,
          }),
        });
        // Refetch credits
        const { data: userData } = await supabase
          .from("Users")
          .select("credits")
          .eq("email", user.email)
          .single();
        setCredits(userData.credits || 0);
        toast.success(`Payment successful! ${plan.interviews} credits added.`);
        setSelectedPlan(null);
      },
      prefill: {
        email: user.email,
        name: user.name,
      },
      theme: {
        color: "#2563eb",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Billing</h1>
        <p className="text-gray-500 mb-8">Manage your Payment and credits</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Your Credits */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl font-bold text-blue-700">
                {credits} interviews left
              </span>
            </div>
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-lg"
              onClick={() => setSelectedPlan(null)}
            >
              + Add More Credits
            </button>
          </div>

          {/* Purchase Credits */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <h2 className="font-semibold mb-6 text-xl">Purchase Credits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`w-full border-2 rounded-xl p-6 flex flex-col items-center transition-all duration-200 cursor-pointer hover:shadow-2xl hover:border-blue-400 ${
                    selectedPlan === plan.name
                      ? "border-blue-600 bg-blue-50 scale-105 shadow-lg"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-1 text-blue-700">
                    ${plan.priceUSD}
                  </div>
                  <div className="text-gray-500 mb-2 text-lg">
                    {plan.interviews} interviews
                  </div>
                  <ul className="mb-4 text-base text-gray-600">
                    {plan.features.map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-2 rounded font-semibold mt-auto transition-all duration-150 ${
                      selectedPlan === plan.name
                        ? "bg-blue-600 text-white shadow"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRazorpayPayment(plan);
                    }}
                  >
                    Pay with Razorpay
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
