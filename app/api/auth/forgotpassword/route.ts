import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/models/businessModel";
import bcryptjs from 'bcryptjs';
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json();
    const {email} = reqBody;

    const business = await Business.findOne({email})
    
    if (!business) {
      return NextResponse.json({
        error: "Invalid token",
        status: 400
      });
    }

    // Send reset password email
    await sendEmail({email, emailType: 'RESET', businessID: business._id});

    return NextResponse.json({
      message: 'Password reset email sent',
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    })
  }
}