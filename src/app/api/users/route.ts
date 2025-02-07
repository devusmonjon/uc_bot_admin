import Users from "@/database/botuser.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const page = +searchParams.get("page")! || 1;
        const limit = +searchParams.get("limit")! || 10;
        const pageNumber = page;
        const limitNumber = limit;
        const skip = (pageNumber - 1) * limitNumber;

        let query = {};
        if (search && /^\d+$/.test(search)) {  // Faqat raqam bo'lsa qidiriladi
            query = {
                $expr: {
                    $regexMatch: {
                        input: { $toString: "$telegramId" }, // telegramId ni String ga o'giramiz
                        regex: search,
                        options: "i"
                    }
                }
            };
        }

        const users = await Users.find(query).skip(skip).limit(limitNumber);
        const totalUsers = await Users.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limitNumber);

        return NextResponse.json({
            message: "Users",
            errors: null,
            data: {
                users,
                pagination: {
                    totalUsers,
                    totalPages,
                    currentPage: pageNumber,
                    limit: limitNumber
                }
            }
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            // @ts-expect-error: error is not defined
            { message: "Internal server Error", error: error.message },
            { status: 500 }
        );
    }
}
