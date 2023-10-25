import mongoose from "mongoose";
import Employee from "./employeeModel";
import Week from "./weekModel";
import Shift from "./shiftModel";

const businessSchema = new mongoose.Schema({
  subscription: {
    type: String,
    required: [true, 'Please provide a subscription.'],
  },
  businessName: {
    type: String,
    required: [true, 'Please provide a business name.'],
  },
  businessAddress: {
    streetLine1: String,
    streetLine2: String,
    city: String,
    postCode: String,
  },
  businessType: {
    type: String,
    required: [true, 'Please provide a business type.'],
  },
  ownerFirstName: {
    type: String,
    required: [true, 'Please provide an owner FIRST name.'],
  },
  ownerLastName: {
    type: String,
    required: [true, 'Please provide an owner LAST name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
  logo: {
    type: String,
    default: null, // Set the default value to null
  },
  darkMode: {
    type: Boolean,
    default: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifyToken: String,
  verifyTokenExpiry: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpiry: Date,
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee', // Reference the Employee model
    },
  ],
  positions: {
    type: [String], // Assuming positions are strings
    default: null, // Set default value to null
  },
  weeks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Week', // Reference the Week model
    },
  ],
  shiftSwaps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift', // Reference the Shift model
    },
  ],
  reports: {
    type: [String],
    default: null,
  },
  config: {
    type: Object, // You can specify a more specific schema if needed
    default: null
  }
});

const Business = mongoose.models.Business || mongoose.model('Business', businessSchema);

export default Business;