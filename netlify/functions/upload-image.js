exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get server-side credentials (NOT exposed to client)
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Parse the request body - expecting base64 encoded file
    const { fileData, bookId, fileName } = JSON.parse(event.body);

    if (!fileData || !bookId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing fileData or bookId' })
      };
    }

    // Sanitize bookId for Cloudinary public_id
    const sanitizedBookId = bookId.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Cloudinary accepts base64 data directly
    // Extract base64 string (remove data:image/...;base64, prefix if present)
    const base64String = fileData.includes(',') ? fileData.split(',')[1] : fileData;

    // Upload to Cloudinary using server-side credentials
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    // Create form data - Cloudinary accepts base64 in 'file' parameter
    const formData = new URLSearchParams();
    formData.append('file', `data:image/jpeg;base64,${base64String}`);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'BooksGlance');
    formData.append('public_id', sanitizedBookId);

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }

    const result = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: result.secure_url,
        publicId: result.public_id
      })
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to upload image',
        message: error.message 
      })
    };
  }
};

