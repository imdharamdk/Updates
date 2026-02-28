# HPSSC / HPRCA JOA IT Prep (Static GitHub Pages Version)

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
