const express = require("express");
const { createTeam, getTeams } = require("../controllers/teamController");
const authMiddleware = require("../middleware/authMiddleware");
const { createTeamValidator } = require("../middleware/teamValidator");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post("/", authMiddleware,createTeamValidator, validateRequest, createTeam); // POST /api/teams
router.get("/", authMiddleware, getTeams);   // GET /api/teams

module.exports = router;
