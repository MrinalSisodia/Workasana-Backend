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

// --- Update team members (add/remove) ---
exports.updateTeamMembers = async (req, res) => {
  const { teamId } = req.params;
  const { addMembers = [], removeMembers = [] } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Add members (no duplicates)
    team.members = [
      ...new Set([...team.members.map(m => m.toString()), ...addMembers])
    ];

    // Remove members
    if (removeMembers.length > 0) {
      team.members = team.members.filter(
        memberId => !removeMembers.includes(memberId.toString())
      );
    }

    await team.save();
    await team.populate("members", "name email");

    res.json({ message: "Team updated successfully", team });
  } catch (err) {
    console.error("Error updating team members:", err);
    res.status(500).json({ error: "Server error" });
  }
};
