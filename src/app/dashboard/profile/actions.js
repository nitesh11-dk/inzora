"use server";

import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongo";
import User from "@/lib/models/User";
import { getUserFromCookies } from "@/lib/auth";

export async function getProfileAction() {
  await connectDB();

    // Get logged-in user from cookie token
    const user = await getUserFromCookies();
    if (!user) {
      throw new Error("Unauthorized");
    }

  // Fetch fresh user data from DB
  const userDoc = await User.findById(user.id).lean();
  if (!userDoc) {
    throw new Error("User not found");
  }

  return JSON.parse(JSON.stringify(userDoc)); // serialize for Next.js
}

export async function editUserAction({ name, email, password }) {
  await connectDB();

  // Get logged-in user
  const user = await getUserFromCookies();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userDoc = await User.findById(user.id);
  if (!userDoc) {
    throw new Error("User not found");
  }

  if (name) userDoc.name = name;
  if (email) userDoc.email = email;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    userDoc.password = hashedPassword;
  }

  await userDoc.save();

  return { success: true, message: "User updated successfully" };
}

// export async function deleteUserAction() {
//   await connectDB();

//   // Get logged-in user id from cookie token
//   const user = await getUserFromCookies();
//   if (!user) {
//     throw new Error("Unauthorized");
//   }

//   // Fetch user from DB
//   const userDoc = await User.findById(user.id);
//   if (!userDoc) {
//     throw new Error("User not found");
//   }

//   // Check wallet balance before deleting
//   const wallet = await Wallet.findOne({ userId: user._id });
//   if (wallet && wallet.balance > 0) {
//     throw new Error(
//       `Cannot delete user. Wallet balance is ₹${wallet.balance}. Please contact admin.`
//     );
//   }

//   // Delete user and wallet (if exists)
//   await User.findByIdAndDelete(user._id);
//   if (wallet) {
//     await Wallet.findByIdAndDelete(wallet._id);
//   }

//   return { success: true, message: "User deleted successfully" };
// }
