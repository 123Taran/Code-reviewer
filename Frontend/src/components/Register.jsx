import React, { useState, useEffect } from "react";
import { generateAvatar } from "../utils/generateAvatar"; // adjust path

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  useEffect(() => {
    // Generate 6 random avatars on component mount
    const generated = generateAvatar();
    setAvatars(generated);
    // Auto-select the first avatar
    setSelectedAvatar(generated[0]);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    const newUser = {
      username,
      password,
      icon: selectedAvatar,
    };

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      // Optionally you can get user data back from server
      // const data = await res.json();

      // Redirect to login page after successful registration
      window.location.href = "/login";
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
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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

        <div style={{ marginBottom: 12 }}>
          <label>Select Your Avatar</label>
          <div style={{ display: "flex", gap: "8px", marginTop: 8 }}>
            {avatars.map((avatarUrl, idx) => (
              <img
                key={idx}
                src={avatarUrl}
                alt={`Avatar ${idx + 1}`}
                onClick={() => setSelectedAvatar(avatarUrl)}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  border:
                    selectedAvatar === avatarUrl
                      ? "3px solid blue"
                      : "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}

        <button type="submit" style={{ padding: "8px 16px" }}>
          Register
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Already have an account? <a href="/login">Log in here</a>
      </p>
    </div>
  );
}

export default Register;
