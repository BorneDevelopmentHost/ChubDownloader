// Function to import characters
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

        const character = {
            name: characterName,
            description: characterDescription
        };

        console.log('Character imported:', character);
        alert(`Character "${character.name}" imported successfully!`);
    } catch (error) {
        console.error('Error importing character:', error);
        alert('Failed to import character. See console for details.');
    }
}

// Attach the behavior to the button manually
document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('button[name="Import Character"]');
    if (button) {
        button.onclick = importCharacterFromWeb;
        console.log('Import Character button linked successfully.');
    } else {
        console.error('Could not find the Import Character button.');
    }
});
