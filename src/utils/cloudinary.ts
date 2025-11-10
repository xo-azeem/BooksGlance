/**
 * Upload image to Cloudinary
 * @param file - The image file to upload
 * @param bookId - The book ID to use as the public_id in Cloudinary
 * @returns Promise<string> - The uploaded image URL
 */
export const uploadImageToCloudinary = async (
  file: File,
  bookId: string
): Promise<string> => {
  // Validate environment variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || cloudName === 'your_cloud_name_here') {
    throw new Error('Cloudinary Cloud Name is not configured. Please check your .env file.');
  }

  if (!uploadPreset || uploadPreset === 'your_upload_preset_name_here') {
    throw new Error('Cloudinary Upload Preset is not configured. Please check your .env file.');
  }

  // Sanitize bookId for Cloudinary public_id (only alphanumeric, underscores, and hyphens)
  const sanitizedBookId = bookId.replace(/[^a-zA-Z0-9_-]/g, '_');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  // Set folder and public_id together - public_id should include folder path
  formData.append('public_id', `BooksGlance/${sanitizedBookId}`);
  // Note: 'overwrite' is not allowed with unsigned uploads

  try {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log('Uploading to Cloudinary:', {
      cloudName,
      uploadPreset,
      publicId: `BooksGlance/${sanitizedBookId}`,
      fileName: file.name,
      fileSize: file.size
    });

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      // Try to get error details from Cloudinary
      let errorMessage = 'Failed to upload image to Cloudinary';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
        console.error('Cloudinary error details:', errorData);
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = `Cloudinary upload failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Generate Cloudinary URL with transformations
 * @param publicId - The public_id of the image
 * @param transformations - Optional Cloudinary transformations
 * @returns The transformed image URL
 */
export const getCloudinaryImageUrl = (
  publicId: string,
  transformations?: string
): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const transformString = transformations ? `${transformations}/` : '';
  return `${baseUrl}/${transformString}BooksGlance/${publicId}`;
};

