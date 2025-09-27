const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createTask, getTasks, updateTask, deleteTask, getTaskById } = require("../controllers/taskController");
const { createTaskValidator, updateTaskValidator } = require("../middleware/taskValidator");
const validateRequest = require("../middleware/validateRequest")


// Create Task
router.post("/", authMiddleware, createTaskValidator, validateRequest, createTask);

// Get Tasks (no body validation needed)
router.get("/", authMiddleware, getTasks);

router.get("/:id", authMiddleware, getTaskById);

// Update Task
router.put("/:id", authMiddleware, updateTaskValidator, validateRequest, updateTask);

// Delete Task (no body validation needed)
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
