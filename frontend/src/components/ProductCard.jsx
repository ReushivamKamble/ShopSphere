import { toast } from "react-hot-toast";
import API from "../services/api";

function ProductCard({ product }) {
  const addToCart = async () => {
    try {
      await API.post(
        "/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1b1b1b] border border-[#2A2A2A] shadow-lg rounded-2xl p-5 hover:shadow-2xl transition">

      <h2 className="text-lg font-semibold text-[#F6EDEE] line-clamp-1">
        {product.name}
      </h2>

      <p className="text-[#A13D63] font-bold text-xl mt-3">
        ₹{product.price}
      </p>

      <p className="text-sm text-[#d8c7cc] mt-3 line-clamp-3">
        {product.description}
      </p>

      <button
        onClick={addToCart}
        className="mt-5 w-full bg-[#A13D63] text-[#F6EDEE] px-4 py-3 rounded-xl hover:bg-[#7A284B] transition font-medium"
      >
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;