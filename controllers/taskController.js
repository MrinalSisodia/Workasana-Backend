const mongoose = require("mongoose");
const Task = require("../models/Task.model");

// --- Allowed fields for update ---
const allowedUpdateFields = [
  "name",
  "project",
  "team",
  "owners",
  "tags",
  "timeToComplete",
  "status",
  "priority",
  "dueDate",
];

// --- Create Task ---
exports.createTask = async (req, res) => {
  try {
    const { name, project, team, owners, tags, timeToComplete, status } = req.body;

    const newTask = new Task({
      ...req.body,
      tags: tags || [],
      status: status || "To Do",
    });

    const savedTask = await newTask.save();

    const taskForResponse = await Task.findById(savedTask._id)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .lean();

    res.status(201).json({ message: "Task created successfully", task: taskForResponse });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- Get Tasks with filtering ---
exports.getTasks = async (req, res) => {
  try {
    const { owner, team, project, status, tags, dueBefore, dueAfter } = req.query;

    const filter = {};

    if (owner && mongoose.Types.ObjectId.isValid(owner)) filter.owners = owner;
    if (team && mongoose.Types.ObjectId.isValid(team)) filter.team = team;
    if (project && mongoose.Types.ObjectId.isValid(project)) filter.project = project;
    if (status) filter.status = { $in: status.split(",") };
    if (tags) filter.tags = { $in: tags.split(",") };
    if (dueBefore || dueAfter) filter.dueDate = {};
    if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
    if (dueAfter) filter.dueDate.$gte = new Date(dueAfter);

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .lean();

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- Update Task ---
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Only update allowed fields
    Object.keys(updates).forEach((key) => {
      if (allowedUpdateFields.includes(key)) {
        task[key] = updates[key];
      }
    });

    await task.save(); 

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .lean();

    res.json({ message: "Task updated successfully", task: populatedTask });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Server error" });
  }
};



exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid Task ID" });
    const task = await Task.findById(id)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .lean();
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// --- Delete Task ---
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Server error" });
  }
};
