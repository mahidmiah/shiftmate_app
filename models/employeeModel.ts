import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  image: {
    type: String,
    default: null
  },
  background: String,
  foreground: String,
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default Employee;