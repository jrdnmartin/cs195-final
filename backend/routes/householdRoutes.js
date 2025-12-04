const express = require("express");
const {
  createHousehold,
  joinHousehold,
  getMyHousehold,
  leaveHousehold,
  addChore,
  updateChore,
  deleteChore,
  rotateChores,
} = require("../controllers/householdController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createHousehold);
router.post("/join", authMiddleware, joinHousehold);
router.get("/mine", authMiddleware, getMyHousehold);
router.delete("/leave", authMiddleware, leaveHousehold);

router.post("/chores", authMiddleware, addChore);
router.patch("/chores/:choreId", authMiddleware, updateChore);
router.delete("/chores/:choreId", authMiddleware, deleteChore);
router.post("/chores/rotate", authMiddleware, rotateChores);

module.exports = router;
