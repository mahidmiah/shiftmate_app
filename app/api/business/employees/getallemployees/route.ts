import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Business from "@/models/businessModel";
import { decodeDataToken } from "@/helpers/decodeDataToken";
import Employee from "@/models/employeeModel";

connect();

export async function GET(request: NextRequest) {
  try {
    const tokenData = await decodeDataToken(request);

    const business = await Business.findOne({ _id: tokenData.id });

    if (!business) {
      return NextResponse.json({
        error: "Invalid token",
        status: 400
      });
    }

    const employeeIds = business.employees;

    // Create an array to store promises for fetching employees
    const employeePromises = employeeIds.map((employeeId: any) => {
      // Use Mongoose to find an employee by ID
      return Employee.findOne({ _id: employeeId })
        .exec()
        .then(employee => {
          if (employee) {
            // Return the found employee document or any specific properties you need
            return {
              id: employee._id,
              firstName: employee.firstName,
              lastName: employee.lastName,
              password: employee.password,
              background: employee.background,
              foreground: employee.foreground
            };
          }
        })
        .catch(error => {
          console.error('Error fetching employee:', error);
          return null;
        });
    });

    // Use Promise.all to wait for all promises to resolve
    const employees = await Promise.all(employeePromises);

    const data = {
      employees,
    };

    return NextResponse.json({
      message: 'Employees retrieved successfully',
      status: 200,
      data,
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}

