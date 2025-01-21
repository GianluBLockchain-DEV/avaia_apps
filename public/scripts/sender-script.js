async function sendMail(event) {
  event.preventDefault();

  const senderEmail = document.getElementById("senderEmail").value;
  const senderPassword = document.getElementById("senderPassword").value;
  const subject = document.getElementById("subject").value;
  const recipients = document.getElementById("recipients").value;
  const emailContent = document.getElementById("emailContent").value;

  const statusMessage = document.getElementById("statusMessage");
  statusMessage.innerHTML = "Sending emails...";

  const payload = {
    senderEmail,
    senderPassword,
    subject,
    recipients,
    emailContent,
  };

  try {
    const response = await fetch("/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.text();
    statusMessage.innerHTML = result;
  } catch (error) {
    console.error("Error:", error);
    statusMessage.innerHTML = "Failed to send emails.";
  }
}
