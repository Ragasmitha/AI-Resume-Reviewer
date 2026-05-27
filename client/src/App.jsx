import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
  setFile(e.target.files[0]);
  setError("");
  setFeedback("");
};

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a resume PDF!");
      return;
    }

    setError("");
    setLoading(true);
    setFeedback("");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobRole", jobRole || "Software Engineer");

    try {
      const res = await axios.post(
        "https://ai-resume-reviewer-zryl.onrender.com/analyze",
        formData
      );

      setFeedback(res.data.feedback);

      setFile(null);
      document.getElementById("resumeUpload").value = "";

      setTimeout(() => {
        document
          .getElementById("results-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            background: #0f172a;
            font-family: Inter, sans-serif;
          }

          * {
            box-sizing: border-box;
          }

          .card-hover {
            transition: all 0.3s ease;
          }

          .card-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.45);
          }

          .upload-box:hover {
            border-color: #3b82f6 !important;
            background: #243041 !important;
          }

          .analyze-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(37, 99, 235, 0.45) !important;
          }

          .input-field:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 4px rgba(59,130,246,0.15);
          }

          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #111827;
          }

          ::-webkit-scrollbar-thumb {
            background: #374151;
            border-radius: 20px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #4b5563;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(15px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
            @media (max-width: 768px) {
             h1 {
               font-size: 24px !important;
               line-height: 1.2;
            }

             .card-hover {
                padding: 24px !important;
            }

             .upload-box {
                padding: 28px 16px !important;
          }

             .analyze-btn {
                height: 52px !important;
                font-size: 15px !important;
       }
        }
        `}
      </style>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "70px 20px",
          minHeight: "100vh",
          color: "white",
        }}
      >

        {/* Background Glow */}
        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            background: "#2563eb",
            borderRadius: "50%",
            filter: "blur(140px)",
            top: "-120px",
            left: "-120px",
            opacity: "0.18",
            zIndex: "0",
          }}
        />

        {/* Header */}
        <div
          style={{
            position: "relative",
            zIndex: "1",
            textAlign: "center",
            marginBottom: "45px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "700",
              color: "#3b82f6",
              marginBottom: "14px",
              letterSpacing: "-1px",
            }}
          >
            AI Resume Reviewer
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              maxWidth: "650px",
              margin: "0 auto",
              lineHeight: "1.8",
            }}
          >
            Upload your resume and receive ATS-aware AI feedback,
            improvement suggestions, and professional analysis instantly.
          </p>
        </div>

        {/* Main Card */}
        <div
          className="card-hover"
          style={{
            position: "relative",
            zIndex: "1",
            background: "#111827",
            padding: "42px",
            borderRadius: "28px",
            border: "1px solid #1f2937",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
          }}
        >

          {/* Job Role */}
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontWeight: "600",
                color: "#e2e8f0",
                fontSize: "15px",
              }}
            >
              Target Job Role
            </label>

           <select
  value={jobRole}
  onChange={(e) => setJobRole(e.target.value)}
  className="input-field"
  style={{
    width: "100%",
    padding: "17px",
    borderRadius: "16px",
    border: "1px solid #374151",
    fontSize: "16px",
    background: "#1f2937",
    color: "white",
    outline: "none",
    transition: "0.3s ease",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    cursor: "pointer",
  }}
>
  <option value="">Select a Job Role</option>
  <option value="Software Engineer">Software Engineer</option>
  <option value="Frontend Developer">Frontend Developer</option>
  <option value="Backend Developer">Backend Developer</option>
  <option value="Full Stack Developer">Full Stack Developer</option>
  <option value="Data Analyst">Data Analyst</option>
  <option value="Data Scientist">Data Scientist</option>
  <option value="AI/ML Engineer">AI/ML Engineer</option>
  <option value="DevOps Engineer">DevOps Engineer</option>
  <option value="UI/UX Designer">UI/UX Designer</option>
</select>
          </div>

          {/* Upload Area */}
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontWeight: "600",
                color: "#e2e8f0",
                fontSize: "15px",
              }}
            >
              Upload Resume (PDF)
            </label>

            <div
              className="upload-box"
              style={{
                border: "2px dashed #374151",
                borderRadius: "22px",
                padding: "42px 20px",
                textAlign: "center",
                background: "#1f2937",
                cursor: "pointer",
                transition: "0.3s ease",
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{
                  display: "none",
                }}
                id="resumeUpload"
              />

              <label
                htmlFor="resumeUpload"
                style={{
                  cursor: "pointer",
                  display: "block",
                }}
              >
                <div
                  style={{
                    fontSize: "46px",
                    marginBottom: "12px",
                    color: "#60a5fa",
                  }}
                >
                  ↑
                </div>

                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    marginBottom: "10px",
                    color: "#f8fafc",
                  }}
                >
                  Upload Resume PDF
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                  }}
                >
                  Drag and drop or click to browse
                </div>
              </label>
            </div>

            {file && (
              <p
                style={{
                  color: "#22c55e",
                  marginTop: "16px",
                  fontSize: "14px",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                {file.name} selected
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                color: "#ef4444",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="analyze-btn"
            style={{
              width: "100%",
              height: "58px",
              border: "none",
              borderRadius: "16px",
              background: loading ? "#1d4ed8" : "#2563eb",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.3s ease",
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
              letterSpacing: "0.4px",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <div className="spinner"></div>
                Analyzing Resume...
              </div>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </div>

        {/* Results */}
        {feedback && (
          <div
            id="results-section"
            className="card-hover"
            style={{
              position: "relative",
              zIndex: "1",
              background: "#111827",
              padding: "42px",
              borderRadius: "28px",
              marginTop: "35px",
              border: "1px solid #1f2937",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              animation: "fadeIn 0.5s ease",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                marginBottom: "28px",
                color: "white",
                textAlign: "center",
              }}
            >
              Analysis Results
            </h2>

            <div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  }}
>
  <div
    style={{
      width: "130px",
      height: "130px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #2563eb, #3b82f6)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 30px rgba(37,99,235,0.35)",
    }}
  >
    <span
      style={{
        fontSize: "42px",
        fontWeight: "700",
        color: "white",
        lineHeight: "1",
      }}
    >
      {feedback.match(/Score:\s*(\d+)/i)?.[1] || "--"}
    </span>

    <span
      style={{
        fontSize: "13px",
        color: "#dbeafe",
        marginTop: "6px",
        fontWeight: "500",
      }}
    >
      Resume Score
    </span>
  </div>
</div>

            <div
              style={{
                lineHeight: "1.9",
                fontSize: "15px",
                color: "#d1d5db",
                letterSpacing: "0.2px",
                textAlign: "left",
              }}
         >
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      style={{
                        fontSize: "22px",
                        marginTop: "28px",
                        marginBottom: "14px",
                        color: "#ffffff",
                        fontWeight: "600",
                      }}
                      {...props}
                    />
                  ),

                  h2: ({ node, ...props }) => (
                    <h2
                      style={{
                        fontSize: "20px",
                        marginTop: "24px",
                        marginBottom: "14px",
                        color: "#ffffff",
                        fontWeight: "600",
                      }}
                      {...props}
                    />
                  ),

                  p: ({ node, ...props }) => (
                    <p
                      style={{
                        color: "#d1d5db",
                        lineHeight: "1.9",
                        marginBottom: "16px",
                      }}
                      {...props}
                    />
                  ),

                  li: ({ node, ...props }) => (
  <li
    style={{
      marginBottom: "12px",
      color: "#d1d5db",
      lineHeight: "1.8",
    }}
    {...props}
  />
),
                }}
              >
                {
  feedback.replace(
    /# Resume Score[\s\S]*?(?=# Score Explanation)/i,
    ""
  )
}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;