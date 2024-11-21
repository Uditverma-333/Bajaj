const express = require("express");
const bodyParser = require("body-parser");
const mime = require("mime-types");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// POST Endpoint
app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    // Validate input
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ is_success: false, message: "Invalid data format" });
    }

    // Extract numbers and alphabets
    const numbers = data.filter((x) => !isNaN(x) && typeof x === "string"); // Keep numbers as strings
    const alphabets = data.filter((x) => isNaN(x));

    // Determine the highest lowercase alphabet
    const lowercaseAlphabets = alphabets.filter(
      (x) => x === x.toLowerCase() && /^[a-z]$/.test(x)
    );
    const highestLowercase = lowercaseAlphabets.sort().slice(-1)[0] || null;

    // Check for prime numbers
    const isPrimeFound = numbers.some((num) => isPrime(Number(num)));

    // File handling (only process if file_b64 exists)
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = 0;

    if (file_b64) {
      try {
        const fileBuffer = Buffer.from(file_b64, "base64");
        fileMimeType = mime.lookup(fileBuffer) || "application/octet-stream";
        fileSizeKb = (fileBuffer.length / 1024).toFixed(2); // File size in KB
        fileValid = true;
      } catch (error) {
        fileValid = false;
        fileMimeType = null;
        fileSizeKb = 0;
      }
    }

    // Prepare response
    const response = {
      is_success: true,
      user_id: "uditverma_333", // Updated user ID
      email: "uditverma210043@acropolis.in",
      roll_number: "0827CD211065",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
      is_prime_found: isPrimeFound,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: parseFloat(fileSizeKb),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ is_success: false, message: "Invalid input or server error", error: error.message });
  }
});

// Helper Function: Check Prime
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// Export the Express app for Vercel as a serverless function
module.exports = app;
