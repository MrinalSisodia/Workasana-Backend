const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
const { createTaskValidator, updateTaskValidator } = require("../middlewares/taskValidator");


// Create Task
router.post("/", authMiddleware, createTaskValidator, validateRequest, createTask);

// Get Tasks (no body validation needed)
router.get("/", authMiddleware, getTasks);

// Update Task
router.put("/:id", authMiddleware, updateTaskValidator, validateRequest, updateTask);

// Delete Task (no body validation needed)
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
