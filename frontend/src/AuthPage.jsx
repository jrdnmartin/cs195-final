import { useState } from "react";
import { registerUser, loginUser } from "./api/auth";

function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (isLogin) {
        const result = await loginUser({ email, password });
        setMessage("Logged in successfully!");
        console.log("Login result:", result);
      } else {
        const result = await registerUser({ name, email, password });
        setMessage("Registered successfully! You can now log in.");
        console.log("Register result:", result);
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "8px",
          background: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
          Roommate Chore Tracker
        </h1>

        <div
          style={{
            display: "flex",
            marginBottom: "1rem",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
              setError("");
            }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: isLogin ? "2px solid #2563eb" : "1px solid #ccc",
              background: isLogin ? "#2563eb" : "#ffffff",
              color: isLogin ? "#ffffff" : "#000000",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setMessage("");
              setError("");
            }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: !isLogin ? "2px solid #2563eb" : "1px solid #ccc",
              background: !isLogin ? "#2563eb" : "#ffffff",
              color: !isLogin ? "#ffffff" : "#000000",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{ display: "block", marginBottom: "0.25rem" }}
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: "0.75rem" }}>
            <label
              style={{ display: "block", marginBottom: "0.25rem" }}
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label
              style={{ display: "block", marginBottom: "0.25rem" }}
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "0.5rem",
            }}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Log In"
              : "Create Account"}
          </button>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: "0.75rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        {message && (
          <p
            style={{ color: "green", marginTop: "0.75rem", fontSize: "0.9rem" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
