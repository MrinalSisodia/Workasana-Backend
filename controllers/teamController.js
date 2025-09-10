const Team = require("../models/Team.model");

// Create new team
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ error: "Team already exists" });
    }

    const team = new Team({ name, description });
    await team.save();

    res.status(201).json({ message: "Team created successfully", team });
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Server error" });
  }
};
