import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/models/businessModel";
import Employee from "@/models/employeeModel";
import { decodeDataToken } from "@/helpers/decodeDataToken";
import Week from "@/models/weekModel";
import Shift from "@/models/shiftModel";

connect();

export async function POST(request: NextRequest) {
  try {

    const reqBody = await request.json();
    const { year, week } = reqBody;

    const data = await decodeDataToken(request);

    const business = await Business.findOne({ _id: data.id });

    if (!business) {
      return NextResponse.json({
        error: "User not found",
        status: 400,
      });
    }

    const foundWeek = await Week.findOne({
      businessID: data.id,
      weekNumber: week, // Use weekNumber instead of week
      year: year,
    });

    if (!foundWeek) {
      return NextResponse.json({
        error: "Week not found",
        status: 401,
      });
    }
    
    const getDecimalHours = (time:string) => {
      const [hours, minutes] = time.split(':');
      const minuteDecimal = parseInt(minutes) / 60;
      return parseInt(hours) + minuteDecimal;
    }

    // get all the weekly shifts
    const employeeHours: { [key: string]: number | undefined } = {};
    const weekShifts = foundWeek.shifts;

    const calculateHoursPromise = weekShifts.map(async (shiftID:any) => {
      const foundShift = await Shift.findById(shiftID.toString());
      const foundEmployee = await Employee.findById(foundShift.employeeID);
      const key = `${foundEmployee.firstName} ${foundEmployee.lastName}`;
      const timeDifference = getDecimalHours(foundShift.endTime) - getDecimalHours(foundShift.startTime);
      employeeHours[key] = (employeeHours[key] ?? 0) + timeDifference;
    });

    // Wait for all promises to resolve
    await Promise.all(calculateHoursPromise);

    console.log(employeeHours);

    return NextResponse.json({
      message: 'Hours calulated',
      status: 200,
      data: employeeHours
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
