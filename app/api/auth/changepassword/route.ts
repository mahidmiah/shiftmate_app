import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/models/businessModel";
import bcryptjs from 'bcryptjs';

connect();

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json();
    const {token, password} = reqBody;

    const business = await Business.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: {$gt: Date.now()}
    });
    
    if (!business) {
      return NextResponse.json({
        error: "Invalid token",
        status: 400
      });
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt)

    business.resetPasswordToken = undefined;
    business.resetPasswordTokenExpiry = undefined;
    business.password = hashedPassword;
    await business.save();

    return NextResponse.json({
      message: 'Password changed',
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    })
  }
}