import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const token =
        res.data.token ||
        res.data.data?.token ||
        res.data.data?.accessToken ||
        res.data.accessToken;

      if (!token) {
        toast.error("Login failed: No token received");
        return;
      }

      localStorage.setItem("token", token);

      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">

      {/* LOGIN CARD */}
      <div className="w-full max-w-md">

        <div className="bg-[#1c1c1c] border border-[#2A2A2A] shadow-2xl rounded-2xl p-8">

          {/* BRAND */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#F6EDEE] tracking-tight">
              ShopSphere
            </h1>

            <p className="text-[#c89ab0] mt-2">
              Premium shopping experience
            </p>
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-center text-[#F6EDEE] mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-[#c89ab0] mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-[#2A2A2A] rounded-xl bg-[#141414] text-[#F6EDEE] placeholder-[#8a8a8a] focus:outline-none focus:ring-2 focus:ring-[#A13D63]"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-[#c89ab0] mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-[#2A2A2A] rounded-xl bg-[#141414] text-[#F6EDEE] placeholder-[#8a8a8a] focus:outline-none focus:ring-2 focus:ring-[#A13D63]"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A13D63] text-[#F6EDEE] py-3 rounded-xl font-semibold hover:bg-[#7A284B] transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center border-t border-[#2A2A2A] pt-5">
            <p className="text-sm text-[#c89ab0]">
              New here?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-[#F6EDEE] font-semibold cursor-pointer hover:text-[#A13D63] hover:underline"
              >
                Create account
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;