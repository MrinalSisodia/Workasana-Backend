const mongoose = require("mongoose");
const Project = require("../models/Project.model");

exports.createProject = async(req, res) => {
     try {
    const { name, description } = req.body;

    const existing = await Project.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Project with this name already exists" });
    }

    const project = new Project({ name, description });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}; 

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID format" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const tasks = await Task.find({ project: project._id })
      .populate("owners", "name email")
      .populate("team", "name")
      .lean();

    res.json({ ...project.toObject(), tasks });

  } catch (error) {
    console.error("Error in getProjectById:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};