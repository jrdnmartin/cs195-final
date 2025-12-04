const Household = require("../models/Household");
const User = require("../models/User");

// simple helper to make a 6-character join code
function generateJoinCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// POST /api/households
// Body: { name }
// Creates a new household and assigns current user as first member
const createHousehold = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Household name is required." });
    }

    const user = req.user;

    if (user.household) {
      return res
        .status(400)
        .json({ message: "You are already in a household." });
    }

    let joinCode;
    let exists = true;
    while (exists) {
      joinCode = generateJoinCode();
      const existing = await Household.findOne({ joinCode });
      if (!existing) exists = false;
    }

    const household = await Household.create({
      name,
      joinCode,
      members: [user._id],
      chores: [],
    });

    user.household = household._id;
    await user.save();

    res.status(201).json({
      message: "Household created.",
      household: {
        id: household._id,
        name: household.name,
        joinCode: household.joinCode,
      },
    });
  } catch (err) {
    console.error("Error in createHousehold:", err);
    res.status(500).json({ message: "Server error creating household." });
  }
};

// POST /api/households/join
// Body: { joinCode }
// Adds current user to an existing household
const joinHousehold = async (req, res) => {
  try {
    const { joinCode } = req.body;
    if (!joinCode) {
      return res.status(400).json({ message: "Join code is required." });
    }

    const user = req.user;

    if (user.household) {
      return res
        .status(400)
        .json({ message: "You are already in a household." });
    }

    const household = await Household.findOne({
      joinCode: joinCode.trim().toUpperCase(),
    });

    if (!household) {
      return res.status(404).json({ message: "Household not found." });
    }

    // Add user to members if not already there
    if (!household.members.some((id) => id.equals(user._id))) {
      household.members.push(user._id);
      await household.save();
    }

    user.household = household._id;
    await user.save();

    res.json({
      message: "Joined household successfully.",
      household: {
        id: household._id,
        name: household.name,
        joinCode: household.joinCode,
      },
    });
  } catch (err) {
    console.error("Error in joinHousehold:", err);
    res.status(500).json({ message: "Server error joining household." });
  }
};

// GET /api/households/mine
// Returns the household the current user belongs to
const getMyHousehold = async (req, res) => {
  try {
    const user = req.user;

    if (!user.household) {
      return res.status(200).json({ household: null });
    }

    const household = await Household.findById(user.household)
      .populate("members", "name email")
      .populate("chores.assignedTo", "name email");

    if (!household) {
      return res.status(404).json({ message: "Household not found." });
    }

    res.json({
      household: {
        id: household._id,
        name: household.name,
        joinCode: household.joinCode,
        members: household.members,
        chores: household.chores,
      },
    });
  } catch (err) {
    console.error("Error in getMyHousehold:", err);
    res.status(500).json({ message: "Server error fetching household." });
  }
};

// DELETE /api/household/leave
// Current user leaves their household.
// If they are the last member, the household is deleted.
const leaveHousehold = async (req, res) => {
  try {
    const user = req.user;

    if (!user.household) {
      return res
        .status(400)
        .json({ message: "You are not currently in a household." });
    }

    const household = await Household.findById(user.household);
    if (!household) {
      // Clean up inconsistent state
      user.household = null;
      await user.save();
      return res
        .status(404)
        .json({ message: "Household not found. Your membership was reset." });
    }

    // Remove user from household.members
    household.members = household.members.filter(
      (memberId) => !memberId.equals(user._id)
    );

    if (household.members.length === 0) {
      // No members left → delete household
      await Household.deleteOne({ _id: household._id });
    } else {
      await household.save();
    }

    // Clear user's household reference
    user.household = null;
    await user.save();

    return res.json({
      message:
        household.members.length === 0
          ? "You left the household. Since you were the last member, the household was deleted."
          : "You left the household.",
    });
  } catch (err) {
    console.error("Error in leaveHousehold:", err);
    res.status(500).json({ message: "Server error leaving household." });
  }
};

async function getPopulatedHouseholdById(householdId) {
  return Household.findById(householdId)
    .populate("members", "name email")
    .populate("chores.assignedTo", "name email");
}

// POST /api/household/chores
// Body: { title, assignedToId? }
const addChore = async (req, res) => {
  try {
    const user = req.user;
    const { title, assignedToId } = req.body;

    if (!user.household) {
      return res
        .status(400)
        .json({ message: "You are not in a household." });
    }

    if (!title) {
      return res.status(400).json({ message: "Chore title is required." });
    }

    const household = await Household.findById(user.household);
    if (!household) {
      return res.status(404).json({ message: "Household not found." });
    }

    let assignedTo = null;

    if (assignedToId) {
      // Make sure assignedTo is a member of this household
      const isMember = household.members.some((id) =>
        id.equals(assignedToId)
      );
      if (!isMember) {
        return res
          .status(400)
          .json({ message: "Assigned user is not in this household." });
      }
      assignedTo = assignedToId;
    }

    household.chores.push({
      title,
      assignedTo,
      status: "pending",
    });

    await household.save();

    const populated = await getPopulatedHouseholdById(household._id);

    res.status(201).json({
      message: "Chore added.",
      household: populated,
    });
  } catch (err) {
    console.error("Error in addChore:", err);
    res.status(500).json({ message: "Server error adding chore." });
  }
};

// PATCH /api/household/chores/:choreId
// Body: { title?, status?, assignedToId? }
const updateChore = async (req, res) => {
  try {
    const user = req.user;
    const { choreId } = req.params;
    const { title, status, assignedToId } = req.body;

    if (!user.household) {
      return res
        .status(400)
        .json({ message: "You are not in a household." });
    }

    const household = await Household.findOne({
      _id: user.household,
      "chores._id": choreId,
    });

    if (!household) {
      return res.status(404).json({ message: "Chore not found." });
    }

    const chore = household.chores.id(choreId);
    if (!chore) {
      return res.status(404).json({ message: "Chore not found." });
    }

    if (title !== undefined) {
      chore.title = title;
    }

    if (status !== undefined) {
      if (!["pending", "done"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status. Use 'pending' or 'done'." });
      }
      chore.status = status;
    }

    if (assignedToId !== undefined) {
      if (assignedToId === null || assignedToId === "") {
        chore.assignedTo = null;
      } else {
        const isMember = household.members.some((id) =>
          id.equals(assignedToId)
        );
        if (!isMember) {
          return res
            .status(400)
            .json({ message: "Assigned user is not in this household." });
        }
        chore.assignedTo = assignedToId;
      }
    }

    await household.save();

    const populated = await getPopulatedHouseholdById(household._id);

    res.json({
      message: "Chore updated.",
      household: populated,
    });
  } catch (err) {
    console.error("Error in updateChore:", err);
    res.status(500).json({ message: "Server error updating chore." });
  }
};

// DELETE /api/household/chores/:choreId
const deleteChore = async (req, res) => {
  try {
    const user = req.user;
    const { choreId } = req.params;

    if (!user.household) {
      return res
        .status(400)
        .json({ message: "You are not in a household." });
    }

    const household = await Household.findById(user.household);
    if (!household) {
      return res.status(404).json({ message: "Household not found." });
    }

    const chore = household.chores.id(choreId);
    if (!chore) {
      return res.status(404).json({ message: "Chore not found." });
    }

    chore.deleteOne(); // remove subdocument
    await household.save();

    const populated = await getPopulatedHouseholdById(household._id);

    res.json({
      message: "Chore deleted.",
      household: populated,
    });
  } catch (err) {
    console.error("Error in deleteChore:", err);
    res.status(500).json({ message: "Server error deleting chore." });
  }
};

// POST /api/household/chores/rotate
const rotateChores = async (req, res) => {
  try {
    const user = req.user;

    if (!user.household) {
      return res
        .status(400)
        .json({ message: "You are not in a household." });
    }

    const household = await Household.findById(user.household);
    if (!household) {
      return res.status(404).json({ message: "Household not found." });
    }

    const members = household.members;
    if (!members || members.length === 0) {
      return res
        .status(400)
        .json({ message: "No members in household to rotate chores." });
    }

    const startIndex = household.rotationIndex || 0;

    const pendingChores = household.chores.filter(
      (chore) => chore.status === "pending"
    );

    if (pendingChores.length === 0) {
      return res
        .status(400)
        .json({ message: "No pending chores to rotate." });
    }

    pendingChores.forEach((chore, idx) => {
      const memberIndex = (startIndex + idx) % members.length;
      chore.assignedTo = members[memberIndex];
    });

    household.rotationIndex = (startIndex + 1) % members.length;

    await household.save();

    const populated = await getPopulatedHouseholdById(household._id);

    res.json({
      message: "Chores rotated successfully.",
      household: populated,
    });
  } catch (err) {
    console.error("Error in rotateChores:", err);
    res.status(500).json({ message: "Server error rotating chores." });
  }
};

module.exports = {
  createHousehold,
  joinHousehold,
  getMyHousehold,
  leaveHousehold,
  addChore,
  updateChore,
  deleteChore,
  rotateChores,
};
