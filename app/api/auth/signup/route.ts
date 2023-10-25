import { connect } from "@/dbConfig/dbConfig";
import Business from "@/models/businessModel"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json()
    const {businessName, streetLine1, streetLine2, city, postCode, businessType, ownerFirstName, ownerLastName, password, email} = reqBody

    const business = await Business.findOne({email})

    // Check if business already exists
    if (business){
      return NextResponse.json({
        error: "Business already exists",
        status: 400
      })
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create new business
    const newBusiness = new Business({
      businessName: businessName,
      businessAddress: {
        streetLine1: streetLine1,
        streetLine2: streetLine2,
        city: city,
        postCode: postCode,
      },
      businessType: businessType,
      ownerFirstName: ownerFirstName,
      ownerLastName: ownerLastName,
      password: hashedPassword,
      email: email,
      subscription: 'free',
      darkMode: false,
    });

    // Save the business
    const savedBusiness = await newBusiness.save();

    // Send verification email
    await sendEmail({email, emailType: 'VERIFY', businessID: savedBusiness._id});

    return NextResponse.json({
      message: 'Business created successfully',
      status: 201
    })

  } 
  catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500
    })
  }
}