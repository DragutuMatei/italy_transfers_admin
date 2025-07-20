// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading, signInWithGoogle } = useAuth();

  return loading || (user && user.role === undefined) ? (
    <div className="loading">Se încarcă...</div>
  ) : !user ? (
    <button className="btn accept" onClick={signInWithGoogle}>
      Login cu Google
    </button>
  ) : user.role === "admin" ? (
    <>{children}</>
  ) : (
    <>
      <h1>Nu ai voie aici cu mailul ăsta</h1>
      <button className="btn accept" onClick={signInWithGoogle}>
        Login cu Google
      </button>
    </>
  );
};

export default ProtectedRoute;
