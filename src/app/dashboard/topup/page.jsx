
"use client"
import React, { useState , useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { getWalletFromToken } from "../actions";
import { getProfileAction  } from "../profile/actions";
import { FaWallet } from "react-icons/fa";
import { useWallet } from "@/app/context/walletContext"; 
const BASE_URL = '/api/razorpay'; 


const TopUpWallet = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
 const { wallet, setWallet } = useWallet(); // Use global wallet state
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
 let isLoggedIn = true;


  useEffect(() => {
    getProfileAction().then(setUser).catch(console.error);
  }, []);


   // Fetch wallet from API and update context
  const fetchWallet = async () => {
    try {
      const walletData = await getWalletFromToken();
      setWallet(walletData); // update global wallet
    } catch (error) {
      console.log("Error fetching wallet:", error);
    }
  };

  
  useEffect(() => {

    if (isLoggedIn) {
      fetchWallet();
    }
  }, [ isLoggedIn ,wallet]);


  const verifyPayment = async (paymentResponse) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/verify-payment`,
        { ...paymentResponse, userId: user.id },
      );
      if (res.data.success) {
        fetchWallet(); 
      } else {
      }
    } catch (err) {
      console.error(err);
    }
  };

  const topUpWallet = async (amount) => {
    
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/create-order`,
        { amount, userId: user._id },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { orderId } = res.data;
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

      const options = {
        key,
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
      console.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    const amount = parseInt(data.amount, 10);
    topUpWallet(amount);
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

export default TopUpWallet;
