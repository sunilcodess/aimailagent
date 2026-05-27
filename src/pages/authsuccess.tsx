import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. URL se data nikalna
    const params = new URLSearchParams(window.location.search);
    const userData = params.get("user");

    if (userData) {
      try {
        // 2. Data is save
        localStorage.setItem("user", userData);
        // 3. send to dashboard with page refresh
        window.location.href = "/";
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Logging you in...</h2>
        <p className="text-slate-400">
          Please wait while we redirect you to your dashboard.
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
