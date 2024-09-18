function sendMail(event) {
  event.preventDefault(); // Prevent default form submission

  const emailContent = document.getElementById("emailContent").value;
  const senderEmail = document.getElementById("senderEmail").value;
  const senderPassword = document.getElementById("senderPassword").value;
  const subject = document.getElementById("subject").value;
  const recipients = document
    .getElementById("recipients")
    .value.split(",")
    .map((email) => email.trim());

  // Send the email content to the backend for processing
  fetch("/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailContent: emailContent,
      senderEmail: senderEmail,
      senderPassword: senderPassword,
      subject: subject,
      recipients: recipients,
    }),
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById("statusMessage").textContent =
          "Emails sent successfully!";
      } else {
        throw new Error("Failed to send emails.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("statusMessage").textContent =
        "An error occurred while sending the emails.";
    });
}
