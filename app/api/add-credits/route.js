import { supabase } from "@/services/supabaseClient";

export async function POST(req) {
  const { email, credits, orderId, planName, planPrice } = await req.json();

  // Fetch current credits and user id
  const { data: user, error: userError } = await supabase
    .from("Users")
    .select("id, credits")
    .eq("email", email)
    .single();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  // Default credits is 10 if null or undefined
  const currentCredits = typeof user.credits === "number" ? user.credits : 10;

  // Update credits
  const { error: updateError } = await supabase
    .from("Users")
    .update({ credits: currentCredits + credits })
    .eq("email", email);

  if (updateError) {
    return new Response(JSON.stringify({ error: "Failed to update credits" }), { status: 500 });
  }

  // Log payment info in Payments table with user_id foreign key
  await supabase.from("Payments").insert([
    {
      user_id: user.id,
      user_email: email,
      order_id: orderId,
      plan_name: planName,
      plan_price: planPrice,
      credits,
      created_at: new Date().toISOString(),
    },
  ]);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 