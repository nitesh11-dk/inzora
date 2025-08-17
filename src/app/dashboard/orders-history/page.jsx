"use client"
import { useEffect, useState } from "react";
import { FiRefreshCw, FiCheck } from "react-icons/fi";
import LoadingState from "@/components/LodingState";
const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [refreshingOrderId, setRefreshingOrderId] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  async function fetchAllOrders() {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const handleCopyToClipboard = async (text, itemType, itemId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(`${itemType}-${itemId}`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };


   // ⏳ If data is still loading
    if (isLoading) {
      return <LoadingState text="Loading Orders ..." />;
    }

  return (
    <div className="p-6 bg-gray-50 text-center w-full min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Orders</h2>

      {!isLoading && orders && orders.length > 0 ? (
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="px-4 py-2 border">Order ID </th>
                <th className="px-4 py-2 border">Platform Service</th>
                <th className="px-4 py-2 border">Link</th>
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
                    <td className="px-4 py-2 border">
                      <div className="flex items-center justify-center gap-2">
                        <span 
                          className="cursor-pointer hover:text-blue-600"
                          onClick={() => handleCopyToClipboard(order.actualOrderIdFromApi, 'orderId', order._id)}
                        >
                          {order.actualOrderIdFromApi || "-"}
                        </span>
                        {copiedItem === `orderId-${order._id}` && (
                          <FiCheck className="text-green-500 text-sm" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 border">{order.platformService || "-"}</td>
                    <td className="px-4 py-2 border">
                      {order.link ? (
                        <div className="flex items-center justify-center gap-2">
                          <a 
                            href={order.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 underline truncate block max-w-xs"
                            onClick={() => handleCopyToClipboard(order.link, 'link', order._id)}
                          >
                            {order.link.length > 30 ? order.link.substring(0, 30) + '...' : order.link}
                          </a>
                          {copiedItem === `link-${order._id}` && (
                            <FiCheck className="text-green-500 text-sm" />
                          )}
                        </div>
                      ) : "-"}
                    </td>
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
      ) : !isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-700 text-lg">No orders found.</p>
          <p className="text-gray-500 text-sm mt-2">You haven't placed any orders yet.</p>
        </div>
      ) : null}

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {!isLoading && orders && orders.length > 0 ? (
          orders.map((order) => {
            const isCompleted = order.status?.toLowerCase() === "completed";
            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 text-gray-800 rounded-lg shadow-sm p-4 text-sm"
              >
                <p className="mb-1">
                  <span className="font-semibold">Order ID (API):</span> 
                  <div className="flex items-center gap-2">
                    <span 
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => handleCopyToClipboard(order.actualOrderIdFromApi, 'orderId', order._id)}
                    >
                      {order.actualOrderIdFromApi || "-"}
                    </span>
                    {copiedItem === `orderId-${order._id}` && (
                      <FiCheck className="text-green-500 text-sm" />
                    )}
                  </div>
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Platform Service:</span> {order.platformService || "-"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Link:</span> 
                  <div className="flex items-center gap-2">
                    {order.link ? (
                      <a 
                        href={order.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                        onClick={() => handleCopyToClipboard(order.link, 'link', order._id)}
                      >
                        {order.link}
                      </a>
                    ) : "-"}
                    {copiedItem === `link-${order._id}` && (
                      <FiCheck className="text-green-500 text-sm" />
                    )}
                  </div>
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
        ) : !isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-700 text-lg">No orders found.</p>
            <p className="text-gray-500 text-sm mt-2">You haven't placed any orders yet.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrdersHistory;
