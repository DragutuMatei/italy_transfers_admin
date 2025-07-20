import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

function Sidebar() {
  const { user, loading, signUserOut } = useAuth();
  return (
    <div className="sidebar">
      <div className="sidebar-title">
        {user && (
          <img src={user.photoURL} alt="" style={{ borderRadius: "50%" }} />
        )}
        <p style={{ fontSize: 17, fontWeight: 500 }}>{user.email}</p>
        <h2 className="sidebar-title">Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/contact" className="nav-link">
          Contact
        </NavLink>
        <NavLink to="/testimonials" className="nav-link">
          Testimonials
        </NavLink>
        <button className="btn delete" onClick={signUserOut}>
          Logout    
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
