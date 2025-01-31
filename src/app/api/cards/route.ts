import Card from "@/database/card.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions)
        
        const cards = await Card.find({})

        return NextResponse.json({
            message: "Cards",
            errors: null,
            data: {
                cards
            }
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal server Error: ", error}, {
            status: 500
        })
    }
}
export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions)
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

        const {name, number} = await req.json()

        const existCard = await Card.findOne({number})
        if (existCard) {
            return NextResponse.json({
                message: "Card already exist",
                errors: [{
                    code: "card_exist",
                    message: "Card already exist"
                }],
                data: null
            }, {
                status: 400
            })
        }

        const card = await Card.create({
            name,
            number
        })
        
        return NextResponse.json({
            message: "Hello world",
            errors: null,
            data: {
                card
            }
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal server Error: ", error}, {
            status: 500
        })
    }
}
export async function PUT(req: Request) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions)
        
        return NextResponse.json({
            message: "Hello world"
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal server Error: ", error}, {
            status: 500
        })
    }
}
export async function DELETE(req: Request) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions)
        
        return NextResponse.json({
            message: "Hello world"
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal server Error: ", error}, {
            status: 500
        })
    }
}