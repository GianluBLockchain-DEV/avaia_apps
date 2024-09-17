 function sendMail () {
      event.preventDefault(); // Prevent default form submission

      const emailContent = document.getElementById('emailContent').value;
      
      // Send the email content to the backend for processing
      fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailContent: emailContent })
      })
      .then(response => {
        if (response.ok) {
          document.getElementById('statusMessage').textContent = 'Email sent successfully!';
        } else {
          throw new Error('Failed to send email.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('statusMessage').textContent = 'An error occurred while sending the email.';
      });
    }