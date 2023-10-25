import { connect } from "@/dbConfig/dbConfig";
import Business from "@/models/businessModel"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request: NextRequest){
    try {
        
        const reqBody = await request.json();
        const {email, password} = reqBody;

        //check if the user exists
        const business = await Business.findOne({email});
        if (!business){
          return NextResponse.json({
              error: 'User does not exist!',
              status: 400
          })
        }

        // Check the password
        const validPassword = await bcryptjs.compare(password, business.password);
        if (!validPassword){
          return NextResponse.json({
            error: 'Invalid password!',
            status: 401
          })
        }
        
        // Check if business has been verified
        if(business.verified === false){
          return NextResponse.json({
            error: 'Business has not been verified!',
            status: 402
          })
        }

        // Create the token data
        const tokenData = {
          id: business._id,
        }

        // Create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'});

        const response = NextResponse.json({
          message: 'Login Successful',
          status: 200
        });

        response.cookies.set('token', token, {httpOnly: true});

        return response;

    } catch (error: any) {
        return NextResponse.json({
          error: error.message,
          status: 500
        })
    }
}