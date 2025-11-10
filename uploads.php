<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-API-Key");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}

// API key authentication - REQUIRED for security
// Set your secret API key here (must match Netlify environment variable)
$requiredApiKey = "BOOKSGLANCE_UPLOAD_SECRET_2024"; // Must match UPLOAD_API_KEY in Netlify

// Get API key from header or POST data
$providedApiKey = $_SERVER['HTTP_X_API_KEY'] ?? $_POST['apiKey'] ?? '';

// Validate API key
if (empty($providedApiKey) || $providedApiKey !== $requiredApiKey) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized: Invalid or missing API key"]);
    exit;
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["error" => "No file uploaded"]);
    exit;
}

// Get the desired filename from POST data, or use timestamp as fallback
$fileName = isset($_POST['fileName']) ? $_POST['fileName'] : time() . "_" . basename($_FILES["file"]["name"]);

// Sanitize filename to prevent directory traversal and ensure safe characters
$fileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
$fileName = basename($fileName); // Remove any path components

$targetDir = "uploads/";
$targetFile = $targetDir . $fileName;

// Check if file already exists and overwrite if needed
if (file_exists($targetFile)) {
    unlink($targetFile); // Remove existing file
}

// Validate file type (images only)
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$fileType = $_FILES["file"]["type"];

if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid file type. Only images are allowed."]);
    exit;
}

// Validate file size (max 10MB)
$maxSize = 10 * 1024 * 1024; // 10MB in bytes
if ($_FILES["file"]["size"] > $maxSize) {
    http_response_code(400);
    echo json_encode(["error" => "File size exceeds 10MB limit."]);
    exit;
}

// Upload the file
if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
    $fileUrl = "https://" . $_SERVER['HTTP_HOST'] . "/" . $targetFile;
    echo json_encode([
        "success" => true,
        "url" => $fileUrl,
        "fileName" => $fileName
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error uploading file. Please check folder permissions."]);
}

?>

