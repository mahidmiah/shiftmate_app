import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Business from "@/models/businessModel";
import Employee from "@/models/employeeModel";
import { decodeDataToken } from "@/helpers/decodeDataToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { firstName, lastName, password, image, background, foreground } = reqBody;

    console.log(reqBody);

    const tokenData = await decodeDataToken(request);
    const business = await Business.findOne({ _id: tokenData.id });
    if (!business) {
      return NextResponse.json({
        error: "Business not found",
        status: 400,
      });
    }

    const newEmployee = new Employee({
      firstName: firstName,
      lastName: lastName,
      password: password,
      image: null,
      background: background,
      foreground: foreground
    });

    await newEmployee.save();

    // Push the new employee's _id to the business's employees array
    business.employees.push(newEmployee);

    // Save the business document with the updated employees array
    await business.save();

    return NextResponse.json({
      message: 'Employee added',
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
