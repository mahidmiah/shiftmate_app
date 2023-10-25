import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/models/businessModel";

connect();

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json();
    const {token} = reqBody;

    const business = await Business.findOne({
      verifyToken: token,
      verifyTokenExpiry: {$gt: Date.now()}
    });
    
    if (!business) {
      return NextResponse.json({
        error: "Invalid token",
        status: 400
      });
    }

    business.verified = true;
    business.verifyToken = undefined;
    business.verifyTokenExpiry = undefined;
    await business.save();

    return NextResponse.json({
      message: 'Email verified',
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    })
  }
}