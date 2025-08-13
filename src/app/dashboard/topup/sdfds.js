"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaWallet } from "react-icons/fa";
import { createTopUpAction, verifyTopUpAction } from "./actions";
import { getWalletFromToken } from "../actions"; // adjust path if needed
import { toast } from "react-toastify";
import { getProfileAction  } from "../profile/actions";


const  TOPUP = () => {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfileAction().then(setUser).catch(console.error);
  }, []);

let isLoggedIn = true ;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

 
  useEffect(() => {
    async function fetchWallet() {
      if (true) {
        setWallet(null);
        return;
      }
      try {
        const walletData = await getWalletFromToken(token);
        setWallet(walletData);
      } catch (error) {
        console.log("Error fetching wallet:", error);
        toast.error("Failed to fetch wallet balance.");
      }
    }

    if (isLoggedIn) {
      fetchWallet();
    }
  }, [ isLoggedIn]);

  const topUpWallet = async (amount) => {
    try {
      const { orderId } = await createTopUpAction({ amount });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "Brezora",
        description: "ADD ZORA COINS",
        order_id: orderId,
        handler: verifyPayment,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err.message);
      toast.error(err.message || "Failed to create order");
    }
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      const res = await verifyTopUpAction(paymentResponse);

      if (res.success) {
        toast.success("Payment successful, wallet updated!");
        // Refresh wallet balance after successful payment
        if (token) {
          const updatedWallet = await getWalletFromToken(token);
          setWallet(updatedWallet);
        }
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error verifying payment");
    }
  };

  const onSubmit = async (data) => {
    const amount = parseInt(data.amount, 10);

    setLoading(true);
    try {
      await topUpWallet(amount);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-md p-6 rounded-lg bg-white border border-gray-200 shadow-md">
        {isLoggedIn ? (
          <>
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-100 rounded">
              <div className="flex items-center gap-2">
                <FaWallet className="text-2xl text-indigo-600" />
                <span className="text-lg font-medium text-gray-700">Current Balance:</span>
              </div>
              <span className="text-xl font-bold text-gray-800">₹{wallet?.balance ?? 0}</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Top-Up Wallet</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input
                type="number"
                step="1"
                placeholder="Enter amount (₹1 - ₹5000)"
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={loading}
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 1, message: "Minimum top-up is ₹1" },
                  max: { value: 5000, message: "Maximum top-up is ₹5000" },
                  validate: (value) => {
                    const num = parseFloat(value);
                    if (isNaN(num)) return "Please enter a valid number";
                    if (!Number.isInteger(num)) return "Amount must be a whole number";
                    return true;
                  },
                })}
              />
              {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 transition"
                disabled={loading}
              >
                {loading ? "Processing..." : "Top Up"}
              </button>
            </form>
          </>
        ) : (
          <p className="text-center text-lg font-semibold text-gray-700">Please sign in to top up your wallet.</p>
        )}
      </div>
    </div>
  );
};

export default TOPUP;
