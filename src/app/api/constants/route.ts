import Constants from "@/database/constants.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const constants = await Constants.find({});
    if (constants.length < 1) {
      const new_constant = await Constants.create({
        price: 0,
      });
      return NextResponse.json({
        message: "Constants",
        errors: null,
        data: {
          constants: new_constant,
        },
      });
    }
    return NextResponse.json({
      message: "Constants",
      errors: null,
      data: {
        constants: constants[0],
      },
    });
  } catch (error) {
    return NextResponse.json({
      message: "Internal server Error: " + (await error),
      success: false,
    });
  }
}