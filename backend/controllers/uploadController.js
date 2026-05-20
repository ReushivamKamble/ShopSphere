import cloudinary from "../config/cloudinary.js";

// @desc Upload image to Cloudinary
// @route POST /api/upload
// @access Private/Admin
export const uploadImage = async (req, res) => {
  try {
    console.log("UPLOAD ROUTE HIT");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    console.log("FILE RECEIVED:", {
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Convert buffer → base64 safely
    const base64String = req.file.buffer.toString("base64");

    if (!base64String) {
      return res.status(400).json({
        success: false,
        message: "Invalid file buffer",
      });
    }

    const fileStr = `data:${req.file.mimetype};base64,${base64String}`;

    console.log("Uploading to Cloudinary...");

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "shopsphere_products",
    });

    if (!uploadedResponse || !uploadedResponse.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
      });
    }

    console.log("UPLOAD SUCCESS:", uploadedResponse.secure_url);

    res.status(200).json({
      success: true,
      imageUrl: uploadedResponse.secure_url,
    });

  } catch (error) {
    console.log("UPLOAD ERROR FULL:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
};