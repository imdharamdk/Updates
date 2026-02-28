# HPSSC / HPRCA JOA IT Prep (Static GitHub Pages Version)

This project is a **fully static website** (HTML + CSS + JavaScript + JSON data), so it can be hosted directly on **GitHub Pages**.

## Highlights (Latest Update)

- Detailed **bilingual current affairs** (English + Hindi) with topic filter and 15-second auto-refresh rotation.
- **Bilingual mock test and quiz content** (English + Hindi rendering).
- Mock Test now includes **Refresh New Questions** button for new randomized set.
- Improved **responsive UI** for mobile/tablet/desktop with modern card-based layout.
- Offline support via service worker.

## Folder Structure

- `assets/css/` - responsive UI styles
- `assets/js/` - app logic (`dashboard`, `auth`, `quiz`, `mock`, `leaderboard`, `himachal`)
- `data/` - static JSON datasets (`news`, `questions`, `himachal_gk`)
- `service-worker.js` - service worker
- Root pages: `index.html`, `login.html`, `quiz.html`, `mock.html`, `himachal.html`, `leaderboard.html`

## Run locally

```bash
python3 -m http.server 8080
```

Open: `http://localhost:8080`

## Host on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Choose **Deploy from a branch**.
4. Select your branch and `/ (root)`.
5. Save and open your GitHub Pages URL.

## Static Hosting Notes

- User accounts, attempts, and performance are stored in browser `localStorage`.
- Leaderboard is device/browser local in static mode.
- For real multi-user backend sync, deploy a server-backed version.
