// middlewares/taskValidator.js
const { body } = require("express-validator");

// --- Create Task Validator ---
const createTaskValidator = [
  body("name")
    .notEmpty()
    .withMessage("Task name is required")
    .isLength({ min: 3 })
    .withMessage("Task name must be at least 3 characters"),

  body("project")
    .notEmpty()
    .withMessage("Project reference is required")
    .isMongoId()
    .withMessage("Project must be a valid Mongo ID"),

  body("team")
    .notEmpty()
    .withMessage("Team reference is required")
    .isMongoId()
    .withMessage("Team must be a valid Mongo ID"),

  body("owners")
    .isArray({ min: 1 })
    .withMessage("At least one owner is required")
    .custom((arr) => arr.every((id) => /^[a-f\d]{24}$/i.test(id)))
    .withMessage("Each owner must be a valid Mongo ID"),

  body("timeToComplete")
    .notEmpty()
    .withMessage("Time to complete is required")
    .isNumeric()
    .withMessage("Time to complete must be a number"),

  body("status")
    .optional()
    .isIn(["To Do", "In Progress", "Completed", "Blocked"])
    .withMessage("Invalid status"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

// --- Update Task Validator ---
const updateTaskValidator = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Task name must be at least 3 characters"),

  body("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid Mongo ID"),

  body("team")
    .optional()
    .isMongoId()
    .withMessage("Team must be a valid Mongo ID"),

  body("owners")
    .optional()
    .isArray()
    .withMessage("Owners must be an array")
    .custom((arr) => arr.every((id) => /^[a-f\d]{24}$/i.test(id)))
    .withMessage("Each owner must be a valid Mongo ID"),

  body("timeToComplete")
    .optional()
    .isNumeric()
    .withMessage("Time to complete must be a number"),

  body("status")
    .optional()
    .isIn(["To Do", "In Progress", "Completed", "Blocked"])
    .withMessage("Invalid status"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

module.exports = { createTaskValidator, updateTaskValidator };
