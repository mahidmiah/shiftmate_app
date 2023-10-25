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
            id: business.id,
            darkMode: business.darkMode,
            businessName: business.businessName,
            businessType: business.businessType,
            logo: business.logo,
            businessAddress: {
                streetLine1: business.businessAddress.streetLine1,
                streetLine2: business.businessAddress.streetLine2,
                city: business.businessAddress.city,
                postCode: business.businessAddress.postCode
            },
            email: business.email,
            ownerFirstName: business.ownerFirstName,
            ownerLastName: business.ownerLastName,
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