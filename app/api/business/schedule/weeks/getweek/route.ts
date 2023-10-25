import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/models/businessModel";
import Employee from "@/models/employeeModel";
import { decodeDataToken } from "@/helpers/decodeDataToken";
import Week from "@/models/weekModel";

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
    
    return NextResponse.json({
      message: 'Week found',
      status: 200,
      data: foundWeek
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
