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
    setLoading(true); // Show loading state
  
    // Review Code
    try {
      const reviewResponse = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(reviewResponse.data);  // Set the review
  
      // Compile Code
      const compileResponse = await axios.post('http://localhost:3000/ai/compiler/execute', {
        language_id: 63,  // JavaScript language ID
        source_code: code, // Pass the code as source_code
        stdin: ""  // No input required for now
      });
  
      if (compileResponse.data.stderr) {
        setOutput(`Error: ${compileResponse.data.stderr}`); // Show error if stderr is present
      } else {
        setOutput(compileResponse.data.stdout); // Show normal output
      }
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error Executing Code');
    } finally {
      setLoading(false); // Hide loading state after both actions are complete
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
