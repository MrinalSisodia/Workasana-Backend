const mongoose = require("mongoose");
const Task = require("../models/Task.model");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { name, project, team, owners, tags, timeToComplete, status } = req.body;

    // Validation
    if (!name || !project || !team || !owners || owners.length === 0 || !timeToComplete) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }
    if (!mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(team)) {
      return res.status(400).json({ error: "Invalid Team ID" });
    }
    for (const ownerId of owners) {
      if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        return res.status(400).json({ error: `Invalid Owner ID: ${ownerId}` });
      }
    }

    const newTask = new Task({
      name,
      project,
      team,
      owners,
      tags: tags || [],
      timeToComplete,
      status: status || "To Do",
    });

    const savedTask = await newTask.save();

    // Manual population for create endpoint
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

// Get tasks with URL-based filtering
exports.getTasks = async (req, res) => {
  try {
    const { owner, team, project, status, tags } = req.query;

    const filter = {};
    if (owner && mongoose.Types.ObjectId.isValid(owner)) filter.owners = owner;
    if (team && mongoose.Types.ObjectId.isValid(team)) filter.team = team;
    if (project && mongoose.Types.ObjectId.isValid(project)) filter.project = project;
    if (status) filter.status = status;
    if (tags) filter.tags = { $in: tags.split(",") };

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

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }
    if (updates.project && !mongoose.Types.ObjectId.isValid(updates.project)) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }
    if (updates.team && !mongoose.Types.ObjectId.isValid(updates.team)) {
      return res.status(400).json({ error: "Invalid Team ID" });
    }
    if (updates.owners) {
      for (const ownerId of updates.owners) {
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
          return res.status(400).json({ error: `Invalid Owner ID: ${ownerId}` });
        }
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const taskForResponse = await Task.findById(updatedTask._id)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .lean();

    res.json({ message: "Task updated successfully", task: taskForResponse });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Server error" });
  }
};
