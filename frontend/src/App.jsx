import { useState } from "react";
import AuthPage from "./AuthPage";
import HouseholdSection from "./HouseholdSection";

function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : { user: null, token: null };
  });

  const handleAuthSuccess = ({ user, token }) => {
    const newAuth = { user, token };
    setAuth(newAuth);
    // persist so a refresh doesn’t log you out immediately
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  const handleLogout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
  };

  const isLoggedIn = auth.user && auth.token;

  if (!isLoggedIn) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        background: "#f5f5f5",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ margin: 0 }}>Roommate Chore Tracker</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#555" }}>
            Logged in as <strong>{auth.user.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              cursor: "pointer",
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      <main
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Household section: fetches and shows data */}
        <HouseholdSection auth={auth} />

        {/* You can keep this debug block for now or remove it */}
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "8px",
            background: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            maxWidth: "500px",
          }}
        >
          <h3>Your user data (debug)</h3>
          <pre
            style={{
              fontSize: "0.8rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {JSON.stringify(auth.user, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}

export default App;
