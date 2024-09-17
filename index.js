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
  const { emailContent } = req.body;

  // Read email addresses from emails.json
  const emailData = JSON.parse(fs.readFileSync("emails.json"));
  const recipients = emailData.emails;

  // Create Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Specify your email service provider
    auth: {
      user: "gunity72@gmail.com", // Your email address
      pass: "poqj spja hlkw oacf", // Your email password
    },
  });

  // Loop through recipients and send email to each
  recipients.forEach((recipient) => {
    const mailOptions = {
      from: "gunity72@gmail.com",
      to: recipient,
      subject: "test#1",
      html: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
        // Handle error if needed
      } else {
        console.log("Email sent to:", recipient);
        // Handle success if needed
      }
    });
  });

  res.status(200).send("Emails sent successfully!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
