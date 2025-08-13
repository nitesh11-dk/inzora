"use client";

import { useState } from "react";
import { setUserDiscount } from "./actions"; // import server action
import { useRouter } from "next/navigation";

 function DiscountForm() {

  // const userId = "689c1502eba5f60ca5fef873" ;
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
      setMessage("Discount updated successfully!");
      // Optionally refresh data or redirect
      router.refresh(); // refresh current page data
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Set User Discount</h2>

      <label>
        Service ID:
        <input
          type="text"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          required
          placeholder="Enter service ID"
        />
      </label>

      <label>
        Discount (%):
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          min="1"
          max="100"
          required
          placeholder="Enter discount 1-100"
        />
      </label>

      <button type="submit">Update Discount</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default DiscountForm;