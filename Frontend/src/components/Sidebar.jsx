import React from "react";

function Sidebar({ isOpen, files = [], onFileClick, onSaveFile }) {
  // onSaveFile will be a function to save current editor content

  return (
    <div
      style={{
        width: isOpen ? 250 : 0,
        transition: "width 0.3s",
        overflowX: "hidden",
        borderRight: "1px solid #ddd",
        backgroundColor: "#f5f5f5",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        paddingTop: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {isOpen && (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, flexGrow: 1, overflowY: "auto" }}>
            {files.length === 0 && <li style={{ padding: 16 }}>No files</li>}
            {files.map((file) => (
              <li
                key={file._id}
                onClick={() => onFileClick(file._id)}
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  userSelect: "none",
                }}
              >
                {file.name}
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              const filename = prompt("Enter file name to save:");
              if (filename) {
                onSaveFile(filename);
              }
            }}
            style={{
              margin: 12,
              padding: "10px 15px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
            }}
          >
            + Save File
          </button>
        </>
      )}
    </div>
  );
}

export default Sidebar;
