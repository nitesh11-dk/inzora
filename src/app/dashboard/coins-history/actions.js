import { getUserFromCookies } from "@/lib/auth";
import Payment from "@/lib/models/Payment"; // 

export async function getUserTopUpOrders() {
  // Get logged-in user from cookie token
  const user = await getUserFromCookies();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const orders = await Payment.find({ userId: user.id }).sort({ createdAt: -1 });

    return {
      success: true,
      orders,
    };
  } catch (err) {
    console.error("Razorpay getUserTopUpOrders error:", err);
    throw new Error("Failed to fetch user top-up orders.");
  }
}
