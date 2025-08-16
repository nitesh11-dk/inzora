"use server"

import { cookies } from "next/headers";
import { getUserFromToken ,getUserFromCookies } from "@/lib/auth";
import Wallet from "@/lib/models/Wallet";
import User from "@/lib/models/User";
import connect from "@/lib/mongo";
import PlatformService from "@/lib/models/Service";



export async function getWalletFromToken() {
  const cookiesList = await cookies();
  const token = cookiesList.get('token')?.value;
  await connect();
  
  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const user = await getUserFromToken(token);
  if (!user || !user.id) {
    throw new Error("Unauthorized: Invalid token");
  }

  const wallet = await Wallet.findOne({ userId: user.id });
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  return { balance: wallet.balance };
}


// Helper: recursively convert Mongoose ObjectIds (and nested docs) into plain JSON
function cleanDoc(doc) {
  if (Array.isArray(doc)) {
    return doc.map(cleanDoc);
  } else if (doc && typeof doc === "object") {
    const newObj = {};
    for (const [key, value] of Object.entries(doc)) {
      if (key === "_id" || key.endsWith("Id")) {
        newObj[key] = value?.toString();
      } else {
        newObj[key] = cleanDoc(value);
      }
    }
    return newObj;
  }
  return doc;
}


export async function getDiscountedServicesByPlatform(platform) {
  const currUser = await getUserFromCookies();

  if (!currUser || !currUser.id) {
    throw new Error("Unauthorized: Invalid token");
  }

  const userId = currUser.id;
  if (!platform) throw new Error("Platform name is required.");
  if (!userId) throw new Error("User ID is required.");

  await connect();

  // Fetch user with discounts
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found.");

  // Fetch platform services
  const platformDoc = await PlatformService.findOne({
    name: platform.toLowerCase(),
  }).lean();
  if (!platformDoc) throw new Error("Platform services not found.");

  const categories = {};

  for (const [categoryName, services] of Object.entries(platformDoc.categories)) {
    categories[categoryName] = services.map((service) => {
      const discountObj = user.discount.find(
        (d) => d.serviceId.toString() === service.service.toString()
      );

      const discountApplied = discountObj ? discountObj.discount : null;

      return {
        ...cleanDoc(service), // ✅ ensures service._id and service.service are strings
        discountApplied,
      };
    });
  }

  // ✅ clean entire doc before returning
  return cleanDoc({
    ...platformDoc,
    categories,
  });
}

export const getAllServices = async () => {
  try {
    const services = await PlatformService.find({}, 'name image description').lean();
    await connect();
    // Convert _id to string for each service
    const plainServices = services.map(service => ({
      ...service,
      _id: service._id.toString(),
    }));

    return {
      success: true,
      data: plainServices,
    };
  } catch (err) {
    console.error("Error fetching all services:", err);
    return {
      success: false,
      message: "Server error.",
    };
  }
};