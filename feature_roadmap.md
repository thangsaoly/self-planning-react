# 🗺️ Self-Planning Travel Planner — Master Feature Roadmap

Each phase is self-contained and can be done one at a time. They are ordered by impact and dependency (later phases build on earlier ones).

---

## Phase 6 — User Profile & Account Management

**Goal:** Let users edit their name, email, and password after signing up.

### Backend

#### [MODIFY] `server/routes/api.js`
Add 2 new protected routes:
- `GET /api/user/profile` — return `{ name, email, createdAt }`
- `PUT /api/user/profile` — update `fullname` and/or `email` (check email uniqueness)
- `PUT /api/user/password` — verify old password with `bcrypt.compare`, then hash and save new password

#### [MODIFY] `server/models/User.js`
Add optional `avatarUrl` field (`DataTypes.STRING`, nullable) — used in Phase 8 (image upload).

### Frontend

#### [NEW] `src/pages/ProfilePage.jsx`
A new full page at route `/profile` (protected). Contains:
- **Profile Card** — shows avatar initial circle, name, email, `createdAt` date
- **Edit Profile Form** — editable `fullname` and `email` fields with a Save button
- **Change Password Form** — `old password`, `new password`, `confirm new password` with validation
- Success/error toasts on submit

#### [NEW] `src/services/userService.js`
- `getProfile(token)` → `GET /api/user/profile`
- `updateProfile(token, data)` → `PUT /api/user/profile`
- `changePassword(token, data)` → `PUT /api/user/password`

#### [MODIFY] `src/App.jsx`
Add route: `<Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />`

#### [MODIFY] `src/components/NavBar.jsx`
Add a "Profile" link in the dropdown menu for logged-in users (next to logout button).

---

## Phase 7 — Forgot Password / Email Reset Flow

**Goal:** Allow users to reset a forgotten password via a secure email link.

> [!IMPORTANT]
> This phase requires a working SMTP email setup. Use **Nodemailer** with Gmail (App Password) or Mailtrap (free testing inbox). Add `EMAIL_USER`, `EMAIL_PASS`, and `FRONTEND_URL` to `server/.env`.

### Backend

#### [NEW] `server/models/PasswordReset.js`
A new Sequelize model:
- `id` (UUID)
- `userId` (FK → User)
- `token` (STRING, unique — a crypto random hex string)
- `expiresAt` (DATE — 1 hour from creation)

#### [NEW] `server/config/email.js`
Nodemailer transporter setup, reads from `.env`.

#### [MODIFY] `server/routes/api.js`
Add 2 public routes (no auth required):
- `POST /api/auth/forgot-password` — find user by email, generate reset token, save to DB, send email with reset link `${FRONTEND_URL}/reset-password?token=xxx`
- `POST /api/auth/reset-password` — validate token exists + not expired, hash new password, update user, delete token record

#### [MODIFY] `server/models/index.js`
Add `PasswordReset` model and association: `User.hasMany(PasswordReset, { onDelete: 'CASCADE' })`

### Frontend

#### [NEW] `src/pages/ForgotPasswordPage.jsx`
Route: `/forgot-password` (public)
- Single email input + Submit button
- Shows success message: "Check your inbox for a reset link"

#### [NEW] `src/pages/ResetPasswordPage.jsx`
Route: `/reset-password` (public, reads `?token=` from URL)
- `new password` + `confirm password` inputs
- On submit: calls `POST /api/auth/reset-password` with token + new password
- On success: redirect to login with toast "Password reset successfully!"

#### [MODIFY] `src/App.jsx`
Add routes for both new pages.

#### [MODIFY] `src/components/AuthModal.jsx`
Add "Forgot password?" link on the Login tab that navigates to `/forgot-password`.

---

## Phase 8 — Trip Statistics Dashboard

**Goal:** Show a beautiful analytics card at the top of the dashboard with trip stats.

### Frontend Only (all data already in state)

#### [NEW] `src/components/StatsCard.jsx`
A visually striking horizontal stats bar rendered above the TripSection list. Displays:
- **Total Trips** (sum of all 3 sections)
- **Visiting Now** count with a pulsing green dot
- **Upcoming** count
- **Visited** count
- **Todo Completion %** — `completedTodos / totalTodos` across all trips
- **Packing Completion %** — same for packing items
- **Countries Visited** — count of unique trip names in the "visited" section (approximation — or use a `country` field if added)

Use animated count-up numbers (`useEffect` + `requestAnimationFrame` or a small lib like `react-countup`).

#### [MODIFY] `src/pages/DashboardPage.jsx`
Render `<StatsCard visitingTrips={...} upcomingTrips={...} visitedTrips={...} />` just above the trip sections (inside the container box, after the loading skeleton).

---

## Phase 9 — Image Upload (Custom Trip Cover)

**Goal:** Let users upload a real image file for trip cover instead of pasting a URL.

> [!IMPORTANT]
> Requires `multer` on the backend. Files are stored in `server/uploads/` (add to `.gitignore`). For production, consider Cloudinary.

### Backend

#### [NEW] `server/middleware/upload.js`
Multer config:
- `storage`: `diskStorage` → `server/uploads/` directory
- `fileFilter`: accept only `image/jpeg`, `image/png`, `image/webp`
- `limits`: max 5MB

#### [MODIFY] `server/routes/api.js`
Add new protected route:
- `POST /api/upload` — uses multer middleware, returns `{ url: "/uploads/filename.jpg" }`

#### [MODIFY] `server/server.js`
Serve the uploads directory as static: `app.use('/uploads', express.static('uploads'))`

### Frontend

#### [MODIFY] `src/components/NewPlanModal.jsx`
Replace the "Image URL" text input with:
- A styled file drop zone / click-to-upload area
- Preview thumbnail of selected image
- On file select: `POST /api/upload` → get back URL → store in form state
- Keep URL input as a fallback toggle ("Or paste a URL instead")

#### [MODIFY] `src/services/tripService.js`
Add `uploadImage(token, file)` function using `FormData`.

---

## Phase 10 — Budget Tracker Visualization

**Goal:** Visualize per-trip budget data with a chart. The `costs` JSON field already exists in the Trip model.

### Frontend Only

#### Install dependency
```
npm install recharts
```

#### [MODIFY] `src/components/TripDetails/CostsSection.jsx`
Currently this section has cost items. Add:
- A `<PieChart>` or `<BarChart>` from Recharts showing cost breakdown by category
- A "Total Spent" vs "Budget" progress bar (requires adding a `budgetLimit` field to the cost form)
- Color-coded categories (transport, accommodation, food, activities, other)

#### [MODIFY] `server/models/Trip.js`
Add `budgetLimit` field (`DataTypes.FLOAT`, nullable) — total planned budget for the trip.

#### [MODIFY] `server/routes/api.js`
The existing `PUT /api/trips/:id` already handles any field update, so no backend change needed as long as the field is in the model.

---

## Phase 11 — Trip Sharing (Public Read-Only Link)

**Goal:** Generate a shareable link for a trip that anyone can view — no login required.

### Backend

#### [MODIFY] `server/models/Trip.js`
Add `shareToken` field (`DataTypes.STRING`, nullable, unique) — a random 12-char alphanumeric string.

#### [MODIFY] `server/routes/api.js`
Add 2 routes:
- `POST /api/trips/:id/share` (protected) — generate & save `shareToken`, return it
- `DELETE /api/trips/:id/share` (protected) — set `shareToken = null` to revoke
- `GET /api/trips/public/:shareToken` (public, no auth) — return trip data (strip out userId)

### Frontend

#### [NEW] `src/pages/PublicTripPage.jsx`
Route: `/trip/:shareToken` (public)
- Fetches trip from `GET /api/trips/public/:shareToken`
- Read-only, beautiful layout — shows cover image, destination, dates, itinerary, highlights, packing list
- "Plan your own trip" CTA at the bottom linking to the landing page

#### [MODIFY] `src/components/TripDetails/TripCover.jsx`
Add a "Share" button. On click:
- If no `shareToken` → call `POST /api/trips/:id/share` → copy link to clipboard + show toast
- If has `shareToken` → show current link with a "Revoke" option

#### [MODIFY] `src/App.jsx`
Add route: `<Route path="/trip/:shareToken" element={<PublicTripPage />} />`

---

## Phase 12 — Global Search

**Goal:** Search across all trips from anywhere in the NavBar.

### Frontend Only

#### [NEW] `src/hooks/useTripSearch.js`
A custom hook that:
- Takes `query` string and the 3 trip arrays
- Returns `results[]` — each result has `trip` + `section` label
- Debounces the query (150ms) to avoid re-filtering on every keystroke

#### [MODIFY] `src/components/NavBar.jsx`
Add a search icon button (🔍) in the NavBar. On click:
- Expands an inline search input (animated slide-in)
- Shows a dropdown of matching trips grouped by section
- Clicking a result navigates to `/dashboard` and opens that trip's detail modal

> [!NOTE]
> This requires lifting the `setSelectedTrip` / `setIsTripDetailOpen` state up, or using a new `TripSearchContext` that the Dashboard subscribes to.

#### [NEW] `src/context/TripSearchContext.jsx`
A simple context that holds `{ searchTarget, setSearchTarget }`. Dashboard reads `searchTarget` and opens the corresponding trip detail modal, then clears it.

---

## Phase 13 — Email Verification on Signup

**Goal:** Require users to verify their email before they can access the dashboard.

> [!IMPORTANT]
> Depends on Phase 7 (email setup with Nodemailer must be done first).

### Backend

#### [MODIFY] `server/models/User.js`
Add `isVerified` field (`DataTypes.BOOLEAN`, `defaultValue: false`).

#### [MODIFY] `server/routes/api.js`
- Modify `POST /api/auth/signup` — after creating the user, generate a verification token, email it, and respond with `"Please check your email to verify your account"`
- Add `GET /api/auth/verify-email?token=xxx` — mark user as `isVerified: true`, delete token

#### [MODIFY] `server/middleware/auth.js`
In the `protect` middleware, after verifying the JWT, check `user.isVerified`. If false, return `403 { message: "Please verify your email first" }`.

### Frontend

#### [NEW] `src/pages/VerifyEmailPage.jsx`
Route: `/verify-email` (public)
- Reads `?token=` from URL, calls the verify API on mount
- Shows "Verifying..." spinner → then success or error state

#### [NEW] `src/pages/CheckEmailPage.jsx`
Route: `/check-email` (public)
- Simple page shown after signup: "We sent a verification link to your email. Please check your inbox."
- "Resend email" button calls `POST /api/auth/resend-verification`

#### [MODIFY] `src/App.jsx`
Add routes for both new pages. Redirect to `/check-email` after successful signup.

---

## Phase 14 — Dark / Light Mode Toggle

**Goal:** Add a theme switcher that persists the user's preference.

### Frontend Only — Very Quick Win

#### [NEW] `src/context/ThemeContext.jsx`
- Reads initial theme from `localStorage` (default: `"dark"`)
- Provides `{ theme, toggleTheme }`
- On change: sets `document.documentElement.dataset.theme = theme`

#### [MODIFY] `src/index.css`
Your CSS variables are already in `:root`. Add a `[data-theme="light"]` block that overrides the color tokens with light-mode values:
```css
[data-theme="light"] {
  --color-bg-primary: #f8f9fa;
  --color-text-primary: #1a1a2e;
  /* ...etc */
}
```

#### [MODIFY] `src/components/NavBar.jsx`
Add a sun/moon icon toggle button that calls `toggleTheme()`.

#### [MODIFY] `src/main.jsx`
Wrap app in `<ThemeProvider>`.

---

## Phase 15 — Export Trip as PDF

**Goal:** Let users download a beautiful PDF of their trip itinerary.

### Frontend Only

#### Install dependency
```
npm install jspdf html2canvas
```

#### [NEW] `src/components/TripDetails/ExportPdfButton.jsx`
A button inside `TripDetailModal`. On click:
- Shows a hidden `<div id="trip-pdf-content">` with a formatted layout (cover image, trip name, dates, itinerary, packing list, costs summary)
- Calls `html2canvas` to capture it, then `jsPDF` to convert to PDF and trigger download
- File name: `{trip-name}-itinerary.pdf`

#### [MODIFY] `src/components/TripDetailModal.jsx`
Import and render `<ExportPdfButton trip={trip} />` in the modal header/toolbar area.

---

## 📋 Implementation Order Summary

| Phase | Feature | Effort | Dependencies |
|---|---|---|---|
| **6** | User Profile & Account Management | Medium | None |
| **7** | Forgot Password / Email Reset | Medium | Needs SMTP setup |
| **8** | Trip Statistics Dashboard | Small | None |
| **9** | Image Upload | Medium | None |
| **10** | Budget Tracker Chart | Small | `npm i recharts` |
| **11** | Trip Sharing (Public Link) | Medium | None |
| **12** | Global Search | Medium | None |
| **13** | Email Verification | Small | Phase 7 must be done first |
| **14** | Dark / Light Mode | Small | None |
| **15** | Export as PDF | Small | `npm i jspdf html2canvas` |

> [!TIP]
> **Recommended order:** 8 → 14 → 10 → 6 → 7 → 13 → 9 → 11 → 12 → 15
> Start with the quick wins (Stats, Dark Mode, Charts) to build momentum, then tackle the backend-heavy features.
