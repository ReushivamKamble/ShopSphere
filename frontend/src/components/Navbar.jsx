import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#141414] border-b border-[#2A2A2A] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* BRAND */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-[#F6EDEE]"
        >
          ShopSphere
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6 text-sm font-medium text-[#F6EDEE]">

          <Link className="hover:text-[#A13D63] transition" to="/">
            Home
          </Link>

          <Link className="hover:text-[#A13D63] transition" to="/cart">
            Cart
          </Link>

          <Link className="hover:text-[#A13D63] transition" to="/orders">
            Orders
          </Link>

          <Link className="hover:text-[#A13D63] transition" to="/admin">
            Admin
          </Link>

          {/* AUTH BUTTON */}
          {token ? (
            <button
              onClick={logout}
              className="bg-[#A13D63] text-[#F6EDEE] px-4 py-2 rounded-lg hover:bg-[#7A284B] transition shadow-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#A13D63] text-[#F6EDEE] px-4 py-2 rounded-lg hover:bg-[#7A284B] transition shadow-sm"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;