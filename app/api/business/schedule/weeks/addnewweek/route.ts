import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Business from "@/models/businessModel";
import { decodeDataToken } from "@/helpers/decodeDataToken";
import Week from "@/models/weekModel";
import Shift from "@/models/shiftModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { weekNumber, year, weekStartDate, weekEndDate } = reqBody;

    const tokenData = await decodeDataToken(request);
    const business = await Business.findOne({ _id: tokenData.id });

    if (!business) {
      return NextResponse.json({
        error: "Business not found",
        status: 400,
      });
    }

    // Get the second-to-last week (previous week)
    console.log('0.1 called')
    console.log(business.weeks)
    const previousWeekID = (business.weeks.length >= 1 ? business.weeks[business.weeks.length - 1].toString() : null);
    console.log('Previoius week: ', previousWeekID)

    if (!previousWeekID) {
      const newWeek = new Week({
        businessID: tokenData.id,
        weekNumber: weekNumber,
        year: year,
        weekStartDate: weekStartDate,
        weekEndDate: weekEndDate
      });
  
      await newWeek.save();
  
      business.weeks.push(newWeek);
  
      await business.save();
      
      return NextResponse.json({
        message: 'Week has been created successfully',
        status: 200,
      });
    }

    const previousWeek = await Week.findById(previousWeekID);
    const previousWeekShifts = previousWeek.shifts;
    console.log('previousWeekShifts :', previousWeekShifts)

    // Create new shifts for the new week based on the previous week's shifts
    console.log('Point 1')
    const newWeekShiftPromises = previousWeekShifts.map(async (previousShiftID: any) => {
      const previousShift = await Shift.findById(previousShiftID.toString());
      const newShift = new Shift({
        businessID: previousShift.businessID,
        employeeID: previousShift.employeeID,
        year: year,
        position: previousShift.position,
        dayOfWeek: previousShift.dayOfWeek,
        startTime: previousShift.startTime,
        endTime: previousShift.endTime,
      });
      console.log('New Shift: ', newShift);
      return newShift;
    });
    console.log('Point 1.5')

    // Save all the new shifts in one go
    console.log('Point 2')
    const newWeekShifts = await Promise.all(newWeekShiftPromises);
    await Shift.insertMany(newWeekShifts);

    // Create a new Week document
    const newWeek = new Week({
      businessID: tokenData.id,
      weekNumber: weekNumber,
      year: year,
      weekStartDate: weekStartDate,
      weekEndDate: weekEndDate,
    });

    // Update the new week's shifts array with the newly created shift _ids
    console.log('Point 3')
    newWeek.shifts = newWeekShifts.map((shift:any) => shift._id);

    // Save the new week with the updated shifts array
    await newWeek.save();
    business.weeks.push(newWeek);
    await business.save();

    console.log('Point 4')
    return NextResponse.json({
      message: 'Week has been created successfully',
      status: 200,
    });
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
