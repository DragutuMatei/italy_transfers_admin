// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
// import Rides from "./Pages/Rides";
// import Testimonials from "./Pages/Testimonials";
// import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import "./assets/css/main.scss";
import Contact from "./Pages/Contact";
import Sidebar from "./Components/Sidebar";
import Testimonials from "./Pages/Testimonials";
import { useAuth } from "./utils/AuthContext";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

function App() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [admin, setAdmin] = useState(false);
  const check = () => {
    console.log(user);
    if (user && user.role === "admin" && !loading) {
      console.log("Admin access granted");
      setAdmin(true);
    } else {
      setAdmin(false);
      console.log("Access denied or loading");
    }
  };
  function NonAdmin() {
    return (
      <>
        <h1>Nu ai voie aici cu mailul ăsta</h1>
        <button className="btn accept" onClick={signInWithGoogle}>
          Login cu Google
        </button>
      </>
    );
  }

  useEffect(() => {
    check();
  }, [, user, loading]);

  return (
    <BrowserRouter>
      <ToastContainer />

      {admin ? <Sidebar /> : null}
      <Routes>
        <Route path="/" element={admin ? <Home /> : <NonAdmin />} />
        <Route path="/contact" element={admin ? <Contact /> : <NonAdmin />} />
        <Route
          path="/testimonials"
          element={admin ? <Testimonials /> : <NonAdmin />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
