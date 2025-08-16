"use client"
import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import LoadingState from "@/components/LodingState";
const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
const [refreshingOrderId, setRefreshingOrderId] = useState(null); 

  async function fetchAllOrders() {
    try {
      const res = await fetch('/api/orders', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to fetch orders:', data.error);
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

 
  async function refreshOrderById(actualOrderIdFromApi, createdOrderId) {
    try {
      setRefreshingOrderId(createdOrderId); // start animation
      const res = await fetch(`/api/orders/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actualOrderIdFromApi, createdOrderId })
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to refresh order status:", data.error);
        return;
      }

      console.log("Order refreshed successfully:", data);
      await fetchAllOrders();
    } catch (error) {
      console.error("Error refreshing order:", error);
    } finally {
      setRefreshingOrderId(null); 
    }
  }

  const handleRefresh = async (actualOrderIdFromApi, createdOrderId) => {
    await refreshOrderById(actualOrderIdFromApi, createdOrderId);
  };


   // ⏳ If data not loaded / empty
    if (!orders || orders.length === 0) {
      return <LoadingState text="Loading Orders ..." />;
    }

  return (
    <div className="p-6 bg-gray-50 text-center w-full min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Orders</h2>

      {orders && orders.length > 0 ? (
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="px-4 py-2 border">Order ID </th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Start Count</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Remains</th>
                <th className="px-4 py-2 border">Refresh</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isCompleted = order.status?.toLowerCase() === "completed";
                return (
                  <tr key={order._id} className="text-center text-gray-800">
                    <td className="px-4 py-2 border">{order.actualOrderIdFromApi || "-"}</td>
                    <td className="px-4 py-2 border">₹{order.price}</td>
                    <td className="px-4 py-2 border">{order.quantity}</td>
                    <td className="px-4 py-2 border">{order.startCount || "-"}</td>
                    <td className="px-4 py-2 border capitalize">{order.status}</td>
                    <td className="px-4 py-2 border">{order.remains || "-"}</td>
                    <td className="px-4 py-2 border">
                       <button
    onClick={() => handleRefresh(order.actualOrderIdFromApi, order._id)}
    className={`text-indigo-600 hover:text-indigo-800 ${
      isCompleted ? "opacity-50 cursor-not-allowed" : ""
    }`}
    title={isCompleted ? "Completed" : "Refresh Order Status"}
    disabled={isCompleted}
  >
    <FiRefreshCw
      size={18}
      className={refreshingOrderId === order._id ? "animate-spin" : ""}
    />
  </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-700">No orders found.</p>
      )}

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => {
            const isCompleted = order.status?.toLowerCase() === "completed";
            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 text-gray-800 rounded-lg shadow-sm p-4 text-sm"
              >
                <p className="mb-1">
                  <span className="font-semibold">Order ID (API):</span> {order.actualOrderIdFromApi || "-"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Price:</span> ₹{order.price}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Quantity:</span> {order.quantity}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Start Count:</span> {order.startCount || "-"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Status:</span> <span className="capitalize">{order.status}</span>
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Remains:</span> {order.remains || "-"}
                </p>
                <button
    onClick={() => handleRefresh(order.actualOrderIdFromApi, order._id)}
    className={`text-indigo-600 hover:text-indigo-800 ${
      isCompleted ? "opacity-50 cursor-not-allowed" : ""
    }`}
    title={isCompleted ? "Completed" : "Refresh Order Status"}
    disabled={isCompleted}
  >
    <FiRefreshCw
      size={18}
      className={refreshingOrderId === order._id ? "animate-spin" : ""}
    />
  </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-700">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;
