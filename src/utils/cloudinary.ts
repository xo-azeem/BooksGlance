/**
 * Upload image to Cloudinary via server-side Netlify Function
 * This keeps Cloudinary credentials private and not exposed to client
 * @param file - The image file to upload
 * @param bookId - The book ID to use as the public_id in Cloudinary
 * @returns Promise<string> - The uploaded image URL
 */
export const uploadImageToCloudinary = async (
  file: File,
  bookId: string
): Promise<string> => {
  try {
    // Convert file to base64 for server upload
    const fileData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Call our server-side Netlify function (credentials are private)
    const response = await fetch('/.netlify/functions/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileData,
        bookId,
        fileName: file.name
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Failed to upload image');
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Generate Cloudinary URL with transformations
 * Note: This only generates URLs for already-uploaded images
 * The cloud name is public since it's in the image URL anyway
 * @param publicId - The public_id of the image
 * @param transformations - Optional Cloudinary transformations
 * @returns The transformed image URL
 */
export const getCloudinaryImageUrl = (
  publicId: string,
  transformations?: string
): string => {
  // Cloud name can be public - it's visible in image URLs anyway
  // But we'll get it from a server endpoint if needed, or use a public constant
  // For now, we'll construct URLs from the public_id which already includes the path
  const baseUrl = 'https://res.cloudinary.com';
  const transformString = transformations ? `${transformations}/` : '';
  // publicId should already include BooksGlance/ prefix from upload
  return `${baseUrl}/image/upload/${transformString}${publicId}`;
};

