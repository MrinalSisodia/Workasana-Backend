const Team = require("../models/Team.model");

// --- Create new team ---
exports.createTeam = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ error: "Team already exists" });
    }

    const team = new Team({ name, description, members });
    await team.save();

    await team.populate("members", "name email");

    res.status(201).json({ message: "Team created successfully", team });
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- Fetch all teams ---
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("members", "name email");
    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId).populate("members", "name email");

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team" });
  }
};  


exports.updateTeamMembers = async (req, res) => {
  const { teamId } = req.params;
  const { members = [] } = req.body; // final list of member IDs

  try {
    const team = await Team.findByIdAndUpdate(
      teamId,
      { members },
      { new: true }
    ).populate("members", "name email");

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json({ message: "Team updated successfully", team });
  } catch (err) {
    console.error("Error updating team members:", err);
    res.status(500).json({ error: "Server error" });
  }
};
