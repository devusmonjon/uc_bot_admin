import User from "@/database/botuser.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
    _: Request,
    { params }: { params: any }
  ) {
    try {
      const { id } = await params;
      await connectToDatabase();
      const session = await getServerSession(authOptions);
  
      if (!session) {
        return NextResponse.json(
          {
            errors: [
              {
                code: "unauthenticated",
                message: "You are not authenticated",
              },
            ],
            data: null,
            success: true,
            status: 401,
          },
          { status: 401 }
        );
      }
  
      const existUser = await User.findOne({ _id: id });
  
      if (!existUser) {
        return NextResponse.json(
          {
            message: "User not found",
            errors: [
              {
                code: "user_not_found",
                message: "User not found",
              },
            ],
            data: null,
            success: false,
            status: 404,
          },
          {
            status: 404,
          }
        );
      }
  
      await User.deleteOne({ _id: id });
  
      return NextResponse.json({
        message: "success",
        errors: null,
        data: {
          card: null,
        },
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Internal server Error: ", error },
        {
          status: 500,
        }
      );
    }
  }
  