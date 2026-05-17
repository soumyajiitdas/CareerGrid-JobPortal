export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    alert("Cloudinary credentials are not set in the .env file.");
    return null;
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset);

  // Use 'raw' resource type for PDFs so Cloudinary doesn't reject them
  const resourceType = file.type === "application/pdf" ? "raw" : "image";

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: "POST", body: data }
    );
    const result = await res.json();

    if (result.error) {
      console.error("Cloudinary error:", result.error.message);
      alert("Upload failed: " + result.error.message);
      return null;
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return null;
  }
};

/**
 * Given a Cloudinary PDF URL, returns a Google Docs viewer URL so it
 * opens inline in the browser without needing a PDF plugin.
 */
export const getPdfViewerUrl = (pdfUrl) => {
  if (!pdfUrl) return null;
  return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
};
