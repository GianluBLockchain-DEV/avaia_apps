const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const RateLimiter = require("rate-limiter-flexible").RateLimiterMemory;
const multer = require("multer"); // For handling file uploads

const app = express();
const port = 3000;

// Rate limiter to prevent abuse
const emailRateLimiter = new RateLimiter({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
});

// Configure multer for file uploads
const upload = multer();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "web.html"));
});

// Route to handle email sending
app.post("/send-email", upload.array("attachments"), async (req, res) => {
  try {
    // Apply rate limiting
    await emailRateLimiter.consume(req.ip);

    const { senderEmail, senderPassword, subject, recipients, emailContent } =
      req.body;

    const attachments = req.files;

    // Log the extracted data for debugging
    console.log("Sender Email:", senderEmail);
    console.log("Sender Password:", senderPassword);
    console.log("Subject:", subject);
    console.log("Recipients:", recipients);
    console.log("Email Content:", emailContent);
    console.log("Attachments:", attachments);

    // Validate inputs
    if (
      !senderEmail ||
      !senderPassword ||
      !subject ||
      !recipients ||
      !emailContent
    ) {
      return res.status(400).send("All fields are required.");
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    // Prepare email options
    const mailOptions = {
      from: senderEmail,
      to: senderEmail, // Invia l'email a te stesso (mittente) nel campo "To"
      bcc: recipients.split(";"), // Usa BCC per i destinatari
      subject: subject,
      html: emailContent,
      attachments: attachments.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
      })),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    res.status(200).send("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email: ", error);
    if (error instanceof Error && error.message === "Rate limiter exceeded") {
      res.status(429).send("Too many requests. Please try again later.");
    } else {
      res.status(500).send("Failed to send email.");
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
