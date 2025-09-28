const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
 name: { type: String, required: true },
 project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Refers to Project model
 team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }, // Refers to Team model
 owners: [
 { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Refers to User model (owners)
 ],
 tags: [{ type: String }],
   dueDate: { type: Date, required: true }, 

 status: {
 type: String,
 enum: ['To Do', 'In Progress', 'Completed', 'Blocked'],
 default: 'To Do'
 },
   timeToComplete: { type: Number},
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
 }, { timestamps: true });

taskSchema.pre('save', function (next) {
 this.updatedAt = Date.now();
 next();
});
module.exports = mongoose.model('Task', taskSchema);