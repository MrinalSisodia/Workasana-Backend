const express = require("express");
const { createTeam, getTeams, updateTeamMembers, getTeamById } = require("../controllers/teamController");
const authMiddleware = require("../middleware/authMiddleware");
const { createTeamValidator, updateTeamMembersValidator } = require("../middleware/teamValidator");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post("/", authMiddleware,createTeamValidator, validateRequest, createTeam); 
router.get("/", authMiddleware, getTeams);   
router.get("/:teamId", authMiddleware, getTeamById);
router.put("/:teamId/members", authMiddleware, updateTeamMembersValidator, validateRequest, updateTeamMembers);

module.exports = router;
