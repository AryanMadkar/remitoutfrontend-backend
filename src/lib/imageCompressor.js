// lib/imageCompressor.js
import sharp from "sharp";

/**
 * Compress image using sharp
 * @param {Buffer} buffer - Original image buffer
 * @param {Object} options - Compression options
 * @returns {Promise<Buffer>} - Compressed image buffer
 */
export async function compressImage(buffer, options = {}) {
  const {
    quality = 85,
    maxWidth = 1920,
    maxHeight = 1080,
    format = "jpeg",
  } = options;

  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    console.log(
      `Compressing image: ${metadata.width}x${metadata.height} (${(
        buffer.length /
        1024 /
        1024
      ).toFixed(2)} MB)`
    );

    // Resize if image is too large
    let pipeline = image.resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });

    // Convert to format and compress
    if (format === "jpeg" || format === "jpg") {
      pipeline = pipeline.jpeg({
        quality,
        progressive: true,
        mozjpeg: true,
      });
    } else if (format === "png") {
      pipeline = pipeline.png({
        quality,
        compressionLevel: 9,
      });
    } else if (format === "webp") {
      pipeline = pipeline.webp({
        quality,
      });
    }

    const compressedBuffer = await pipeline.toBuffer();

    const compressionRatio = (
      (1 - compressedBuffer.length / buffer.length) *
      100
    ).toFixed(2);

    console.log(
      `Compressed: ${(compressedBuffer.length / 1024 / 1024).toFixed(
        2
      )} MB (${compressionRatio}% reduction)`
    );

    return compressedBuffer;
  } catch (error) {
    console.error("Image compression error:", error);
    throw new Error(`Failed to compress image: ${error.message}`);
  }
}

/**
 * Compress PDF by converting to images and compressing
 * Note: For PDFs, we'll send original to Python server, then compress extracted pages
 * @param {Buffer} buffer - PDF buffer
 * @returns {Promise<Buffer>} - Original buffer (PDFs sent as-is to Python)
 */
export async function compressPDF(buffer) {
  // As per current architecture, PDFs are sent to a Python server for processing.
  // The Python server is responsible for extracting pages, potentially compressing them as images,
  // and reassembling the PDF.
  // This function currently acts as a passthrough for the original PDF buffer.
  // If direct PDF compression (e.g., optimizing PDF structure, removing unused objects)
  // were to be implemented in JavaScript, it would require a dedicated PDF manipulation library
  // (e.g., 'pdf-lib' for structural optimization, or a library capable of converting PDF to images
  // and then reassembling, which is a complex process).
  // For now, we return the original buffer as the Python service handles the heavy lifting.
  return buffer;
}

/**
 * Determine if file is an image
 * @param {string} mimetype
 * @returns {boolean}
 */
export function isImage(mimetype) {
  return mimetype.startsWith("image/");
}

/**
 * Determine if file is a PDF
 * @param {string} mimetype
 * @returns {boolean}
 */
export function isPDF(mimetype) {
  return mimetype === "application/pdf";
}
