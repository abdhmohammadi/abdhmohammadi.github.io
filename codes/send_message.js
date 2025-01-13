function sendMessage()
{
    const message = document.getElementById('message').value;
    const botToken = 'AAFk5DsbuPPKRX35-EwMSRkIYBaIeq5oSs';
    const chatId = '101548936';

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Message sent successfully:', data);
            } else {
                throw new Error(data.description);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending the message: ' + error.message);
        });
}
