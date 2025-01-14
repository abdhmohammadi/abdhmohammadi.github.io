function formatDate(date) 
{
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2); // months are zero-indexed
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    
    return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
}

function displayDateTime()
{
    let now = new Date();
    document.getElementById('datetime').innerText = formatDate(now);
}

// Update the date and time every second
setInterval(displayDateTime, 1000);

// Initial call to display the current date and time
displayDateTime();