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
    const { shiftID } = reqBody;

    const tokenData = await decodeDataToken(request);
    const business = await Business.findOne({ _id: tokenData.id });

    if (!business) {
      console.log('Business not found!');
      return NextResponse.json({
        error: "Business not found",
        status: 400
      });
    }

    // Find the week that contains the target shiftID and update it
    const week = await Week.findOneAndUpdate(
      { "shifts": shiftID },
      { $pull: { "shifts": shiftID } },
      { new: true }
    );

    if (!week) {
      return NextResponse.json({
        error: "Week not found",
        status: 401
      });
    }

    // Find the shift and delete it 
    const shift = await Shift.findByIdAndDelete(shiftID);

    if (!shift) {
      return NextResponse.json({
        error: "Shift not found",
        status: 402
      });
    }

    // Save the updated week
    await week.save();

    return NextResponse.json({
      message: 'Shift has been deleted successfully',
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
