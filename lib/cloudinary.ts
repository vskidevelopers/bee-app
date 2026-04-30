// lib/cloudinary.ts
import { toast } from "sonner";

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Uploads a file to Cloudinary using unsigned upload preset.
 * Returns the uploaded image data + progress callback.
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<CloudinaryUploadResult> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary configuration missing. Check your environment variables.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", `beehouseholds/products/${folder}`);
  formData.append("resource_type", "image");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            public_id: response.public_id,
            secure_url: response.secure_url,
            width: response.width,
            height: response.height,
            format: response.format,
          });
        } catch (error) {
          reject(new Error("Failed to parse Cloudinary response"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    );
    xhr.send(formData);
  });
};

/**
 * Helper: Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Helper: Validate image file before upload
 */
export const validateImageFile = (
  file: File,
): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG, WebP, or GIF images allowed",
    };
  }
  if (file.size > maxSize) {
    return { valid: false, error: "Image must be less than 5MB" };
  }
  return { valid: true };
};
