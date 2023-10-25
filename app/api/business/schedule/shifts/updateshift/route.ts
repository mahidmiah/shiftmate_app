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
    const { weekNumber, currentYear, employeeID, position, dayOfWeek, startTime, endTime, existingShiftID } = reqBody;

    const tokenData = await decodeDataToken(request);
    const business = await Business.findOne({ _id: tokenData.id });

    if (!business) {
      console.log('Business not found!');
      return NextResponse.json({
        error: "Business not found",
        status: 400
      });
    }

    const week = await Week.findOne({
      weekNumber: weekNumber,
      year: currentYear
    });

    if (!week) {
      return NextResponse.json({
        error: "Week not found",
        status: 401
      });
    }

    const getDecimalHours = (time:string) => {
      const [hours, minutes] = time.split(':');
      const minuteDecimal = parseInt(minutes) / 60;
      return parseInt(hours) + minuteDecimal;
    }
    
    const overlappingShifts = [];
    const getShiftsForWeek = week.shifts;

    // Create an array of promises for the async operations
    const asyncOperations = getShiftsForWeek.map(async (shiftID: any) => {
      const foundShift = await Shift.findById(shiftID);

      if (foundShift.dayOfWeek === dayOfWeek && foundShift.position === position && foundShift._id.toString() !== existingShiftID) {

        console.log('Found Shift: ', foundShift._id.toString(), ', Existing Shift: ', existingShiftID);
        const startTimeDecimal = getDecimalHours(startTime);
        const endTimeDecimal = getDecimalHours(endTime);
        const foundShiftStartTimeDecimal = getDecimalHours(foundShift.startTime);
        const foundShiftEndTimeDecimal = getDecimalHours(foundShift.endTime);

        if (
          (startTimeDecimal <= foundShiftStartTimeDecimal &&
            endTimeDecimal > foundShiftStartTimeDecimal &&
            endTimeDecimal <= foundShiftEndTimeDecimal) ||
          (startTimeDecimal > foundShiftStartTimeDecimal &&
            startTimeDecimal < foundShiftEndTimeDecimal &&
            endTimeDecimal >= foundShiftEndTimeDecimal) ||
          (startTimeDecimal <= foundShiftStartTimeDecimal &&
            endTimeDecimal >= foundShiftEndTimeDecimal)
        ) {
          overlappingShifts.push(foundShift);
        }
      }
    });

    // Wait for all promises to resolve
    await Promise.all(asyncOperations);

    if (overlappingShifts.length > 0) {
      return NextResponse.json({
        error: 'Shift overlaps',
        status: 402,
      });
    }

    // No overlap detected, continue on,
    console.log('1. No overlap detected!')

    // Delete the old shift
    const shiftIndex = week.shifts.findIndex((shift: any) => shift._id.toString() === existingShiftID);
    console.log('2. Deleting old shift from old week!')
    await week.shifts.splice(shiftIndex, 1);

    // Delete the old shift
    // Find the shift and delete it 
    console.log('3. Deleting old shift from Shifts collection!')
    await Shift.deleteOne({ _id: existingShiftID });

    // Create and save the new shift
    console.log('4. Creasting the new shift object!')
    const newShift = new Shift({
      businessID: tokenData.id,
      employeeID: employeeID,
      year: currentYear,
      position: position,
      dayOfWeek: dayOfWeek,
      startTime: startTime,
      endTime: endTime
    });
    
    console.log('5. Saving the shift to the week, and also the object itself!')
    await newShift.save();
    week.shifts.push(newShift);
    await week.save();

    console.log('6. Done!')
    return NextResponse.json({
      message: 'Shift has been created successfully',
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}

