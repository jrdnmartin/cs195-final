import { useState } from "react";
import AuthPage from "./AuthPage";
import HouseholdSection from "./HouseholdSection";
import "./App.css";

function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : { user: null, token: null };
  });

  const handleAuthSuccess = ({ user, token }) => {
    const newAuth = { user, token };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  const handleLogout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
  };

  const isLoggedIn = auth.user && auth.token;

  if (!isLoggedIn) {
    return (
      <div className="app-root">
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  const initials =
    auth.user?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "RM";

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <div className="app-logo-circle">RT</div>
            <div className="app-title-block">
              <div className="app-title">Roommate Tracker</div>
              <div className="app-subtitle">
                Keep your shared home running smoothly.
              </div>
            </div>
          </div>

          <div className="app-header-right">
            <div className="app-user-pill">
              <span className="app-user-avatar">{initials}</span>
              <span>{auth.user.name}</span>
            </div>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="app-main-column">
          <HouseholdSection auth={auth} />
        </section>

        <aside className="app-side-column">
          <div className="card">
            <div className="side-card-title">Today at a glance</div>
            <div className="side-user-meta">
              <div>
                Signed in as <strong>{auth.user.name}</strong>
              </div>
              <div className="side-card-text">{auth.user.email}</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
