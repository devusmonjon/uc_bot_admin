import Collection from "@/database/collection.model";
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

    const { name, image, price } = await req.json();

    const existCollection = await Collection.findOne({ _id: id });

    if (!existCollection) {
      return NextResponse.json(
        {
          message: "Collection not found",
          errors: [
            {
              code: "card_not_found",
              message: "Collection not found",
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

    await Collection.updateOne({ _id: id }, { name, image, price });

    return NextResponse.json({
      message: "success",
      errors: null,
      data: {
        collection: existCollection,
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

    const existCollection = await Collection.findOne({ _id: id });

    if (!existCollection) {
      return NextResponse.json(
        {
          message: "Collection not found",
          errors: [
            {
              code: "collection_not_found",
              message: "Collection not found",
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

    await Collection.deleteOne({ _id: id });

    return NextResponse.json({
      message: "success",
      errors: null,
      data: {
        collection: null,
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
