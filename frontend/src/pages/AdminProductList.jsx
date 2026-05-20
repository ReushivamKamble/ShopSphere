import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { toast } from "react-hot-toast";

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PRODUCTS
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

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#141414]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold mb-8 text-[#F6EDEE]">
            Admin Product List
          </h1>

          {loading ? (
            <div className="text-center py-10 text-lg text-[#c89ab0]">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-lg text-[#c89ab0]">
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto bg-[#1c1c1c] border border-[#2A2A2A] shadow-xl rounded-2xl">
              <table className="w-full text-left min-w-[900px]">
                {/* HEADER */}
                <thead className="bg-[#141414] border-b border-[#2A2A2A]">
                  <tr>
                    <th className="p-4 text-[#F6EDEE]">Image</th>
                    <th className="p-4 text-[#F6EDEE]">Name</th>
                    <th className="p-4 text-[#F6EDEE]">Price</th>
                    <th className="p-4 text-[#F6EDEE]">Category</th>
                    <th className="p-4 text-[#F6EDEE]">Stock</th>
                    <th className="p-4 text-right text-[#F6EDEE]">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-[#2A2A2A] hover:bg-[#181818] transition"
                    >
                      {/* IMAGE */}
                      <td className="p-4">
                        <div className="w-20 h-20 bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex items-center justify-center">
                          <img
                            src={
                              product.image ||
                              "https://via.placeholder.com/150?text=No+Image"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                        </div>
                      </td>

                      {/* NAME */}
                      <td className="p-4 font-medium max-w-[220px] text-[#F6EDEE]">
                        {product.name}
                      </td>

                      {/* PRICE */}
                      <td className="p-4 text-[#A13D63] font-semibold">
                        ₹{product.price}
                      </td>

                      {/* CATEGORY */}
                      <td className="p-4 text-[#c89ab0]">
                        {product.category}
                      </td>

                      {/* STOCK */}
                      <td className="p-4 text-[#c89ab0]">
                        {product.stock}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right space-x-2">
                        <button
                          className="px-4 py-2 bg-[#A13D63] text-[#F6EDEE] rounded-lg hover:bg-[#7A284B] transition"
                          onClick={() =>
                            toast("Edit feature integrated in Admin Dashboard")
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="px-4 py-2 bg-[#7A284B] text-[#F6EDEE] rounded-lg hover:bg-[#A13D63] transition"
                          onClick={() =>
                            deleteProduct(product._id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminProductList;