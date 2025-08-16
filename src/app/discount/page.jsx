"use client";

import { useState } from "react";
import { setUserDiscount } from "./actions"; 
import { useRouter } from "next/navigation";

function DiscountForm() {
  const [userId, setUserId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [discount, setDiscount] = useState("");
  const [message, setMessage] = useState(null);
  const router = useRouter();

  async function updateDiscount(data) {
    const { userId, serviceId, discount } = data;

    if (!userId || !serviceId || !discount) {
      throw new Error("Missing required fields");
    }

    const discountValue = Number(discount);
    if (isNaN(discountValue)) {
      throw new Error("Discount must be a number");
    }

    const updatedUser = await setUserDiscount(userId, serviceId, discountValue);
    return updatedUser;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await updateDiscount({ userId, serviceId, discount });
      setMessage("✅ Discount updated successfully!");
      setUserId("");
      setServiceId("");
      setDiscount("");
      router.refresh();
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Set User Discount
        </h2>

        {/* User ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            placeholder="Enter user ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Service ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service ID
          </label>
          <input
            type="text"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
            placeholder="Enter service ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            min="1"
            max="100"
            required
            placeholder="Enter discount 1-100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          Update Discount
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm font-medium mt-2 ${
              message.startsWith("✅")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default DiscountForm;
