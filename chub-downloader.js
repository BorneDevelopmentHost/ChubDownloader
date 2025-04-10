/* SillyTavern Extension: Chub.ai Character Downloader
   Author: Private use only
   Description: Downloads and imports character cards from chub.ai directly into SillyTavern
*/

const chubDownloader = {
    name: 'Chub.ai Downloader',
    version: '1.0',
    author: 'Private',
    ui: `
        <div id="chub-downloader">
            <h3>Chub.ai Character Import</h3>
            <input id="chub-url" type="text" placeholder="Paste Chub.ai character URL here" style="width: 100%; padding: 5px;" />
            <button id="chub-download-btn" style="margin-top: 10px;">Download & Import</button>
            <div id="chub-status" style="margin-top: 10px; font-size: 0.9em;"></div>
        </div>
    `,
    init() {
        const panel = document.createElement('div');
        panel.innerHTML = this.ui;
        document.getElementById('extensions_settings').appendChild(panel);

        document.getElementById('chub-download-btn').addEventListener('click', async () => {
            const url = document.getElementById('chub-url').value.trim();
            if (!url.startsWith('https://www.chub.ai/characters/')) {
                return showStatus('Invalid Chub.ai character URL.', true);
            }
            try {
                const response = await fetch(url);
                const text = await response.text();

                const match = text.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/);
                if (!match) return showStatus('Failed to parse character data from the page.', true);

                const data = JSON.parse(match[1]);
                const character = data.character.character;

                const card = {
                    name: character.name,
                    description: character.description,
                    personality: character.personality,
                    scenario: character.scenario,
                    first_mes: character.greeting,
                    creator_notes: character.creator_notes || '',
                    tags: character.tags || [],
                    avatar: character.avatar_url || ''
                };

                // Add to SillyTavern character list
                window.saveCharacterCard(card);
                showStatus(`Character \"${card.name}\" imported successfully!`);
            } catch (err) {
                console.error(err);
                showStatus('An error occurred during character import.', true);
            }
        });

        function showStatus(message, isError = false) {
            const el = document.getElementById('chub-status');
            el.textContent = message;
            el.style.color = isError ? 'red' : 'limegreen';
        }
    }
};

if (window?.registerExtension) {
    registerExtension(chubDownloader);
}
