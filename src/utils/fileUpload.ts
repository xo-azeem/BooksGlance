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

    // Get API key from environment variable (set in Netlify or .env file)
    const apiKey = import.meta.env.VITE_UPLOAD_API_KEY;
    
    if (!apiKey) {
      console.error('VITE_UPLOAD_API_KEY is not set. Current env keys:', 
        Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
      throw new Error('Upload API key is not configured. Please add VITE_UPLOAD_API_KEY to your environment variables.');
    }

    // Create FormData for PHP upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('apiKey', apiKey); // Send API key for authentication

    // Upload to Hostinger PHP endpoint
    const response = await fetch('https://booksglance.com/uploads.php', {
      method: 'POST',
      body: formData
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

