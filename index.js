const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initializeDatabase } = require("./db/db.connect"); 
const authRoutes = require("./routes/authRoutes");    
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); 
/* app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});*/


// --- Routes ---
app.use("/api/auth", authRoutes); 
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);



initializeDatabase()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err.message);
  });
