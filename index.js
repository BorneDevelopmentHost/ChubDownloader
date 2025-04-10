// Chub.ai Character Importer for SillyTavern

async function importCharacterFromWeb() {
    try {
        // Prompt the user to enter the chub.ai character link
        const link = prompt('Enter the chub.ai character link:');
        
        // Validate the link format
        if (!link.startsWith('https://chub.ai/characters/')) {
            alert('Invalid chub.ai character link.');
            return;
        }

        // Fetch the webpage HTML
        const response = await fetch(link, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Failed to fetch character page: ${response.statusText}`);
        }

        const htmlText = await response.text();

        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Adjust selectors based on the chub.ai webpage's structure
        const characterName = doc.querySelector('.character-name')?.textContent.trim();
        const characterDescription = doc.querySelector('.character-description')?.textContent.trim();
        const characterStats = doc.querySelector('.character-stats')?.textContent.trim();

        // Check if character data was successfully extracted
        if (!characterName) {
            throw new Error('Unable to extract character data. Check the page structure.');
        }

        // Construct a character object
        const character = {
            name: characterName,
            description: characterDescription,
            stats: characterStats
        };

        // Integrate the character into SillyTavern's drawer
        addCharacterToDrawer(character);
        alert(`Character "${character.name}" imported successfully!`);
    } catch (error) {
        console.error('Error importing character:', error);
        alert('Failed to import character. See console for details.');
    }
}

function addCharacterToDrawer(character) {
    console.log('Character added:', character);
    // Logic to integrate the character into SillyTavern's UI/drawer goes here
}

// Register the "Import Character" button action
if (typeof SillyTavern !== 'undefined') {
    SillyTavern.registerAction('importCharacterFromWeb', importCharacterFromWeb);
}
