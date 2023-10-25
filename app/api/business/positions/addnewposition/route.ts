import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from 'next/server';
import Business from '@/models/businessModel';
import { decodeDataToken } from "@/helpers/decodeDataToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { position } = reqBody;

    const data = await decodeDataToken(request);

    const business = await Business.findOne({_id: data.id});

    if (!business) {
      return NextResponse.json({
        error: 'Business not found',
        status: 404,
      });
    }

    // Add the new position to the 'positions' array
    await business.positions.push((position as string).toLowerCase());

    // Save the updated business document
    await business.save();

    return NextResponse.json({
      message: 'Position added successfully',
      business,
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
