import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || data.message || "Login failed");
      }

      const userData = await res.json();
      console.log("Login response:", userData);

      if (userData.token) {
        localStorage.setItem("token", userData.token);
      } else {
        console.warn("Token not found in response!");
      }

      // Store user info if needed
      localStorage.setItem(
        "user",
        JSON.stringify({ username: userData.username, icon: userData.icon })
      );

      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

        <button type="submit" style={{ padding: "8px 16px" }}>
          Log In
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
