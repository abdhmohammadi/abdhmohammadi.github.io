function sendMessage()
{
    const message = document.getElementById('message').value;
    const botToken = '5960219678:AAFk5DsbuPPKRX35-EwMSRkIYBaIequ5oSs';

    const chatId = '101548936';

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`)
        .then(response => response.json())
        .then(data => 
        {
            if (data.ok)
            {
                alert('Message sent successfully');
            } else
            {
                throw new Error(data.description);
            }
        })
        .catch(error =>
            {
            alert('An error occurred while sending the message: ' + error.message);
            });
}
