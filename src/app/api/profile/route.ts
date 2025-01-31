import User from "@/database/user.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request
) {
  try {
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

    // @ts-expect-error
    const user = await User.findById(session.user._id);

    if (!user) {
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

    const { name, email, username } = await req.json();

    user.name = name;
    user.email = email;
    user.username = username;

    await user.save();

    return NextResponse.json({
      message: "User updated",
      errors: null,
      data: {
        user,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      message: "Internal server error",
      errors: [
        {
          code: "internal_server_error",
          message: "Internal server error",
        },
      ],
      data: null,
      success: false,
      status: 500,
    });
  }
}
