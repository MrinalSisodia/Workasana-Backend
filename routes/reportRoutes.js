const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/tasks/closed-last-week", authMiddleware,reportController.getTasksClosedLastWeek);

router.get("/tasks/pending-summary", authMiddleware, reportController.getPendingWorkSummary);


router.get("/tasks/closed-by-group", authMiddleware, reportController.getTasksClosedByGroup);

module.exports = router;
