document.addEventListener('DOMContentLoaded', () => {
    // Select an existing UI container where you want the button to appear
    const container = document.querySelector('#toolbar') || document.querySelector('#character-drawer') || document.body;

    if (container) {
        // Create the button manually
        const button = document.createElement('button');
        button.textContent = 'Import Character';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.padding = '10px';
        button.style.margin = '5px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        container.appendChild(button); // Add the button to the container
        console.log('Button added successfully.');

        // Link the button to the import function
        button.onclick = importCharacterFromWeb;
    } else {
        console.error('UI container for button not found.');
    }
});

// Function to import a character
async function importCharacterFromWeb() {
    try {
        const link = prompt('Enter the chub.ai character link:');
        if (!link.startsWith('https://chub.ai/characters/')) {
            alert('Invalid chub.ai character link.');
            return;
        }

        const response = await fetch(link);
        if (!response.ok) {
            throw new Error(`Failed to fetch character: ${response.statusText}`);
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const characterName = doc.querySelector('.character-name')?.textContent.trim();
        const characterDescription = doc.querySelector('.character-description')?.textContent.trim();

        if (!characterName) {
            throw new Error('Unable to extract character data.');
        }

        alert(`Character "${characterName}" imported successfully!`);
    } catch (error) {
        console.error('Error importing character:', error);
        alert('Failed to import character. Check console for details.');
    }
}
