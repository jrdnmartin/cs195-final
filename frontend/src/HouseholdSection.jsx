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
        assignedToId: assignedToId || null, // allow clearing assignment
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
      setHousehold(null); // back to setup view
    } catch (err) {
      setActionMessage(err.message);
    }
  };


  if (loading) {
    return <p>Loading household info...</p>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          background: "#fee2e2",
          color: "#b91c1c",
          maxWidth: "500px",
        }}
      >
        <strong>Error:</strong> {error}
      </div>
    );
  }

  // No household yet → show create/join UI
  if (!household) {
    return (
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "8px",
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          maxWidth: "600px",
        }}
      >
        <h2>Household Setup</h2>
        <p>You’re not in a household yet. Create one or join one below.</p>

        <h3>Create Household</h3>
        <form onSubmit={handleCreate} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={createName}
            placeholder="Household name"
            onChange={(e) => setCreateName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </form>

        <h3>Join Household</h3>
        <form onSubmit={handleJoin}>
          <input
            type="text"
            value={joinCode}
            placeholder="Enter join code"
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Join
          </button>
        </form>

        {actionMessage && (
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.9rem",
              color: actionMessage.includes("🎉") ? "green" : "red",
            }}
          >
            {actionMessage}
          </p>
        )}
      </div>
    );
  }

    return (
    <div
        style={{
        padding: "1.5rem",
        borderRadius: "8px",
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        maxWidth: "700px",
        }}
    >
        <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
        }}
        >
        <h2 style={{ margin: 0 }}>Your Household</h2>
        <button
            type="button"
            onClick={handleLeave}
            style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            border: "1px solid #f87171",
            background: "#fee2e2",
            color: "#b91c1c",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "500",
            }}
        >
            Leave Household
        </button>
        </div>

        <p style={{ marginBottom: "0.5rem" }}>
        <strong>Name:</strong> {household.name}
        </p>
        <p style={{ marginBottom: "1rem" }}>
        <strong>Join Code:</strong>{" "}
        <code
            style={{
            background: "#f3f4f6",
            padding: "0.2rem 0.4rem",
            borderRadius: "4px",
            }}
        >
            {household.joinCode}
        </code>
        </p>

        <div style={{ marginTop: "1rem" }}>
        <h3>Members</h3>
        <ul style={{ paddingLeft: "1.2rem" }}>
            {household.members?.map((member) => (
            <li key={member._id}>
                {member.name}{" "}
                <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                ({member.email})
                </span>
            </li>
            ))}
        </ul>
        </div>

        <div style={{ marginTop: "1rem" }}>
        {/* Header + rotate button */}
        <div
            style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
            }}
        >
            <h3 style={{ margin: 0 }}>Chores</h3>
            <button
            type="button"
            onClick={handleRotateChores}
            style={{
                padding: "0.3rem 0.7rem",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                cursor: "pointer",
                fontSize: "0.8rem",
            }}
            >
            Auto-Rotate Assignments
            </button>
        </div>

        {/* Add chore form */}
        <form
            onSubmit={handleAddChore}
            style={{ marginBottom: "0.75rem", display: "flex", gap: "0.5rem" }}
        >
            <input
            type="text"
            value={newChoreTitle}
            placeholder="Add a new chore (e.g., Take out trash)"
            onChange={(e) => setNewChoreTitle(e.target.value)}
            style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
            }}
            />
            <button
            type="submit"
            style={{
                padding: "0.5rem 0.9rem",
                borderRadius: "4px",
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
                fontSize: "0.9rem",
            }}
            >
            Add
            </button>
        </form>

        {/* Chore list */}
        {household.chores && household.chores.length > 0 ? (
            <ul style={{ paddingLeft: "1.2rem" }}>
            {household.chores.map((chore) => (
                <li
                key={chore._id}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    marginBottom: "0.35rem",
                }}
                >
                <div>
                    <span
                    style={{
                        textDecoration:
                        chore.status === "done" ? "line-through" : "none",
                    }}
                    >
                    {chore.title}
                    </span>{" "}
                    <span
                    style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        textTransform: "capitalize",
                    }}
                    >
                    ({chore.status})
                    </span>
                    {chore.assignedTo && (
                    <span
                        style={{
                        fontSize: "0.8rem",
                        color: "#4b5563",
                        marginLeft: "0.25rem",
                        }}
                    >
                        – assigned to {chore.assignedTo.name}
                    </span>
                    )}
                </div>

                <div
                    style={{
                    display: "flex",
                    gap: "0.4rem",
                    alignItems: "center",
                    }}
                >
                    {/* Manual assignment dropdown */}
                    <select
                    value={chore.assignedTo?._id || ""}
                    onChange={(e) =>
                        handleAssignChore(chore._id, e.target.value || null)
                    }
                    style={{
                        fontSize: "0.8rem",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        background: "#ffffff",
                    }}
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
                    style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        background: "#f9fafb",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                    }}
                    >
                    {chore.status === "done" ? "Mark Pending" : "Mark Done"}
                    </button>
                    <button
                    type="button"
                    onClick={() => handleDeleteChore(chore._id)}
                    style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "4px",
                        border: "1px solid #f97373",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                    }}
                    >
                    Delete
                    </button>
                </div>
                </li>
            ))}
            </ul>
        ) : (
            <p>No chores yet. Add one above to get started.</p>
        )}
        </div>

        {actionMessage && (
        <p
            style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: actionMessage.includes("error") ? "red" : "green",
            }}
        >
            {actionMessage}
        </p>
        )}
    </div>
    );
    }

export default HouseholdSection;
