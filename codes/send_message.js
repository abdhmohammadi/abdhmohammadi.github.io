function sendMessage()
{
    function sendMessage()
{
    require('dotenv').config();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = document.getElementById('message').value;
    alert('Bot: ' + botToken);
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
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = document.getElementById('message').value;
    alert('Bot: ' + botToken);
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
