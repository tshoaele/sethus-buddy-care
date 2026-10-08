# Sethu's Buddy Care

A gentle Android-friendly speech practice web game for Sethu.

## What it does

- Uses short spoken prompts for daily communication: food, drink, help, toilet, colors, animals, story choices, and music requests.
- Gives warm feedback with no losing state, no timers, and a tap-help backup.
- Lets a grown-up adjust speech matching, voice speed, and tap support.
- Runs as a static web app in Android Chrome.
- Includes an original anime-inspired buddy and illustrated playroom.
- Clothing requests update the outfit after success. Music requests play or stop a short melody.
- Feedback stays visible until Next is tapped. Quiet mode turns off extra sounds and motion.

## Run locally

From this folder, serve the files with any static server and open the URL in Chrome:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/
```

On a phone, open the HTTPS website in Android Chrome. Adding it to the home screen does not bypass microphone permissions or the HTTPS requirement.

## Checks

Run `node --test tests/app.test.cjs` to check feedback, rewards, mode changes, clothing and word matching.

Artwork prompts are documented in `assets/art-notes.md`.

## First therapy targets

- I want food
- I want drink
- Help me
- I need toilet
- Red dress
- Blue shoes
- Hat please
- Hello dog
- More music
- Color red
