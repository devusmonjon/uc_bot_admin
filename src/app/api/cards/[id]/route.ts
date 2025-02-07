import Card from "@/database/card.model";
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

    const { name, number } = await req.json();

    const existCard = await Card.findOne({ _id: id });

    if (!existCard) {
      return NextResponse.json(
        {
          message: "Card not found",
          errors: [
            {
              code: "card_not_found",
              message: "Card not found",
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

    await Card.updateOne({ _id: id }, { name, number });

    return NextResponse.json({
      message: "success",
      errors: null,
      data: {
        card: existCard,
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

    const existCard = await Card.findOne({ _id: id });

    if (!existCard) {
      return NextResponse.json(
        {
          message: "Card not found",
          errors: [
            {
              code: "card_not_found",
              message: "Card not found",
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

    await Card.deleteOne({ _id: id });

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
