# Givenergy/Bluesky bot

Posts electricity import/export stats to Bluesky every day at 8pm UTC.

## Installation

`npm i && npm i -g vercel`

Then copy `.env.example` to `.env` and pop in your `GIVENERGY_API_KEY`, `INVERTER_ID`, `BLUESKY_USERNAME`, and `BLUESKY_PASSWORD`.

## Running locally

`vercel dev`

Project will be set up and served at `http://localhost:3000`. Run the script by visiting `http://localhost:3000/api/get-and-post`.

## Cron

If you deploy this project to Vercel, `vercel.json` is configured to hit `/api/get-and-post` at 8pm UTC.
