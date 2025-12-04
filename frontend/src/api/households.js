const API_URL = 'http://localhost:3001';

// GET /api/households/mine
export async function getMyHousehold(token) {
  const res = await fetch(`${API_URL}/api/household/mine`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch household");
  }
  return data;
}

export async function createHousehold(token, name) {
  const res = await fetch(`${API_URL}/api/household`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to create household");
  }
  return data;
}

export async function joinHousehold(token, joinCode) {
  const res = await fetch(`${API_URL}/api/household/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ joinCode }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to join household");
  }
  return data;
}

export async function leaveHousehold(token) {
  const res = await fetch(`${API_URL}/api/household/leave`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to leave household");
  }
  return data;
}

export async function addChore(token, { title, assignedToId }) {
  const res = await fetch(`${API_URL}/api/household/chores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, assignedToId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to add chore");
  }
  return data;
}

export async function updateChore(token, choreId, payload) {
  const res = await fetch(
    `${API_URL}/api/household/chores/${choreId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update chore");
  }
  return data;
}

export async function rotateChoresApi(token) {
  const res = await fetch(`${API_URL}/api/household/chores/rotate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to rotate chores");
  }
  return data;
}

export async function deleteChoreApi(token, choreId) {
  const res = await fetch(
    `${API_URL}/api/household/chores/${choreId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete chore");
  }
  return data;
}