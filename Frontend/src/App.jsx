import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-ruby";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

// Language mapping (ID from Judge0)
const languages = {
  javascript: { id: 63, name: "JavaScript" },
  python: { id: 71, name: "Python" },
  java: { id: 62, name: "Java" },
  c: { id: 50, name: "C" },
  cpp: { id: 54, name: "C++" },
  go: { id: 60, name: "Go" },
  ruby: { id: 72, name: "Ruby" }
};

function App() {
  const [code, setCode] = useState(`function sum() { return 1 + 1; }`);
  const [language, setLanguage] = useState("javascript");
  const [review, setReview] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, [code, language]);

  async function handleCodeReviewAndExecution() {
    setLoading(true);
    setReview('');
    setOutput('');

    try {
      const language_id = languages[language].id;

      const compileResponse = await axios.post('http://localhost:3000/ai/compiler/execute', {
        language_id,
        source_code: code,
        stdin: ""
      });

      const { stdout, stderr, status } = compileResponse.data;

      if (stderr) {
        setOutput(`❌ Error:\n${stderr}`);

        const reviewResponse = await axios.post('http://localhost:3000/ai/get-review', {
          code,
          language: languages[language].name,
          errorMessage: stderr
        });
        

        const reviewText = typeof reviewResponse.data === 'string'
          ? reviewResponse.data
          : reviewResponse.data.review || JSON.stringify(reviewResponse.data, null, 2);

        setReview(reviewText);

      } else if (status?.description === "Accepted") {
        setOutput(stdout || "✅ Code executed, but no output.");
      } else {
        setOutput("⚠️ Unknown status from compiler.");
      }
    } catch (error) {
      console.error('🚨 Error:', error);
      setOutput('❌ Something went wrong. Check console.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
                <option key={key} value={key}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => prism.highlight(code, prism.languages[language] || prism.languages.javascript, language)}
              padding={10}
              className="editor"
            />
          </div>

          <div className="Terminal">
            {loading ? (
              <div>Compiling...</div>
            ) : (
              <pre>{output || 'Output will be displayed here'}</pre>
            )}
          </div>

          <div onClick={handleCodeReviewAndExecution} className="review">
            Execute
          </div>
        </div>

        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
