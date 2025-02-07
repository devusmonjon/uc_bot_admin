import User from "@/database/botuser.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session)
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

    const { userIds } = await req.json();

    if (!userIds)
      return NextResponse.json(
        {
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

    const updateMany = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { status: true } }
    );
    return NextResponse.json({
      message: "success",
      errors: null,
      data: { updated: updateMany },
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