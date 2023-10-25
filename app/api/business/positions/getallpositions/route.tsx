import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Business from "@/models/businessModel";
import { decodeDataToken } from "@/helpers/decodeDataToken";
import Employee from "@/models/employeeModel";

connect();

export async function GET(request: NextRequest) {
  try {

    const tokenData = await decodeDataToken(request);

    const business = await Business.findOne({ _id: tokenData.id });

    if (!business) {
      return NextResponse.json({
        error: "Business not found",
        status: 400
      });
    }

    const data = {
      positions: business.positions,
    };

    return NextResponse.json({
      message: 'Positions retrieved successfully',
      status: 200,
      data,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
