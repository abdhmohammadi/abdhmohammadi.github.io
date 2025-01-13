// script.js

function sendMessage()
{
    const message = document.getElementById('message').value;
    if (!message) return;

    const username = 'abdhmohammadi';
    const repo = 'abdhmohammadi.github.io';
    const workflow_id = 'send_message.yml';
    /* this token is expired in 90 days */
    const token = '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';

    fetch(`https://api.github.com/repos/${username}/${repo}/actions/workflows/${workflow_id}/dispatches`, 
        {
            method: 'POST',
            headers: 
            {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`
            },
            body: JSON.stringify(
                {
                    ref: 'main',
                    inputs: { message: message }
                })
    })
    .then(response => response.json())
    .then(data =>
        {
         alert('Message sent successfully');
        })
    .catch(error => 
    {
        alert('An error occurred while sending the message: ' + error.message);
    });
}

/*
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
*/
