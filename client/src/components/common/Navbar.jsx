import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          LawSetu
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
              {user.name} ({user.role})
            </span>
          )}

          <ThemeToggle />

          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
