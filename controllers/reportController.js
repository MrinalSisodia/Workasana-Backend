const Task = require("../models/Task");
const Team = require("../models/Team");
const User = require("../models/User");
const Project = require("../models/Project");

// Helper: Get last calendar week's Monday and Sunday
function getLastWeekRange() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) - 7); // Monday of last week
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

/**
 * 1️⃣ Tasks closed last calendar week
 * Returns a daily count to feed a Chart.js line/bar chart.
 */
exports.getTasksClosedLastWeek = async (req, res) => {
  try {
    const { monday, sunday } = getLastWeekRange();

    const tasks = await Task.aggregate([
      {
        $match: {
          status: "closed",
          closedAt: { $gte: monday, $lte: sunday },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$closedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format data for Chart.js
    const labels = [];
    const data = [];

    for (let d = new Date(monday); d <= sunday; d.setDate(d.getDate() + 1)) {
      const dayStr = d.toISOString().split("T")[0];
      const match = tasks.find(t => t._id === dayStr);
      labels.push(dayStr);
      data.push(match ? match.count : 0);
    }

    res.json({ labels, data });
  } catch (err) {
    console.error("Error in getTasksClosedLastWeek:", err);
    res.status(500).json({ error: "Failed to fetch weekly closed tasks" });
  }
};

/**
 * 2️⃣ Total days of work pending
 * Returns a bar chart of total estimated time for all open tasks.
 */
exports.getPendingWorkSummary = async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: "closed" } });

    // Group by project for now (you can change grouping logic)
    const summary = {};
    tasks.forEach(task => {
      const projectName = task.project?.name || "Unassigned";
      const days = task.estimatedDays || 0;
      summary[projectName] = (summary[projectName] || 0) + days;
    });

    const labels = Object.keys(summary);
    const data = Object.values(summary);

    res.json({ labels, data });
  } catch (err) {
    console.error("Error in getPendingWorkSummary:", err);
    res.status(500).json({ error: "Failed to fetch pending work summary" });
  }
};

/**
 * 3️⃣ Tasks closed by team / owner / project
 * Useful for pie charts or grouped bar charts.
 */
exports.getTasksClosedByGroup = async (req, res) => {
  try {
    const groupBy = req.query.groupBy || "team"; // "team" | "owner" | "project"
    let groupField = "";

    switch (groupBy) {
      case "owner":
        groupField = "$owners";
        break;
      case "project":
        groupField = "$project";
        break;
      default:
        groupField = "$team";
        break;
    }

    const results = await Task.aggregate([
      { $match: { status: "closed" } },
      { $unwind: { path: groupField, preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: groupField,
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Lookup names for labels
    const labels = [];
    const data = [];

    for (const r of results) {
      if (!r._id) continue;

      let name;
      if (groupBy === "team") {
        const team = await Team.findById(r._id).select("name");
        name = team?.name || "Unknown Team";
      } else if (groupBy === "owner") {
        const user = await User.findById(r._id).select("name");
        name = user?.name || "Unknown User";
      } else {
        const project = await Project.findById(r._id).select("name");
        name = project?.name || "Unknown Project";
      }

      labels.push(name);
      data.push(r.count);
    }

    res.json({ labels, data });
  } catch (err) {
    console.error("Error in getTasksClosedByGroup:", err);
    res.status(500).json({ error: "Failed to fetch tasks closed by group" });
  }
};
