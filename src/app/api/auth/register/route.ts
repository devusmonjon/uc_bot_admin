import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  let error: boolean = false;
  const errors: { code: string; message: string }[] = [];
  try {
    await connectToDatabase();
    const { email, password, username, fullName } = await req.json();

    const usernameExists = await User.findOne({
      username: username.toLowerCase(),
    });

    if (usernameExists)
      errors.push({
        code: "username_exist",
        message: "Username already exists",
      });
    const hashedPassword = await hash(password, 10);

    if (error) {
      return NextResponse.json(
        { payload: null, errors, status: 400, success: false },
        { status: 400 }
      );
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      fullName,
    });

    return NextResponse.json({
      payload: user,
      errors: error ? errors : null,
      status: 200,
      success: true,
    });
  } catch (error) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 500 });
  }
}
