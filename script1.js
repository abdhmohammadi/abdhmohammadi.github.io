// URL to fetch the secret data file from your GitHub Pages site
const apiUrl = 'https://raw.githubusercontent.com/your-username/your-repo/main/secret-data.json';

async function fetchSecretData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        // Display the fetched secret data in the webpage
        document.getElementById('data').innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        alert(error);
        document.getElementById('data').innerText = 'Error loading secret data';
    }
}

// Fetch the secret data when the page loads
fetchSecretData();
