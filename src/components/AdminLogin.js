import React, { useState } from "react";
import "./AdminLogin.css";

function AdminLogin() {
  const [data, setData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Admin login credentials
    const adminUser = "root";
    const adminPass = "root";

    if (data.username === adminUser && data.password === adminPass) {
      localStorage.setItem("adminLoggedIn", "true");
      window.location.href = "/admin";
    } else {
      alert("Invalid login details");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        <input type="text" name="username" placeholder="Username"
          value={data.username} onChange={handleChange} required />

        <input type="password" name="password" placeholder="Password"
          value={data.password} onChange={handleChange} required />

        <button type="submit">Login</button>
        <button type="button" onClick={() => window.location.href='/'}>Back</button>
      </form>
    </div>
  );
}

export default AdminLogin;
