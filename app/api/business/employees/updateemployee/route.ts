import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Employee from "@/models/employeeModel";

connect();

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json();
    const {id, firstName, lastName, password, background, foreground} = reqBody;

    const employee = await Employee.findOne({_id: id});
    
    if (!employee) {
      return NextResponse.json({
        error: "Invalid token",
        status: 400
      });
    }

    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.password = password;
    employee.background = background;
    employee.foreground = foreground;
    await employee.save();

    return NextResponse.json({
      message: 'Employee updated!',
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    })
  }
}