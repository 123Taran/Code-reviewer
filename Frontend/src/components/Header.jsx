import React, { useState, useEffect } from "react";
import { generateAvatar } from "../utils/generateAvatar"; // Adjust the path accordingly

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage on component mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      // Fallback: if no icon, assign a random avatar from DiceBear
      if (!parsedUser.icon) {
        const avatars = generateAvatar();
        parsedUser.icon = avatars[Math.floor(Math.random() * avatars.length)];
      }

      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login"; // redirect to login after logout
  };

  return (
    <div className="header" style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <ul
        style={{
          display: "flex",
          alignItems: "center",
          listStyle: "none",
          gap: "1rem",
          margin: 0,
          padding: 0,
        }}
      >
        {user ? (
          <>
            <li>Hello, {user.username}</li>

            {/* Circle container with user icon or initial */}
            <li>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #333",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ddd",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  color: "#555",
                  userSelect: "none",
                }}
              >
                {user.icon ? (
                  <img
                    src={user.icon}
                    alt="User icon"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
            </li>

            <li>
              <button onClick={handleLogout}>Log Out</button>
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={() => {
                window.location.href = "/login"; // redirect to login page
              }}
            >
              Log In
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Header;
