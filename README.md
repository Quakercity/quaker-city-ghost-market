Quaker City Roleplay — Contraband Spinner (Frontend UI)

This repository contains a frontend-only UI for the Quaker City Roleplay contraband spinner. It is static and intended to be deployed on GitHub Pages or any static host.

Files
- index.html — main UI
- style.css — red glow theme and layout styles
- script.js — client-side logic: populates cards, category filtering, music toggle, spin animation, localStorage persistence for acquired items
- assets/* — placeholders for logo and audio files (replace with real assets)

Local testing
1. Clone the repository.
2. Serve the files locally (any static server):
   - Python 3: python -m http.server 8000
   - Node: npx serve .
3. Open http://localhost:8000 in your browser.

Replacing assets
- Replace assets/logo.png with a real PNG logo.
- Replace assets/click.mp3, assets/spin.mp3, assets/music.mp3 with real MP3 files if you want audio.

Deploy to GitHub Pages (recommended)
1. Push changes to the main branch (this repo already uses main).
2. In the repository on GitHub, go to Settings → Pages.
3. Under "Source", choose "Main branch" and root (/) as the folder. Save.
4. GitHub will provide a public URL (usually https://<username>.github.io/<repo-name>). The site should become available within a minute or two.

Notes
- This is a static UI; there is no backend or persistence other than the browser's localStorage (for the acquired items list).
- The provided script uses placeholder data; replace or extend the items array in script.js to reflect your in-game items.
- For production, replace placeholder assets with properly licensed media and tune styles and accessibility as needed.

Credits
Built for Quaker City Roleplay. Theme: red glow contraband UI.
