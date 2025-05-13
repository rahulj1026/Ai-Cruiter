import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/services/supabaseClient";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";

const PLANS = [
  {
    name: "Basic",
    priceUSD: 5,
    priceINR: 420, // Approx ₹84/USD
    credits: 20,
    features: ["Basic interview templates", "Email support"],
  },
  {
    name: "Standard",
    priceUSD: 12,
    priceINR: 1000,
    credits: 50,
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
    credits: 120,
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
  const [credits, setCredits] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const purchaseRef = useRef(null);

  const fetchCredits = async () => {
    if (!user?.email) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("Users")
      .select("credits")
      .eq("email", user.email)
      .single();
    setLoading(false);
    if (error) {
      console.error("Error fetching credits:", error);
    } else {
      setCredits(typeof data.credits === "number" ? data.credits : 0);
    }
  };

  useEffect(() => {
    fetchCredits();
    // eslint-disable-next-line
  }, [user?.email]);

  const handleRazorpayPayment = async (plan) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }
    setPaying(true);
    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: plan.priceINR * 100, // amount in paise
        currency: "INR",
        name: "AI Interview Platform",
        description: `${plan.name} Plan - ${plan.credits} interviews`,
        handler: async function (response) {
          try {
            const result = await fetch("/api/add-credits", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                credits: plan.credits,
                orderId: response.razorpay_payment_id,
                planName: plan.name,
                planPrice: plan.priceUSD,
              }),
            });
            const data = await result.json();
            if (data.success) {
              toast.success("Credits added successfully!");
              setSelectedPlan(null);
              await fetchCredits();
            } else {
              toast.error("Failed to add credits");
            }
          } catch (error) {
            console.error("Error adding credits:", error);
            toast.error("Failed to add credits");
          }
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
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment");
    }
    setPaying(false);
  };

  const handleAddCreditsClick = () => {
    setSelectedPlan(null);
    if (purchaseRef.current) {
      purchaseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-start py-12 px-4">
        <h1 className="text-3xl font-bold mb-1">Billing</h1>
        <p className="text-gray-500 mb-8">Manage your Payment and credits</p>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
          {/* Credits Card */}
          <div className="flex-1 bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center min-h-[350px]">
            <span className="text-2xl font-bold text-blue-700 mb-2">
              {loading ? "Loading..." : `${credits} interviews left`}
            </span>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={handleAddCreditsClick}
            >
              + Add More Credits
            </button>
          </div>
          {/* Purchase Credits Card */}
          <div
            ref={purchaseRef}
            className="flex-1 bg-white rounded-xl shadow p-8"
          >
            <h2 className="text-lg font-semibold mb-4">Purchase Credits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`border ${
                    selectedPlan?.name === plan.name
                      ? "border-blue-600 shadow-md"
                      : ""
                  } rounded-lg p-4 flex flex-col items-center`}
                >
                  <span className="font-bold text-lg">{plan.name}</span>
                  <span className="text-2xl font-bold text-blue-700 mt-2">
                    ₹{plan.priceINR}
                  </span>
                  <span className="text-gray-500 mb-2">
                    {plan.credits} interviews
                  </span>
                  <ul className="text-sm text-gray-600 mb-4">
                    {plan.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                  <button
                    className={`px-4 py-2 rounded font-semibold mb-2 ${
                      selectedPlan?.name === plan.name
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-700"
                    } ${
                      paying && selectedPlan?.name === plan.name
                        ? "cursor-not-allowed"
                        : "hover:bg-blue-200"
                    }`}
                    onClick={() => handleRazorpayPayment(plan)}
                    disabled={paying && selectedPlan?.name === plan.name}
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
