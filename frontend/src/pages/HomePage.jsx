import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { toast } from "react-hot-toast";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      await API.post(
        "/cart",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Added to cart");
    } catch (error) {
      toast.error("Login required or error");
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="bg-[#141414] min-h-screen">
      <Navbar />

      {/* HERO */}
      <div className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#7A284B] to-[#141414]" />

        <div className="relative max-w-6xl mx-auto text-center text-[#F6EDEE]">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5">
            Shop Smarter, Live Better
          </h1>

          <p className="text-[#d8b8c6] text-lg md:text-xl mb-8">
            Explore quality products, trusted brands, and exceptional deals — all in one place.
          </p>

          <button className="bg-[#A13D63] text-[#F6EDEE] px-8 py-3 rounded-xl hover:bg-[#7A284B] transition">
            Start Shopping
          </button>
        </div>
      </div>

      {/* CATEGORY STRIP */}
      <div className="max-w-6xl mx-auto px-6 mt-10 flex gap-3 overflow-x-auto pb-2">
        {["All", "Electronics", "Fashion", "Shoes", "Accessories", "Beauty"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium border transition ${
                selectedCategory === cat
                  ? "bg-[#A13D63] text-[#F6EDEE] border-[#A13D63]"
                  : "bg-[#1c1c1c] text-[#F6EDEE] border-[#2A2A2A] hover:bg-[#7A284B]"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* PRODUCTS */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 text-[#F6EDEE]">
          Featured Products
        </h2>

        {loading ? (
          <p className="text-[#b8a8ae]">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-[#b8a8ae]">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-[#1c1c1c] rounded-2xl shadow-md hover:shadow-xl border border-[#2A2A2A] overflow-hidden cursor-pointer"
              >
                {/* IMAGE */}
                <div className="w-full h-56 bg-[#ffffff] flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      product.image ||
                      "https://via.placeholder.com/500?text=No+Image"
                    }
                    alt={product.name}
                    className="max-h-full max-w-full object-contain p-3"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/500?text=No+Image";
                    }}
                  />
                </div>

                {/* DETAILS */}
                <div className="p-4">
                  <p className="text-xs text-[#c89ab0] uppercase">
                    {product.category}
                  </p>

                  <h3 className="font-semibold text-[#F6EDEE] mt-1 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-[#b8a8ae] text-sm line-clamp-2 mt-1">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[#F6EDEE] font-bold text-lg">
                      ₹{product.price}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product._id);
                      }}
                      className="bg-[#A13D63] text-[#F6EDEE] px-3 py-1 rounded-lg text-sm hover:bg-[#7A284B] transition"
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
