import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">

      {/* REGISTER CARD */}
      <div className="w-full max-w-md">

        <div className="bg-[#1b1b1b] border border-[#2A2A2A] shadow-2xl rounded-2xl p-8">

          {/* BRAND */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#F6EDEE] tracking-tight">
              ShopSphere
            </h1>

            <p className="text-[#d8c7cc] mt-2">
              Premium shopping experience
            </p>
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-center text-[#F6EDEE] mb-6">
            Create Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-[#d8c7cc] mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-3 bg-[#141414] border border-[#2A2A2A] text-[#F6EDEE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A13D63]"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-[#d8c7cc] mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 bg-[#141414] border border-[#2A2A2A] text-[#F6EDEE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A13D63]"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-[#d8c7cc] mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full p-3 bg-[#141414] border border-[#2A2A2A] text-[#F6EDEE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A13D63]"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A13D63] text-[#F6EDEE] py-3 rounded-xl font-semibold hover:bg-[#7A284B] transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Register"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center border-t border-[#2A2A2A] pt-5">
            <p className="text-sm text-[#d8c7cc]">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#A13D63] font-semibold cursor-pointer hover:text-[#F6EDEE] transition"
              >
                Login
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RegisterPage;