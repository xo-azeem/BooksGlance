const ftp = require('basic-ftp');

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
    // Get server-side FTP credentials (NOT exposed to client)
    const ftpHost = process.env.HOSTINGER_FTP_HOST;
    const ftpUser = process.env.HOSTINGER_FTP_USER;
    const ftpPassword = process.env.HOSTINGER_FTP_PASSWORD;
    const ftpPort = process.env.HOSTINGER_FTP_PORT || 21; // Default FTP port is 21
    const hostingerBaseUrl = process.env.HOSTINGER_BASE_URL; // e.g., https://yourdomain.com

    console.log('FTP Config Check:', {
      hasHost: !!ftpHost,
      hasUser: !!ftpUser,
      hasPassword: !!ftpPassword,
      hasBaseUrl: !!hostingerBaseUrl,
      port: ftpPort
    });

    if (!ftpHost || !ftpUser || !ftpPassword || !hostingerBaseUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error - FTP credentials not set',
          details: 'Please check Netlify environment variables: HOSTINGER_FTP_HOST, HOSTINGER_FTP_USER, HOSTINGER_FTP_PASSWORD, HOSTINGER_BASE_URL'
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

    // Convert base64 to buffer
    const base64Data = fileData.includes(',') ? fileData.split(',')[1] : fileData;
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // Connect to Hostinger FTP and upload file
    const client = new ftp.Client();
    client.ftp.verbose = true; // Enable verbose logging for debugging

    try {
      console.log(`Connecting to FTP: ${ftpHost}:${ftpPort}`);
      await client.access({
        host: ftpHost,
        user: ftpUser,
        password: ftpPassword,
        port: parseInt(ftpPort, 10),
        secure: parseInt(ftpPort, 10) === 990, // Use secure (FTPS) only for port 990
        secureOptions: { rejectUnauthorized: false } // For FTPS if needed
      });
      console.log('FTP connection established');

      // Navigate to uploads directory (create if doesn't exist)
      await client.ensureDir('public_html/uploads');

      // Create a readable stream from buffer
      const { Readable } = require('stream');
      const stream = new Readable();
      stream.push(fileBuffer);
      stream.push(null); // End the stream

      // Upload file - uploadFrom expects a readable stream
      console.log(`Uploading file: ${fileName} (${fileBuffer.length} bytes)`);
      await client.uploadFrom(stream, `public_html/uploads/${fileName}`);
      
      console.log(`File uploaded successfully: ${fileName}`);

      // Close connection
      await client.close();

      // Return the public URL
      const imageUrl = `${hostingerBaseUrl}/uploads/${fileName}`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          url: imageUrl,
          fileName: fileName
        })
      };
    } catch (ftpError) {
      try {
        await client.close();
      } catch (closeError) {
        // Ignore close errors
      }
      console.error('FTP upload error:', ftpError);
      throw new Error(`FTP upload failed: ${ftpError.message || ftpError.toString()}`);
    }
  } catch (error) {
    console.error('Hostinger upload error:', error);
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

