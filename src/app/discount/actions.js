
"use server"
import connect from "@/lib/mongo";
import User from "@/lib/models/User";

/**
 * Update or add a discount object for a specific user and serviceId.
 *
 * @param {string} userId - The user _id
 * @param {string|number} serviceId - The service ID
 * @param {number} discountValue - The discount percentage (1-100)
 * @returns {Promise<Object>} Updated user document
 */
export async function setUserDiscount(userId, serviceId, discountValue) {
    if (!userId || !serviceId) throw new Error("Missing userId or serviceId");
    if (typeof discountValue !== "number" || discountValue < 1 || discountValue > 100) {
      throw new Error("Discount must be a number between 1 and 100");
    }
  
    await connect();
  
    // Use lean() to avoid Mongoose document instances and circular refs
    const user = await User.findById(userId).lean();
    if (!user) throw new Error("User not found");
  
    // Since we used lean(), user is a plain object, so you can't call save() here
    // So instead, update directly using findByIdAndUpdate:
  
    let discount = user.discount || [];
  
    const existingDiscountIndex = discount.findIndex(d => d.serviceId.toString() === serviceId.toString());
  
    if (existingDiscountIndex !== -1) {
      discount[existingDiscountIndex].discount = discountValue;
    } else {
      discount.push({ serviceId, discount: discountValue });
    }
  
    // Update in DB and return the updated user as plain object
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { discount },
      { new: true, lean: true }
    );
  
    return {
      _id: updatedUser._id.toString(),
      discount: updatedUser.discount,
    };
  }