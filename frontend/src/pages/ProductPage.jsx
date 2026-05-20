import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { toast } from "react-hot-toast";

function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH PRODUCT
  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch (error) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // ADD TO CART
  const addToCart = async () => {
    try {
      await API.post(
        "/cart",
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Added to cart");
    } catch (error) {
      toast.error("Login required or failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#141414] text-[#F6EDEE]">
          Loading product...
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#141414] text-[#F6EDEE]">
          Product not found
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#1c1c1c] border border-[#2A2A2A] rounded-3xl shadow-lg overflow-hidden">

          {/* IMAGE SECTION */}
          <div className="bg-[#141414] flex items-center justify-center p-8">
            <img
              src={product.image || "https://via.placeholder.com/600"}
              alt={product.name}
              className="max-h-[500px] w-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/600?text=No+Image";
              }}
            />
          </div>

          {/* DETAILS SECTION */}
          <div className="p-8 flex flex-col justify-center">

            <p className="text-sm uppercase tracking-widest text-[#c89ab0] mb-2">
              {product.category}
            </p>

            <h1 className="text-4xl font-bold text-[#F6EDEE] mb-4">
              {product.name}
            </h1>

            <p className="text-[#c89ab0] text-lg leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="text-3xl font-bold text-[#A13D63] mb-2">
              ₹{product.price}
            </div>

            <p className="text-sm text-[#c89ab0] mb-8">
              Stock Available: {product.stock}
            </p>

            <button
              onClick={addToCart}
              className="bg-[#A13D63] text-[#F6EDEE] px-6 py-4 rounded-xl text-lg hover:bg-[#7A284B] transition"
            >
              Add to Cart
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductPage;