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
This project is now a **fully static website** (HTML + CSS + JavaScript + JSON data), so it can be hosted directly on **GitHub Pages**.

## What changed

- Removed PHP/MySQL runtime dependency from the app flow.
- Implemented static modules for:
  - Current Affairs (auto-refresh every 15s from local JSON dataset)
  - Quiz (10 MCQs, non-repeatable per logged-in user in localStorage)
  - Refresh Questions (new unseen set)
  - Mock Test (50-question simulation + timer)
  - Himachal GK flashcards
  - Leaderboard (computed from local performance data)
  - Register/Login (localStorage-based demo auth)
- Added offline support with service worker (PWA-lite).

> Note: Because this is static hosting, auth and progress are stored in browser localStorage (device-specific). For multi-user real backend behavior, deploy the PHP/MySQL version on a PHP host.

## Folder Structure

- `assets/css/` - UI styles
- `assets/js/` - app logic (dashboard, auth, quiz, mock, leaderboard, himachal)
- `data/` - static JSON datasets (`news`, `questions`, `himachal_gk`)
- `offline/` - service worker
- Root pages: `index.html`, `login.html`, `quiz.html`, `mock.html`, `himachal.html`, `leaderboard.html`

## Run locally

Because `fetch()` reads JSON files, run using a local server (not `file://`).

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


## Current Affairs API (RapidAPI + Fallback)

- Dashboard first tries RapidAPI live fetch via `assets/js/dashboard.js`.
- Configured RapidAPI key and host are used in client-side requests.
- If RapidAPI fails or quota is exceeded, app falls back to local `data/news.json`.

> Security note: In static sites, API keys are visible in browser source. For production, proxy requests through a backend to keep keys secret.


## Quiz APIs (QuizAPI.io + OpenTDB + Fallback)

- Quiz/Mock first try **QuizAPI.io** with the provided key.
- If QuizAPI fails, app falls back to **OpenTDB** (`https://opentdb.com/api.php?amount=50&type=multiple`).
- If both fail, app uses local `data/questions.json`.
- The active source is shown on Quiz and Mock pages.

> Security note: In static hosting, client-side API keys are visible. Use a backend proxy in production.


## New Enhancements

- Upgraded UI with hero sections, improved quiz/mock card styling, badges/chips, and better filter layout.
- Added **difficulty selector** for both Quiz and Mock test (`easy`, `medium`, `hard`).
- Added strict **syllabus-only question filtering** for API and local datasets.
- Added stronger **non-repeat logic** so each refresh produces fresh questions in session before recycle.

### Syllabus-only coverage
Questions are restricted to these domains:
- Computer Basics
- Windows
- MS Office
- Internet
- Networking
- DBMS
- Cyber Security
- Current Affairs
- Himachal GK
3. Under **Build and deployment**, choose:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your branch), `/ (root)`
4. Save.
5. Wait for deployment, then open your GitHub Pages URL.

## MVP Feature Mapping

- **Real-time current affairs**: rotating exam-focused news every 15 seconds from `data/news.json`.
- **Quiz system**: 10 randomized MCQs with scoring.
- **Refresh questions**: fetches new unseen questions.
- **Non-repeatable logic**: attempted question IDs saved per user email in localStorage.
- **Mock test**: 50 questions with timer.
- **Himachal GK**: dedicated flashcard page.
- **Ranking**: computed leaderboard from stored attempts.
- **Offline support**: service worker caches pages/data/assets.

## Limitations of static hosting

- No server database.
- No cross-device sync.
- No true multi-user leaderboard.
- News is static unless you update `data/news.json`.

For production-grade multi-user exam platform, switch back to backend hosting (PHP + MySQL) on Render/Railway/VPS/cPanel.
