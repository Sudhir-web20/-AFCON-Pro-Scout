# AFCON Pro Scout

A high-performance talent directory and scouting platform for African Cup of Nations (AFCON) players competing in elite European and Saudi Arabian leagues.

## 🚀 Features

- **Instant-Load Architecture**: Combines static elite profiles with local persistence for <100ms startup times.
- **AI-Powered Scouting**: Integrated with Gemini 3 Pro/Flash for real-time talent discovery and technical analysis.
- **Local Persistence**: Built-in `localStorage` sync ensures that all manual asset overrides and scouted players are saved locally.
- **Interactive 3D UI**: Modern player cards featuring 3D flip animations to toggle between visual identity and technical scouting reports.
- **Branding**: Dynamic national team color accents and professional sports-grade typography.

## 🛠 Tech Stack

- **Core**: React 19 (ESM)
- **Styling**: Tailwind CSS
- **AI**: @google/genai (Gemini 3 Flash)
- **Icons**: FontAwesome 6
- **Persistence**: LocalStorage API

## 📖 Usage

- **Browse**: Filter players by "Europe" or "Saudi" leagues.
- **Scout**: Click any card to flip it and reveal the technical scout summary and market value.
- **Edit**: Use the camera icon on any card to manually upload a local image or link a web asset.
- **Discover**: Use the "Discover New" button to trigger the AI scout to search for emerging talent not in the default elite list.

## 📦 Deployment

The application is structured as a modern ES6 module-based web app. 
1. Host the `index.html` and `index.tsx` files.
2. Ensure `process.env.API_KEY` is available for the Gemini discovery features.
3. No build step is required for the ESM imports.

---
*Built for football enthusiasts and professional scouts alike.*