# Ladder Logic Practice — Deploy Guide

## What's in this folder
A complete React app. You just need to put it on Vercel (free, takes ~5 minutes).

---

## Step 1 — Install Node.js (if you don't have it)
Download from: https://nodejs.org  
Pick the LTS version. Install it like any program.

---

## Step 2 — Create a free Vercel account
Go to: https://vercel.com  
Sign up with GitHub, Google, or email — all free.

---

## Step 3 — Install the Vercel command line tool
Open a terminal (search "cmd" on Windows or "Terminal" on Mac) and run:

    npm install -g vercel

---

## Step 4 — Deploy
In the terminal, navigate to this folder:

    cd path/to/ladder-practice

Then run:

    vercel

It will ask a few questions — just press Enter to accept all defaults.
When it finishes it gives you a URL like:

    https://ladder-practice-abc123.vercel.app

That's your live site. Share it with anyone.

---

## Step 5 — Custom URL (optional, free)
In the Vercel dashboard you can rename the project to get a cleaner URL like:
    https://ladder-practice.vercel.app

---

## How the API key works
- When someone visits the site for the first time, they are asked to enter their own Anthropic API key
- The key is stored only in THEIR browser (localStorage) — you never see it
- Each person pays for their own grading (~1-2 cents per submission)
- They can get a free key at: https://console.anthropic.com
- There is a 🔑 button in the top right to change or clear the key at any time

---

## To update the site later
Make changes to src/App.jsx, then run:

    vercel --prod

That's it — the live URL updates automatically.

---

## Trouble?
If anything goes wrong, the Vercel dashboard at vercel.com shows logs and errors.
You can also just drag-and-drop the folder onto vercel.com/new and it works the same way.
