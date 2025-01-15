const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  try {
    console.log('Fetching secret data...');
    const token = process.env.SEND_MESSAGE_TO_TELEGRAM_TOKEN;
    const apiUrl =
      'https://api.github.com/repos/abdhmohammadi/abdhmohammadi.github.io/contents/secret-data.json?ref=main';

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const decodedData = Buffer.from(data.content, 'base64').toString('utf8');
    console.log('Decoded Secret Data:', decodedData);

    // Write to secret-data.json
    fs.writeFileSync('secret-data.json', decodedData);
    console.log('secret-data.json created successfully.');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})();
