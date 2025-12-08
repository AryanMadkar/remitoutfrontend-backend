// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload compressed image to Cloudinary
 * @param {Buffer} buffer - Compressed image buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary response
 */
export async function uploadToCloudinary(buffer, options = {}) {
  const {
    folder = "loan-documents",
    publicId,
    resourceType = "image",
    format = "jpg",
  } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        format,
        overwrite: false,
        // Additional optimizations
        quality: "auto:good",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image/raw)
 * @returns {Promise<Object>}
 */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`Deleted from Cloudinary: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error(`Error deleting ${publicId} from Cloudinary:`, error);
    throw error;
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs
 * @returns {Promise<void>}
 */
export async function deleteManyFromCloudinary(publicIds = []) {
  if (!publicIds || publicIds.length === 0) return;

  const deletePromises = publicIds.map((publicId) =>
    deleteFromCloudinary(publicId).catch((err) =>
      console.error(`Failed to delete ${publicId}:`, err)
    )
  );

  await Promise.allSettled(deletePromises);
}

/**
 * Get Cloudinary URL for a public ID
 * @param {string} publicId
 * @returns {string}
 */
export function getCloudinaryUrl(publicId) {
  return cloudinary.url(publicId, {
    secure: true,
    quality: "auto",
    fetch_format: "auto",
  });
}

export default cloudinary;
