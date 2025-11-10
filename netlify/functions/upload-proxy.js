/* eslint-env node */
/* eslint-disable */
const FormData = require('form-data');

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
    
    // Debug: Log available env vars (without exposing the key itself)
    console.log('UPLOAD_API_KEY exists:', !!apiKey);
    console.log('UPLOAD_API_KEY length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      console.error('UPLOAD_API_KEY is not set in Netlify environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error - Upload API key not set',
          details: 'Please add UPLOAD_API_KEY (without VITE_ prefix) to Netlify environment variables. Make sure to redeploy after adding the variable.'
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

    // Instead of sending multipart/form-data (which can be dropped/modified by some hosts),
    // send a JSON body containing the base64 file data. The PHP endpoint will accept both
    // multipart uploads and JSON base64 payloads (backwards compatible).
    const phpEndpoint = 'https://booksglance.com/uploads.php';

    // Prepare JSON payload (fileData is already a data URL string)
    const jsonBody = JSON.stringify({ fileData, fileName, bookId });

    console.log('Sending request to PHP endpoint as JSON');
    console.log('API key in header:', !!apiKey);
    console.log('File name:', fileName);
    console.log('Approx payload size (bytes):', Buffer.byteLength(jsonBody, 'utf8'));

    const response = await fetch(phpEndpoint, {
      method: 'POST',
      body: jsonBody,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });
    
    console.log('PHP endpoint response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || response.statusText;
      
      // Log detailed error for debugging
      console.error('PHP endpoint error:', {
        status: response.status,
        error: errorMessage,
        apiKeySet: !!apiKey,
        apiKeyLength: apiKey ? apiKey.length : 0,
        debugInfo: errorData.debug || 'No debug info'
      });
      
      // Include debug info in response for troubleshooting
      const responseBody = {
        error: errorMessage,
        details: response.status === 401 
          ? 'API key mismatch. Please ensure UPLOAD_API_KEY in Netlify matches the value in uploads.php on Hostinger.'
          : errorData.message || response.statusText
      };
      
      // Add debug info if available (helps troubleshoot)
      if (errorData.debug) {
        responseBody.debug = errorData.debug;
      }
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify(responseBody)
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


