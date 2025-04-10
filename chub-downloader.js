/* SillyTavern Extension: Chub.ai Character Downloader
   Author: Private use only
   Description: Downloads and imports character cards from chub.ai directly into SillyTavern
*/

const chubDownloader = {
    metadata: {
        name: 'Chub.ai Downloader',
        version: '1.0',
        author: 'ByteBouncer'
    },
    ui: `
        <div id="chub-downloader" style="margin-top: 20px;">
            <h3 style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                <img src="https://www.chub.ai/favicon.ico" alt="Chub.ai Icon" style="width: 20px; height: 20px;"> Chub.ai Character Import
            </h3>
            <input id="chub-url" type="text" placeholder="Paste Chub.ai character URL here" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #555; background-color: #1e1e1e; color: #eee;" />
            <button id="chub-download-btn" style="margin-top: 10px; padding: 8px 12px; background-color: #4caf50; color: white; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 0a5.53 5.53 0 0 0-5.473 4.64C1.67 5.356 0 7.065 0 9a3 3 0 0 0 3 3h2.5a.5.5 0 0 0 0-1H3a2 2 0 0 1-1.995-1.85C1.009 7.617 2.498 6 4.5 6a.5.5 0 0 0 .5-.5 4.5 4.5 0 0 1 9 0c0 .314-.036.618-.104.91A.5.5 0 0 0 14.377 7H13.5a.5.5 0 0 0 0 1h.82A2.5 2.5 0 0 1 16 10.5c0 1.379-1.121 2.5-2.5 2.5H10.5a.5.5 0 0 0 0 1h3a3.5 3.5 0 0 0 3.482-3.268A3.001 3.001 0 0 0 13.5 8h-.132A5.5 5.5 0 0 0 8 0z"/>
                    <path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V9.5a.5.5 0 0 0-1 0v4.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/>
                </svg>
                Download & Import
            </button>
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
