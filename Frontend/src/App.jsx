import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-ruby";
import "prismjs/themes/prism-tomorrow.css"; // theme
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const languages = {
  javascript: { id: 63, name: "JavaScript" },
  python: { id: 71, name: "Python" },
  java: { id: 62, name: "Java" },
  c: { id: 50, name: "C" },
  cpp: { id: 54, name: "C++" },
  go: { id: 60, name: "Go" },
  ruby: { id: 72, name: "Ruby" },
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [language, setLanguage] = useState("javascript");
  const [review, setReview] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch saved files for user on mount
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:3000/api/files/my-files", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.error("Failed to load files:", err.response || err.message);
      });
  }, [token]);

  // Load file content into editor when a file is clicked
  async function handleFileClick(fileId) {
    if (!token) {
      alert("You must be logged in to load files.");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:3000/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const file = res.data;
      setCode(file.code);
      setLanguage(file.language);
      setReview("");
      setOutput("");
      setSidebarOpen(false); // Optionally close sidebar on file load
    } catch (err) {
      console.error("Failed to load file:", err.response || err.message);
      alert("Failed to load file.");
    }
  }

  // Save current code as a new file with given name
  async function handleSaveFile(filename) {
    if (!token) {
      alert("You must be logged in to save files.");
      return;
    }
    if (!filename.trim()) {
      alert("Filename cannot be empty.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/files/save",
        {
          name: filename.trim(),
          code,
          language,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update files list with new file
      setFiles((prev) => [res.data.file, ...prev]);
      alert("File saved successfully!");
    } catch (err) {
      console.error("Failed to save file:", err.response || err.message);
      alert("Failed to save file.");
    }
  }

  async function handleCodeReviewAndExecution() {
    setLoading(true);
    setReview("");
    setOutput("");

    try {
      const language_id = languages[language].id;

      const compileResponse = await axios.post(
        "http://localhost:3000/ai/compiler/execute",
        {
          language_id,
          source_code: code,
          stdin: "",
        }
      );

      const { stdout, stderr, compile_output, message, status } =
        compileResponse.data;
      const errorMsg = stderr || compile_output || message;

      if (errorMsg) {
        setOutput(`❌ Error:\n${errorMsg}`);
        const reviewResponse = await axios.post(
          "http://localhost:3000/ai/get-review",
          {
            code,
            language: languages[language].name,
            errorMessage: errorMsg,
          }
        );

        const reviewText =
          typeof reviewResponse.data === "string"
            ? reviewResponse.data
            : reviewResponse.data.review || JSON.stringify(reviewResponse.data, null, 2);

        setReview(reviewText);
      } else if (status?.description === "Accepted") {
        setOutput(stdout || "✅ Code executed, but no output.");
      } else {
        setOutput(`⚠️ Unknown status from compiler. Status: ${status?.description}`);
      }
    } catch (error) {
      console.error("🚨 Error:", error.response?.data || error.message || error);

      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      setOutput(`❌ Error:\n${errorMsg}`);

      try {
        const reviewResponse = await axios.post(
          "http://localhost:3000/ai/get-review",
          {
            code,
            language: languages[language].name,
            errorMessage: errorMsg,
          }
        );

        const reviewText =
          typeof reviewResponse.data === "string"
            ? reviewResponse.data
            : reviewResponse.data.review || JSON.stringify(reviewResponse.data, null, 2);

        setReview(reviewText);
      } catch (reviewErr) {
        console.error("🚨 Review generation failed:", reviewErr);
        setReview("⚠️ Could not generate review for this error.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="sidebar-toggle-fixed"
        style={{ marginLeft: sidebarOpen ? 250 : 0, transition: "margin-left 0.3s", padding: 20 }}
      >
        {sidebarOpen ? "Hide Files" : "Show Files"}
      </button>

      <Sidebar
        isOpen={sidebarOpen}
        files={files}
        onFileClick={handleFileClick}
        onSaveFile={handleSaveFile}
      />

      <div style={{ marginLeft: sidebarOpen ? 250 : 0, transition: "margin-left 0.3s", padding: 20 }}>
        <Header />

        <main>
          <div className="left">
            {/* Language Selector */}
            <div className="language-select">
              <label htmlFor="language">Language:</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Code Editor */}
            <div className="code">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) =>
                  Prism.highlight(
                    code,
                    Prism.languages[language] || Prism.languages.javascript,
                    language
                  )
                }
                padding={12}
                className="editor"
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              />
            </div>

            {/* Terminal output */}
            <div className="Terminal">
              {loading ? <div>Compiling...</div> : <pre>{output || "Output will be displayed here"}</pre>}
            </div>

            {/* Execute button */}
            <div onClick={handleCodeReviewAndExecution} className="review">
              Execute
            </div>
          </div>

          <div className="right">
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
