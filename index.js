const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "web.html"));
});

app.post("/send-email", async (req, res) => {
  const { emailContent, senderEmail, senderPassword, subject, recipients } =
    req.body;

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

  // Split recipients into an array and trim spaces
  const recipientList = recipients.split(";").map((email) => email.trim());

  let successfulSends = 0;
  let failedSends = 0;

  for (const recipient of recipientList) {
    const mailOptions = {
      from: senderEmail,
      to: recipient,
      subject: subject,
      html: emailContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to: ${recipient}`);
      successfulSends++;
    } catch (error) {
      console.error(`Error sending to ${recipient}:`, error);
      failedSends++;
    }
  }

  res
    .status(200)
    .send(
      `Emails sent successfully! Success: ${successfulSends}, Failed: ${failedSends}`
    );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
