import { decodeDataToken } from "@/helpers/decodeDataToken";

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Business from "@/models/businessModel";

connect();

export async function GET(request:NextRequest){
  try {
    const data = await decodeDataToken(request);
    const business = await Business.findOne({_id: data.id});
    
    const serverData = {
      darkMode: business.darkMode,
    }

    return NextResponse.json({
      data: serverData
    })
  } catch (error:any) {
      return NextResponse.json({
        error: error.message,
        status: 400
      });
    }
}