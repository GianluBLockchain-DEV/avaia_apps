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
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "web.html"));
});

app.post("/send-email", (req, res) => {
  const { emailContent, senderEmail, senderPassword, subject, recipients } =
    req.body;

  // Create Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });

  // Loop through recipients and send email to each
  recipients.forEach((recipient) => {
    const mailOptions = {
      from: senderEmail,
      to: recipient,
      subject: subject,
      html: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
        // Handle error if needed
      } else {
        console.log("Email sent to:", recipient);
      }
    });
  });

  res.status(200).send("Emails sent successfully!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
