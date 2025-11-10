/* eslint-env node */
exports.handler = async (event) => {
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
    // Get API key from server-side environment (NOT exposed to client)
    // Note: Use UPLOAD_API_KEY (without VITE_ prefix) so it's not bundled into client
    const apiKey = process.env.UPLOAD_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error - Upload API key not set',
          details: 'Please add UPLOAD_API_KEY (without VITE_ prefix) to Netlify environment variables'
        })
      };
    }

    // Parse the request body
    const { fileData, fileName, bookId } = JSON.parse(event.body);

    if (!fileData || !fileName || !bookId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing fileData, fileName, or bookId' })
      };
    }

    // Convert base64 data URL to Buffer
    const base64String = fileData.includes(',') ? fileData.split(',')[1] : fileData;
    const fileBuffer = Buffer.from(base64String, 'base64');

    // Create form data for PHP endpoint
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Append file as a Buffer with proper filename
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'image/jpeg' // Adjust based on file type if needed
    });
    formData.append('fileName', fileName);
    formData.append('apiKey', apiKey); // Add API key server-side

    // Forward to PHP endpoint
    const phpEndpoint = 'https://booksglance.com/uploads.php';
    
    const response = await fetch(phpEndpoint, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: errorData.error || 'Upload failed',
          message: errorData.message || response.statusText
        })
      };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Upload proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process upload',
        message: error.message 
      })
    };
  }
};

