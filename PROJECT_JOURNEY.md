# The Project Journey: Self-Planning Travel Planner

The development of the **Self-Planning Travel Planner** has been a journey of continuous learning, refactoring, and modernization. What started as a foundational academic exercise has evolved into a robust, scalable web application.

Here is the story of how this project came to be.

## Phase 1: The Term 1 Foundation (HTML, CSS, JavaScript)
**Contributors:** Thang Saoly & Tiek Chhunhour

The project was originally conceived during our **Term 1 Web Design course**. It started as a collaborative team project between Saoly and Chhunhour. 

In this initial phase, the goal was to understand the core building blocks of the web. We built the application using:
- **Vanilla HTML5** for structuring the dashboard and modals.
- **Custom CSS** for styling, learning about flexbox, grid, and basic responsive design.
- **Vanilla JavaScript (DOM Manipulation)** to handle the interactivity, such as opening modals and toggling basic state.

This phase taught us the fundamentals of web design, but as the application grew in complexity, the vanilla CSS and JS became harder to maintain.

## Phase 2: The Styling Refactor (Tailwind CSS)
**Contributors:** Thang Saoly & Tiek Chhunhour

Recognizing the limitations of our custom CSS stylesheets, we decided to refactor the frontend styling. We integrated **Tailwind CSS**, a utility-first CSS framework. 

This phase allowed us to:
- Rapidly prototype new UI components.
- Standardize our design system (colors, typography, spacing).
- Greatly reduce the size of our custom CSS files while improving responsiveness.

The application was still powered by Vanilla JavaScript, but the development speed and visual consistency saw a massive improvement.

## Phase 3: The React Migration
**Lead Developer:** Thang Saoly

As the feature set expanded—adding to-do lists, complex state management, budget trackers, and interactive maps—Vanilla JavaScript became a bottleneck. 

Saoly spearheaded the initiative to migrate the entire project to **React**. This was a pivotal moment in the project's architecture:
- **Vite** was chosen as the build tool for lightning-fast hot module replacement.
- The UI was broken down into reusable **React Components** (e.g., `NavBar`, `TripDetailModal`, `AuthModal`).
- Complex DOM manipulation was replaced with declarative **State Management** (`useState`, `useEffect`).
- **React Router** was implemented for seamless, single-page application (SPA) navigation.
- The Tailwind CSS implementation was upgraded to **v4**.

This migration transformed the project from a static web page into a modern, dynamic web application.

## Phase 4: The Backend Integration ✅
**Lead Developer:** Thang Saoly

With the React frontend stable, the next step was to connect it to a real backend. Saoly built and integrated a full **Node.js / Express.js REST API**, replacing all `localStorage` data persistence with a cloud-backed database.

Key achievements in this phase:
- **Express.js API** with full CRUD routes for trips (`GET`, `POST`, `PUT`, `DELETE`).
- **JWT Authentication** — secure, token-based login and signup via `/api/auth`.
- **MySQL / Sequelize ORM** — `User` and `Trip` models with proper relational schema.
- **Frontend API Layer** (`src/services/tripService.js`) — centralized, clean API calls replacing scattered inline fetch logic.
- **React Auth Context** — login/signup/logout fully wired to the backend; tokens stored in `localStorage`.
- **Vite Dev Proxy** — configured to forward `/api` requests to the Express server during development.

## Phase 5: Offline-First Sync 🔄
**Lead Developer:** Thang Saoly

Recognizing that travel planners are used in all kinds of connectivity conditions, Phase 5 introduced a resilient **offline-first architecture**:

- **Trip Cache** — on every successful API fetch, trips are saved to `localStorage` as a cache. If the API is unavailable (server down, network error), the cache is loaded as a fallback.
- **Pending Operations Queue** (`offline_queue` in `localStorage`) — any create, update, or delete performed while offline is queued instead of dropped.
- **Auto Sync on Reconnect** — the `useOfflineSync` hook listens to the browser's `online` / `offline` events. When connectivity is restored, the queue is automatically replayed to the server in order.
- **Optimistic UI** — deletes and updates are reflected instantly in the UI without waiting for the server, with automatic rollback if the server rejects the operation.
- **Offline Indicator** — the NavBar displays a subtle animated "Offline (N pending)" badge whenever the user is disconnected, keeping them informed without interrupting the experience.

---

*This project stands as a testament to the power of iterative development. By consistently evaluating our tools and being willing to refactor, we have built an application that is not only useful for travelers but also serves as a comprehensive portfolio of our growth as web developers.*
