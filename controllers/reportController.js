const Task = require("../models/Task.model");
const Team = require("../models/Team.model");
const User = require("../models/User.model");
const Project = require("../models/Project.model");

/**
 * 1️⃣ Tasks completed in last 7 days
 * Returns daily counts for Chart.js
 */
exports.getTasksClosedLastWeek = async (req, res) => {
  try {
    const days = 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const tasks = await Task.aggregate([
      {
        $match: {
          status: "Completed",
          updatedAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = [];
    const data = [];

    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const dayStr = d.toISOString().split("T")[0];
      const match = tasks.find(t => t._id === dayStr);
      labels.push(dayStr);
      data.push(match ? match.count : 0);
    }

    res.json({ labels, data });
  } catch (err) {
    console.error("Error in getTasksCompletedLast7Days:", err);
    res.status(500).json({ error: "Failed to fetch completed tasks" });
  }
};

exports.getPendingWorkSummary = async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: "Completed" } });

    const summary = {};
    tasks.forEach(task => {
      const projectName = task.project?.name || "Unassigned";
      const days = task.timeToComplete || 0; // <-- use timeToComplete
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


exports.getTasksClosedByGroup = async (req, res) => {
  try {
    const groupBy = req.query.groupBy || "team"; // "team" | "owner" | "project"

    let groupField = "";
    let fromCollection = "";
    let asField = "details";

    switch (groupBy) {
      case "owner":
        groupField = "$owners";
        fromCollection = "users";
        break;
      case "project":
        groupField = "$project";
        fromCollection = "projects";
        break;
      default:
        groupField = "$team";
        fromCollection = "teams";
        break;
    }

    const results = await Task.aggregate([
      { $match: { status: "Completed" } },

      // If grouping by owner, unwind the owners array
      ...(groupBy === "owner"
        ? [{ $unwind: { path: "$owners", preserveNullAndEmptyArrays: true } }]
        : []),

      // Group by the field (_id is the owner/team/project id)
      {
        $group: {
          _id: groupBy === "owner" ? "$owners" : groupBy === "project" ? "$project" : "$team",
          count: { $sum: 1 },
        },
      },

      // Lookup name from the related collection
      {
        $lookup: {
          from: fromCollection,
          localField: "_id",
          foreignField: "_id",
          as: asField,
        },
      },
      {
        $addFields: {
          name: { $arrayElemAt: [`$${asField}.name`, 0] },
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $ifNull: [
              "$name",
              groupBy === "owner"
                ? "Unknown User"
                : groupBy === "team"
                ? "Unknown Team"
                : "Unknown Project",
            ],
          },
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    const labels = results.map(r => r.name);
    const data = results.map(r => r.count);

    res.json({ labels, data });
  } catch (err) {
    console.error("Error in getTasksCompletedByGroup:", err);
    res.status(500).json({ error: "Failed to fetch tasks completed by group" });
  }
};
