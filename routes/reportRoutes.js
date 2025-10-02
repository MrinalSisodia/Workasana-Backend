const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/reports/tasks/closed-last-week
router.get("/tasks/closed-last-week", authMiddleware,reportController.getTasksClosedLastWeek);

// GET /api/reports/tasks/pending-summary
router.get("/tasks/pending-summary", authMiddleware, reportController.getPendingWorkSummary);

// GET /api/reports/tasks/closed-by-group?groupBy=team|owner|project
router.get("/tasks/closed-by-group", authMiddleware, reportController.getTasksClosedByGroup);

module.exports = router;
