import { useState } from "react";
import { registerUser, loginUser } from "./api/auth";

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
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

        if (onAuthSuccess) {
          onAuthSuccess({
            user: result.user,
            token: result.token,
          });
        }
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
    <div className="auth-page">
      <div className="auth-inner single">
        <section className="auth-panel">
          <div className="auth-toggle-row">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMessage("");
                setError("");
              }}
              className={"auth-toggle-button" + (isLogin ? " active" : "")}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setMessage("");
                setError("");
              }}
              className={"auth-toggle-button" + (!isLogin ? " active" : "")}
            >
              Sign up
            </button>
          </div>

          <h1 className="auth-title">
            {isLogin ? "Welcome back" : "Create your space"}
          </h1>
          <p className="auth-subtitle">
            {isLogin
              ? "Sign in to see what needs doing in your flat today."
              : "Set up an account so your household can share and rotate chores."}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="field">
                <label className="field-label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="field">
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Log in"
                : "Create account"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <div className="auth-footnote">
            <div className="auth-footnote-divider" />

            <div className="auth-footnote-main">
              <div className="auth-footnote-icon">
                <span>◎</span>
              </div>
              <div className="auth-footnote-text">
                <div className="auth-footnote-title">
                  Built for shared homes
                </div>
                <div className="auth-footnote-tags">
                  <span className="auth-footnote-tag">Rotating chores</span>
                  <span className="auth-footnote-tag">Fair assignments</span>
                  <span className="auth-footnote-tag">One household hub</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPage;
