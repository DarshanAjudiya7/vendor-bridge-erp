import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadDir, filename);

    // Write file to public/uploads directory
    // Ensure the directory exists (we'll just let it fail if it doesn't, but usually Next.js public exists. 
    // We can use fs/promises mkdir but since this is local dev we'll create the directory if it doesn't exist).
    try {
      await writeFile(filepath, buffer);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        const { mkdir } = require("fs/promises");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(filepath, buffer);
      } else {
        throw err;
      }
    }

    // Return the URL path
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ url: fileUrl, filename: file.name, size: file.size });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
