# FE.ADITTO — 3D Cybersecurity Portfolio

A responsive, static portfolio for MD. Fatin Estiakh Aditto. Built with HTML, CSS, JavaScript and a locally bundled Three.js module. No build step, npm install, backend, or API key is needed.

## Run locally (Kali Linux / Linux / macOS)

Extract the ZIP, open a terminal in the extracted `aditto-portfolio` folder, and run:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open http://localhost:8000 in your browser. Stop the server with Ctrl+C.

**বাংলা:** ZIP extract করে `aditto-portfolio` folder-এর ভিতরে terminal খুলে উপরের command দিন। তারপর browser-এ `http://localhost:8000` খুলুন। সরাসরি `index.html` double-click করলে browser-এর module restrictions-এর কারণে 3D animation নাও চলতে পারে।

Windows: use `py -m http.server 8000 --bind 127.0.0.1` if Python is installed.

## Files

- `index.html` — personal information, sections, metadata, contact links.
- `style.css` — colors, typography, responsive layouts, hover and focus states.
- `app.js` — lab tabs, menu, terminal commands/history, email copying, section highlighting.
- `scene.js` — interactive 3D network, rotation, motion and keyboard controls.
- `portrait.webp` — optimized profile photograph.
- `MYresume.png` — downloadable resume.
- `vendor/three.module.js` and `vendor/three.core.js` — bundled Three.js 0.186.1.
- `vendor/THREE-LICENSE.txt` — the dependency's MIT license; retain when redistributing.
- `.nojekyll` — permits plain static GitHub Pages hosting.

## Edit your information

Update text and links in `index.html`. Terminal answers and lab entries also appear in `app.js`; keep those consistent with your edits. Change CSS variables at the beginning of `style.css` for the color palette. Replace `portrait.webp` to change the photo.

## Deploy to your GitHub Pages portfolio

1. Back up your current repository before replacing files.
2. Upload the **contents** of this folder (including `vendor/`) to the root of your `my_portfolio` repository, alongside `index.html`.
3. Commit the changes.
4. In GitHub Settings → Pages, use the branch containing these files and the repository root as the publishing folder.
5. Your existing GitHub Pages URL will use the new version once publishing completes.

All asset paths are relative, so deployment under `/my_portfolio/` is supported. You can also upload the folder contents to any static web host.

## Interactions

- Drag the network, use its rotate/reset buttons, or focus it and press arrow keys. Home resets the view.
- Pause/play motion. The initial setting honors the device's reduced-motion preference.
- Terminal commands: `help`, `whoami`, `skills`, `tools`, `labs`, `experience`, `education`, `contact`, `clear`.
- Up/down arrows browse terminal command history. Ctrl+L clears its output.
- Lab tabs support arrow keys, Home, and End.
- Contact buttons open email, phone, LinkedIn, and GitHub. Email copying works on HTTPS or localhost; a fallback message appears if clipboard access is unavailable.

The terminal is a local profile interface. It does not execute shell commands or contact a server.

## Dependencies and offline behavior

Three.js and the photograph are included locally. Google Fonts is used for Space Grotesk and JetBrains Mono; an internet connection is needed for those typefaces. The site falls back to system fonts when offline. External lab/social links also require internet access. 3D requires a WebGL-capable browser; other portfolio content remains usable if it is unavailable.

## Verification

JavaScript syntax, HTML asset references, section links, and ZIP integrity were checked. A live cross-browser visual test was not available in the build environment. Test the site locally before replacing your public portfolio.

No hosting credentials, private repository settings, or account tokens are included.
# my_website
