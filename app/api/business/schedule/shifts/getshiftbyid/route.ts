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
    const {shiftID} = reqBody;

    const tokenData = await decodeDataToken(request);
    const business = await Business.findOne({ _id: tokenData.id });

    if (!business) {
      return NextResponse.json({
        error: "Business not found",
        status: 400
      });
    }

    const shift = await Shift.findOne({_id: shiftID});
    
    return NextResponse.json({
      message: 'Shift has been found successfully',
      status: 200,
      data: shift
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
