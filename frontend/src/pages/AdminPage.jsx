import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { toast } from "react-hot-toast";

function AdminPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.data || []);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uploadImage = async () => {
    if (!imageFile) {
      toast.error("Please select an image");
      return null;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data?.imageUrl;
    } catch {
      toast.error("Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = null;

      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) return;
      }

      const payload = {
        ...form,
        image: imageUrl,
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success("Product updated");
      } else {
        await API.post("/products", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success("Product created");
      }

      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
      });

      setImageFile(null);
      setEditingId(null);

      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const editProduct = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
    });

    setEditingId(product._id);
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-[#F6EDEE] mb-8">
          Admin Dashboard
        </h1>

        {/* FORM */}
        <div className="bg-[#1c1c1c] border border-[#2A2A2A] rounded-2xl p-6 shadow-sm mb-10">

          <h2 className="text-xl font-semibold mb-6 text-[#F6EDEE]">
            {editingId ? "Edit Product" : "Create Product"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="p-3 border border-[#2A2A2A] rounded-xl bg-[#141414] text-[#F6EDEE] focus:outline-none focus:ring-1 focus:ring-[#A13D63]"
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="p-3 border border-[#2A2A2A] rounded-xl bg-[#141414] text-[#F6EDEE] focus:outline-none focus:ring-1 focus:ring-[#A13D63]"
            />

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="p-3 border border-[#2A2A2A] rounded-xl bg-[#141414] text-[#F6EDEE] focus:outline-none focus:ring-1 focus:ring-[#A13D63]"
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="p-3 border border-[#2A2A2A] rounded-xl bg-[#141414] text-[#F6EDEE] focus:outline-none focus:ring-1 focus:ring-[#A13D63]"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="p-3 border border-[#2A2A2A] rounded-xl md:col-span-2 bg-[#141414] text-[#F6EDEE] focus:outline-none focus:ring-1 focus:ring-[#A13D63]"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="md:col-span-2 text-[#F6EDEE]"
            />

            <button
              type="submit"
              disabled={uploading}
              className="md:col-span-2 bg-[#A13D63] text-[#F6EDEE] py-3 rounded-xl hover:bg-[#7A284B] transition"
            >
              {uploading
                ? "Uploading..."
                : editingId
                ? "Update Product"
                : "Create Product"}
            </button>

          </form>
        </div>

        {/* TABLE */}
        <div className="bg-[#1c1c1c] border border-[#2A2A2A] rounded-2xl shadow-sm overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-[#141414] text-[#F6EDEE]">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-[#2A2A2A] hover:bg-[#181818]"
                >
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl border border-[#2A2A2A]"
                    />
                  </td>

                  <td className="p-4 font-medium text-[#F6EDEE]">
                    {product.name}
                  </td>

                  <td className="p-4 text-[#F6EDEE] font-semibold">
                    ₹{product.price}
                  </td>

                  <td className="p-4 text-[#c89ab0]">
                    {product.category}
                  </td>

                  <td className="p-4 text-[#c89ab0]">
                    {product.stock}
                  </td>

                  <td className="p-4 text-right space-x-2">

                    <button
                      onClick={() => editProduct(product)}
                      className="px-3 py-1 bg-[#A13D63] text-[#F6EDEE] rounded-lg hover:bg-[#7A284B]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="px-3 py-1 bg-[#7A284B] text-[#F6EDEE] rounded-lg hover:bg-[#A13D63]"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default AdminPage;