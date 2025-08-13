import { getUserTopUpOrders } from "./actions";

const TopUPHistory = async () => {
  // Server-side fetch
  let orders = [];

  try {
    const response = await getUserTopUpOrders();
    orders = response.orders;
  } catch (error) {
    console.error("Failed to load top-up history:", error);
  }

  return (
    <div className="p-6 w-full text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Top UP History</h2>

      {orders && orders.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-gray-800">
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id} className="text-center text-gray-800">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border capitalize">
                      {order.status}
                    </td>
                    <td className="px-4 py-2 border">₹{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-gray-800"
              >
                <p className="mb-1">
                  <span className="font-semibold">#:</span> {index + 1}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="capitalize">{order.status}</span>
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> ₹{order.amount}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600 ">No orders found.</p>
      )}
    </div>
  );
};

export default TopUPHistory;
