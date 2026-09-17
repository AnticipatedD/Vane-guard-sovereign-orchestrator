import React, { useState } from "react";

export default function CodeExampleSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState("bash");

  const getExampleCode = () => {
    // Intentionally non-secret placeholder – used only in documentation examples
    const tokenPlaceholder = "YOUR_CLOUDFLARE_API_TOKEN";

    if (selectedLanguage === "bash") {
      return `curl https://gateway.ai.cloudflare.com/v1/... \\\n  -H "Authorization: Bearer ${tokenPlaceholder}"`;
    }

    if (selectedLanguage === "python") {
      return `import os
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.ai.cloudflare.com/v1/...",
    api_key=os.environ.get("CF_API_TOKEN")  # replace with your token
)`;
    }

    return `// JavaScript / Worker
const apiKey = process.env.CF_API_TOKEN; // replace with your token`;
  };

  return (
    <div
      className="code-example-container"
      style={{ padding: "15px", background: "#1e1e1e", borderRadius: "6px" }}
    >
      <div className="tabs" style={{ marginBottom: "10px" }}>
        <button
          onClick={() => setSelectedLanguage("bash")}
          style={{
            marginRight: "8px",
            padding: "6px 12px",
            background: selectedLanguage === "bash" ? "#38bdf8" : "#334155",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Bash
        </button>
        <button
          onClick={() => setSelectedLanguage("python")}
          style={{
            padding: "6px 12px",
            background: selectedLanguage === "python" ? "#38bdf8" : "#334155",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Python
        </button>
      </div>
      <pre style={{ margin: 0, overflowX: "auto" }}>
        <code style={{ color: "#3ade84", fontFamily: "monospace" }}>
          {getExampleCode()}
        </code>
      </pre>
    </div>
  );
						}
