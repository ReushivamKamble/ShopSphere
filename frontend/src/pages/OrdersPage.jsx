import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { toast } from "react-hot-toast";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(res.data.data || []);
    } catch (error) {
      console.log("ORDERS FETCH ERROR:", error.response?.data || error.message);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-[#141414] min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-[#F6EDEE] mb-8">
          Your Orders
        </h1>

        {loading ? (
          <div className="text-[#c89ab0] text-center py-20">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-[#c89ab0] text-center py-20">
            No orders placed yet 📦
          </div>
        ) : (
          <div className="space-y-8">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#1c1c1c] border border-[#2A2A2A] rounded-2xl shadow-md p-6"
              >

                {/* ORDER HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-[#2A2A2A] pb-4 mb-6 gap-4">

                  <div className="min-w-0">
                    <p className="font-semibold text-[#F6EDEE] break-all">
                      Order ID: {order._id}
                    </p>

                    <p className="text-sm text-[#c89ab0] mt-1">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* STATUS BADGE */}
                  <div>
                    <span className="bg-[#A13D63] text-[#F6EDEE] px-4 py-2 rounded-full text-sm font-medium">
                      {order.status}
                    </span>
                  </div>

                </div>

                {/* ORDER ITEMS */}
                <div className="space-y-4">

                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[#2A2A2A] rounded-2xl p-4 hover:shadow-md hover:bg-[#181818] transition"
                    >

                      {/* PRODUCT INFO */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">

                        <div className="w-24 h-24 bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img
                            src={
                              item.product?.image ||
                              "https://via.placeholder.com/300?text=No+Image"
                            }
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/300?text=No+Image";
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <h2 className="font-semibold text-[#F6EDEE] text-lg truncate">
                            {item.product?.name || "Product unavailable"}
                          </h2>

                          <p className="text-[#c89ab0]">
                            ₹{item.product?.price || 0}
                          </p>

                          <p className="text-sm text-[#c89ab0]">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                      </div>

                      {/* ITEM TOTAL */}
                      <div className="font-bold text-xl text-[#A13D63] text-right">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </div>

                    </div>
                  ))}

                </div>

                {/* TOTAL */}
                <div className="border-t border-[#2A2A2A] pt-6 mt-6 flex justify-end">
                  <h2 className="text-2xl font-bold text-[#F6EDEE]">
                    Total Amount: ₹{order.totalPrice}
                  </h2>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default OrdersPage;