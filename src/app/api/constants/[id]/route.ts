import Constants from "@/database/constants.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
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

    const { price } = await req.json();

    const existConstant = await Constants.findOne({ _id: id });

    if (!existConstant) {
      return NextResponse.json(
        {
          message: "Constant not found",
          errors: [
            {
              code: "constant_not_found",
              message: "Constant not found",
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

    const updated = await Constants.updateOne(
      { _id: id },
      { price },
      { new: true }
    );

    return NextResponse.json({
      message: "Constant updated",
      errors: null,
      data: {
        constant: updated,
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

export async function DELETE(
  req: Request,
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

    const deleted = await Constants.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) {
      return NextResponse.json(
        {
          message: "Constant not found",
          errors: [
            {
              code: "constant_not_found",
              message: "Constant not found",
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

    return NextResponse.json({
      message: "Constant deleted",
      errors: null,
      data: null,
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
