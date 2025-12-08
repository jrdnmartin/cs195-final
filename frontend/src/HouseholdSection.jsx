import { useEffect, useState } from "react";
import {
  getMyHousehold,
  createHousehold,
  joinHousehold,
  leaveHousehold,
  addChore,
  updateChore,
  rotateChoresApi,
  deleteChoreApi,
} from "./api/households";

function HouseholdSection({ auth }) {
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [newChoreTitle, setNewChoreTitle] = useState("");

  const handleAddChore = async (e) => {
    e.preventDefault();
    if (!newChoreTitle.trim()) return;

    setActionMessage("");
    try {
      const result = await addChore(auth.token, {
        title: newChoreTitle.trim(),
      });
      setHousehold(result.household);
      setNewChoreTitle("");
      setActionMessage("Chore added.");
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  const handleToggleChore = async (chore) => {
    setActionMessage("");
    const nextStatus = chore.status === "done" ? "pending" : "done";

    try {
      const result = await updateChore(auth.token, chore._id, {
        status: nextStatus,
      });
      setHousehold(result.household);
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  const handleAssignChore = async (choreId, assignedToId) => {
    setActionMessage("");
    try {
      const payload = {
        assignedToId: assignedToId || null,
      };
      const result = await updateChore(auth.token, choreId, payload);
      setHousehold(result.household);
      setActionMessage("Chore assignment updated.");
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  const handleRotateChores = async () => {
    setActionMessage("");
    try {
      const result = await rotateChoresApi(auth.token);
      setHousehold(result.household);
      setActionMessage(result.message);
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  const handleDeleteChore = async (choreId) => {
    setActionMessage("");
    try {
      const result = await deleteChoreApi(auth.token, choreId);
      setHousehold(result.household);
      setActionMessage("Chore deleted.");
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  // helper to fetch latest household from backend
  const fetchHousehold = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyHousehold(auth.token);
      setHousehold(data.household);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchHousehold();
    }
  }, [auth?.token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionMessage("");
    try {
      await createHousehold(auth.token, createName);
      setActionMessage("Household created! 🎉");
      await fetchHousehold();
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setActionMessage("");
    try {
      await joinHousehold(auth.token, joinCode);
      setActionMessage("Joined household! 🎉");
      await fetchHousehold();
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  const handleLeave = async () => {
    setActionMessage("");
    try {
      await leaveHousehold(auth.token);
      setActionMessage("You left the household.");
      setHousehold(null);
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading household info...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!household) {
    return (
      <div className="setup-container">
        <h2>Household Setup</h2>
        <p>You’re not in a household yet. Create one or join one below.</p>

        <h3>Create Household</h3>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            value={createName}
            placeholder="Household name"
            onChange={(e) => setCreateName(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>

        <h3>Join Household</h3>
        <form onSubmit={handleJoin}>
          <input
            type="text"
            value={joinCode}
            placeholder="Enter join code"
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button type="submit">Join</button>
        </form>

        {actionMessage && (
          <p
            className={
              actionMessage.includes("🎉")
                ? "success-message"
                : "error-message"
            }
          >
            {actionMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header-row">
        <div>
          <div className="card-title">Your household</div>
          <div className="card-subtitle">
            Share chores, keep expectations clear, avoid awkward fridge notes.
          </div>
        </div>
        <button
          type="button"
          onClick={handleLeave}
          className="btn btn-danger-outline"
        >
          Leave household
        </button>
      </div>

      <p>
        <strong>Name:</strong> {household.name}
      </p>
      <p>
        <strong>Join code:</strong>{" "}
        <code>{household.joinCode}</code>
      </p>

      <div>
        <h3>Members</h3>
        <ul>
          {household.members?.map((member) => (
            <li key={member._id}>
              {member.name}{" "}
              <span>
                ({member.email})
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div>
          <h3>Chores</h3>
          <button
            type="button"
            onClick={handleRotateChores}
            className="btn btn-ghost"
          >
            Auto-rotate assignments
          </button>
        </div>

        <form onSubmit={handleAddChore}>
          <input
            type="text"
            value={newChoreTitle}
            placeholder="Add a new chore (e.g., Take out trash)"
            onChange={(e) => setNewChoreTitle(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>

        {household.chores && household.chores.length > 0 ? (
          <ul>
            {household.chores.map((chore) => (
              <li key={chore._id}>
                <div>
                  <span
                    style={{
                      textDecoration:
                        chore.status === "done" ? "line-through" : "none",
                    }}
                  >
                    {chore.title}
                  </span>{" "}
                  <span>
                    ({chore.status})
                  </span>
                  {chore.assignedTo && (
                    <span>
                      {" "}
                      – assigned to {chore.assignedTo.name}
                    </span>
                  )}
                </div>

                <div>
                  <select
                    value={chore.assignedTo?._id || ""}
                    onChange={(e) =>
                      handleAssignChore(chore._id, e.target.value || null)
                    }
                    className="select"
                  >
                    <option value="">Unassigned</option>
                    {household.members?.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleToggleChore(chore)}
                    className="btn btn-ghost"
                  >
                    {chore.status === "done"
                      ? "Mark pending"
                      : "Mark done"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteChore(chore._id)}
                    className="btn btn-danger-outline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="side-card-text">
            No chores yet. Add the first one above to get started.
          </p>
        )}
      </div>

      {actionMessage && (
        <p
          className={
            actionMessage.toLowerCase().includes("error")
              ? "error-message"
              : "success-message"
          }
        >
          {actionMessage}
        </p>
      )}
    </div>
  );
}

export default HouseholdSection;
