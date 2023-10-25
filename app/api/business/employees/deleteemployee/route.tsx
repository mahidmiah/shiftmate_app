import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/models/businessModel";
import Employee from "@/models/employeeModel";
import Shift from "@/models/shiftModel";
import Week from "@/models/weekModel";
import { decodeDataToken } from "@/helpers/decodeDataToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, firstName } = reqBody;

    console.log('Employee ID:', id);
    console.log('Employee Name:', firstName);

    const tokenData = await decodeDataToken(request);

    const business = await Business.findOne({ _id: tokenData.id });

    if (!business) {
      return NextResponse.json({
        error: "Business not found",
        status: 400,
      });
    }

    // Remove the employee from business.employees using $pull
    await Business.updateOne(
      { _id: business._id },
      { $pull: { employees: id } }
    );

    await Employee.deleteOne({ _id: id });

    // Find all shifts associated with the employee
    const shiftsToDelete = await Shift.find({ employeeID: id });

    // Iterate through each shift to delete and remove from weeks
    for (const shift of shiftsToDelete) {
      // Delete the shift
      await Shift.deleteOne({ _id: shift._id });

      // Iterate through each week in business.weeks
      for (const week of business.weeks) {
        // Remove the shift from week.shifts using $pull
        await Week.updateOne(
          { _id: week._id },
          { $pull: { shifts: shift._id } }
        );
      }
    }

    return NextResponse.json({
      message: 'Employee deleted',
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
