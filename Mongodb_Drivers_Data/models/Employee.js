const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Level: { 
    type: Number, 
    min: 1, 
    max: 3, 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    required: true 
  },
  completed: { type: Number, default: 0 },
  canceled: { type: Number, default: 0 },
  rides: { type: Number, default: 0 }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
