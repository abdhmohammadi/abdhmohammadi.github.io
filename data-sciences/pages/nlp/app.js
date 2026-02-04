
async function loadDictionary() 
{
  const response = await fetch('nlp-sp-dic.json');
  const data = await response.json();

  vocab = document.getElementById('vocabulary-count');
  vocab.textContent = `${data.length} words`;

  displayEntries(data);

  document.getElementById('searchBox').addEventListener('input', () => {
    const query = document.getElementById('searchBox').value.toLowerCase();
    const filtered = data.filter(entry => 
      entry.term.toLowerCase().includes(query) ||
      entry.definition.toLowerCase().includes(query) ||
      entry.tags.join(' ').toLowerCase().includes(query)
    );
    displayEntries(filtered);

  });
}

function displayEntries(entries) 
{
  const container = document.getElementById('dictionaryContainer');
  container.innerHTML = '';

  if (entries.length === 0) 
  {
    container.innerHTML = '<p>No matching entries found.</p>';
    return;
  }
  
  entries.sort((a, b) => a.term.localeCompare(b.term));

  entries.forEach(entry => 
  {
    const div = document.createElement('div');
    div.className = 'entry';

    div.innerHTML = `
      <h2>${entry.term}</h2>
      <p><strong>Definition:</strong> ${entry.definition}</p>
      <p class="tags"><strong>Tags:</strong> ${entry.tags.join(', ')}</p>
      <p class="example">${entry.example}</p>
      <p class="reference"><strong>See also:</strong> ${entry.see_also.join(', ')}</p>
    `;
    container.appendChild(div);
  });

}

loadDictionary();