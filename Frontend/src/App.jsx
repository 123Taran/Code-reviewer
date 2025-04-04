import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState(`function sum() { return 1 + 1; }`);
  const [review, setReview] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  // Combined function to handle both review and execution
  async function handleCodeReviewAndExecution() {
    setLoading(true);
    setReview('');
    setOutput('');
  
    try {
      // Compile Code First
      const compileResponse = await axios.post('http://localhost:3000/ai/compiler/execute', {
        language_id: 63,
        source_code: code,
        stdin: ""
      });
  
      const { stdout, stderr, status } = compileResponse.data;
  
      if (stderr) {
        setOutput(`❌ Error:\n${stderr}`);
        
        // Only if error in execution, then call AI review
        const reviewResponse = await axios.post('http://localhost:3000/ai/get-review', { code });

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
          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              className="editor"
            />
          </div>

          <div className="Terminal">
            {loading ? (
              <div>Compiling</div>
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
