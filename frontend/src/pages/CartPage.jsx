import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { toast } from "react-hot-toast";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCartItems(
        res.data.data ||
        res.data.cartItems ||
        res.data ||
        []
      );
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Item removed");
      fetchCart();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const updateQty = async (id, qty) => {
    if (qty <= 0) return;

    try {
      await API.put(
        `/cart/${id}`,
        { quantity: qty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchCart();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleCheckout = async () => {
    try {
      await API.post(
        "/orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold text-[#F6EDEE] mb-8">
          Your Cart
        </h1>

        {!loading && cartItems.length === 0 && (
          <div className="text-center text-[#c89ab0] py-20">
            Your cart is empty 🛒
          </div>
        )}

        {loading ? (
          <p className="text-[#c89ab0]">Loading cart...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-5">

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#1c1c1c] border border-[#2A2A2A] rounded-2xl p-8 min-h-[270px] flex items-center shadow-sm"
                >
                  <div className="w-full flex items-center justify-between">

                    <div className="flex items-center gap-5">

                      <img
                        src={
                          item.product?.image ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.product?.name}
                        className="w-24 h-24 object-cover rounded-xl border border-[#2A2A2A]"
                      />

                      <div>
                        <h2 className="font-semibold text-2xl text-[#F6EDEE]">
                          {item.product?.name}
                        </h2>

                        <p className="text-lg text-[#c89ab0] mt-1">
                          ₹{item.product?.price}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-3 bg-[#141414] border border-[#2A2A2A] px-5 py-4 rounded-xl">

                      <button
                        onClick={() =>
                          updateQty(item._id, item.quantity - 1)
                        }
                        className="text-2xl px-2 text-[#F6EDEE] hover:text-[#A13D63]"
                      >
                        -
                      </button>

                      <span className="font-medium text-xl text-[#F6EDEE] px-2">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(item._id, item.quantity + 1)
                        }
                        className="text-2xl px-2 text-[#F6EDEE] hover:text-[#A13D63]"
                      >
                        +
                      </button>

                    </div>

                    <div className="text-right">
                      <p className="font-bold text-2xl text-[#F6EDEE]">
                        ₹
                        {(item.product?.price || 0) *
                          item.quantity}
                      </p>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-lg text-[#A13D63] mt-3 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                </div>
              ))}

            </div>

            {/* RIGHT SIDE */}
            {cartItems.length > 0 && (
              <div className="bg-[#1c1c1c] border border-[#2A2A2A] rounded-2xl p-8 min-h-[270px] shadow-sm flex flex-col justify-between">

                <div>
                  <h2 className="text-2xl font-bold text-[#F6EDEE] mb-8">
                    Order Summary
                  </h2>

                  <div className="flex justify-between mb-5 text-white text-lg">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-between mb-8 text-white text-lg">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="border-t border-[#2A2A2A] pt-6 flex justify-between font-bold text-3xl text-[#F6EDEE]">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-8 bg-[#A13D63] text-[#F6EDEE] py-4 rounded-xl text-xl hover:bg-[#7A284B] transition"
                >
                  Checkout
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default CartPage;