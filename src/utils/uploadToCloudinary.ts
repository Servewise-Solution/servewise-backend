
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
  filePath: string
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "servewise",
    });

    // delete local file after upload
    fs.unlinkSync(filePath);

    return result.public_id;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
};
