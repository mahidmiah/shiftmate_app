import mongoose from "mongoose";

const weekSchema = new mongoose.Schema({
  businessID: String,
  weekNumber: Number,
  year: Number,
  weekStartDate: String,
  weekEndDate: String,
  shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
});

const Week = mongoose.models.Week || mongoose.model('Week', weekSchema);

export default Week;