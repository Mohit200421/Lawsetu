import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";

import UserDashboard from "./pages/user/UserDashboard";
import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
  if (user.role === "lawyer") return <Navigate to="/lawyer/dashboard" />;

  return <Navigate to="/user/dashboard" />;
};

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {user && <Navbar />}

      <Routes>
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route
          path="/user/dashboard"
          element={
            <RoleRoute role="user">
              <UserDashboard />
            </RoleRoute>
          }
        />

        {/* LAWYER */}
        <Route
          path="/lawyer/dashboard"
          element={
            <RoleRoute role="lawyer">
              <LawyerDashboard />
            </RoleRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
