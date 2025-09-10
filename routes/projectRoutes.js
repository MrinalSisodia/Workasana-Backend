const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const { createProjectValidator } = require("../middleware/projectValidator");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

// All project routes protected (must be logged in)
router.post("/", authMiddleware, createProjectValidator, validateRequest,createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectById);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
