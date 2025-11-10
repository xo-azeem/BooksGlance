/**
 * Upload image to Hostinger server via PHP endpoint
 * Files are stored in public_html/uploads folder on Hostinger
 * @param file - The image file to upload
 * @param bookId - The book ID to use as the filename
 * @returns Promise<string> - The uploaded image URL
 */
export const uploadImageToHostinger = async (
  file: File,
  bookId: string
): Promise<string> => {
  try {
    // Get file extension
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${bookId}.${fileExtension}`;

    // Convert file to base64 for server upload
    const fileData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Upload via Netlify function proxy (API key is added server-side, not exposed to client)
    const response = await fetch('/.netlify/functions/upload-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileData,
        fileName,
        bookId
      })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to upload image';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error('Upload error details:', errorData);
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    if (result.success && result.url) {
      return result.url;
    } else if (result.error) {
      throw new Error(result.error);
    } else {
      throw new Error('Upload failed: Invalid response from server');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to upload image to Hostinger');
  }
};

