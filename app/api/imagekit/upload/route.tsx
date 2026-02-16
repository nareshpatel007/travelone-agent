import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: Request) {
    try {
        // Get form data
        const formData = await req.formData();
        const folderName = formData.get("folder") as string || "temp";
        const file = formData.get("file") as File;

        // Check if file is present
        if (!file) {
            return NextResponse.json({ error: "File missing" }, { status: 400 });
        }

        // Upload file
        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate unique filename with current file extension
        const extension = file.name.split(".").pop();
        const fileName = `${folderName}-${Date.now()}.${extension}`;

        // Upload file
        const upload = await imagekit.upload({
            file: buffer,
            fileName: fileName,
            folder: "/" + folderName,
        });

        // Return response
        return NextResponse.json({
            url: upload.url
        });
    } catch (error) {
        // Return error
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
