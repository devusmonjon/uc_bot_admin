import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { generateUniqueFilename } from "@/lib/helpers";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file as Blob) || null;

  const fileName = path.basename((body.file as File).name);
  const fileExtension = path.extname(fileName);
  const saveName = generateUniqueFilename(
    fileName.split(".")[0],
    fileExtension
  );
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    fs.writeFileSync(path.resolve(UPLOAD_DIR, saveName), buffer);
  } else {
    return NextResponse.json({
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
    name: saveName,
  });
};
