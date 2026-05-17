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

  // Cloudinary explicitly requires 'image' resource type to handle PDFs properly 
  // without triggering the strict 'raw' download blocks, but we also explicitly
  // use 'auto' so it correctly attaches the .pdf extension
  const resourceType = "auto";

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

export const getSafePdfUrl = (url) => {
  // We no longer inject fl_attachment because it forces a download 
  // rather than letting the browser open the PDF inline.
  // NOTE: Cloudinary free tier blocks PDF delivery by default. 
  // You must enable it in Cloudinary Settings -> Security -> Restricted Media Types.
  return url || '';
};
