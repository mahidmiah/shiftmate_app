import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/models/businessModel";
import { decodeDataToken } from "@/helpers/decodeDataToken";

connect();

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json();
    const {businessName, businessAddress, ownerFirstName, ownerLastName} = reqBody

    const data = await decodeDataToken(request);

    const business = await Business.findOne({_id: data.id});
    
    if (!business) {
      return NextResponse.json({
        error: "User not found",
        status: 400
      });
    }

    business.businessName = businessName;
    business.businessAddress = businessAddress;
    business.ownerFirstName = ownerFirstName;
    business.ownerLastName = ownerLastName;
    await business.save();

    return NextResponse.json({
      message: 'Profile updated',
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    })
  }
}