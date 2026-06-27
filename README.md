# Self-Planning Travel Planner

The **Self-Planning Travel Planner** is a comprehensive, full-stack digital companion designed to streamline your travel preparation. Stop juggling spreadsheets, notes, and separate apps—this platform consolidates everything from to-do lists and itineraries to budget tracking and packing lists into one unified, intuitive interface, now powered by AI.

## 🚀 Key Features
- **Interactive Trip Dashboard:** Manage all your visiting, upcoming, and past trips in one place with a beautiful dark-mode UI.
- **Detailed Trip Modals:** Organize destinations, travel dates, transport, accommodation, and daily activities.
- **To-Do & Packing Lists:** Seamlessly track tasks, add priorities, and ensure nothing is forgotten.
- **Financial Tracker:** Stay on budget with built-in expense categorization and real-time balance calculations.
- **Pisey AI Assistant:** A contextual travel assistant that uses your actual trip data to calculate costs, recommend packing items, and provide itinerary advice using OpenRouter AI.
- **Secure Authentication:** Full JWT-based login and registration system with secure password hashing.

## 🛠️ Tech Stack & Architecture
This project is built using a modern full-stack JavaScript environment:
- **Frontend:** React 19, React Router v7, Vite v7
- **Styling:** Tailwind CSS v4, custom CSS with glassmorphism and modern UI elements.
- **Backend:** Node.js, Express.js
- **Database:** SQLite3 managed by Sequelize ORM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **AI Integration:** OpenRouter API (LLM generation)

## 📁 Project Structure

```text
self-planning-react/
├── server/
│   ├── config/          # Database configuration (database.js)
│   ├── middleware/      # Express middleware (auth.js)
│   ├── models/          # Sequelize models (User.js, Trip.js, index.js)
│   ├── routes/          # API endpoints (api.js)
│   ├── server.js        # Backend entry point
│   └── seed-users.js    # Database seeding utility
├── src/
│   ├── assets/          # Images, SVGs, global CSS
│   ├── components/      # React components (ChatWidget, TripDetailModal, etc.)
│   ├── context/         # React Contexts (AuthContext, ToastContext)
│   ├── pages/           # Route views (DashboardPage, AuthPage, LandingPage)
│   └── main.jsx         # Frontend entry point
├── .env                 # Environment variables (Backend/Global)
├── package.json         # Root scripts and dependencies
└── eslint.config.js     # Linter configuration
```

## ⚙️ Environment Variables

Create a `.env` file in the **`server`** directory (or root) with the following parameters:

```env
PORT=5000
NODE_ENV=development

# Database Settings
DB_STORAGE=./database.sqlite

# Security Settings
JWT_SECRET=your_super_secret_jwt_string_here

# AI Chat API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository
2. Install all dependencies for both frontend and backend:
   ```bash
   npm install
   npm install --prefix server
   ```

### Running the Application
We use `concurrently` to run both the frontend (Vite) and backend (Express) in a single command.

```bash
# Starts both frontend on port 5173 and backend on port 5000
npm run dev
```

### Building for Production
```bash
# Lints the project and builds the Vite frontend bundle
npm run build
```

## 🗄️ Database Schema

### `Users` Table
- `id`: UUID (Primary Key)
- `fullname`: String
- `email`: String (Unique)
- `password`: String (Hashed)

### `Trips` Table
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key)
- `name`: String
- `travelStatus`: Enum ('visiting', 'upcoming', 'visited')
- `travelType`: String
- `startDate` / `endDate`: Date
- `itinerary`: JSON Array
- `todos`: JSON Array
- `packing`: JSON Array
- `costs`: JSON Array

## 🔌 API Endpoints
All API routes are prefixed with `/api`.
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate and retrieve JWT
- `GET /trips` - Get all trips for the authenticated user
- `POST /trips` - Create a new trip
- `PUT /trips/:id` - Update a trip
- `DELETE /trips/:id` - Delete a trip
- `POST /chat` - Interact with the Pisey AI Assistant

## 🤖 Pisey AI Chatbot
The chat widget leverages the OpenRouter API to provide a seamless travel assistant experience. The backend dynamically injects the user's active database context (Trip itineraries, budgets, and to-do lists) into the system prompt, allowing the AI to answer specifically about your own travel plans! 

*Note: In the event of an empty model response, the backend now automatically safely catches this and provides a fallback message rather than rendering empty chat bubbles.*

## 🏆 Credits & Acknowledgements

The finalization and modernization of this project into a complete, AI-powered full-stack application was driven by **Thang Saoly**. 

- **Thang Saoly** - *Lead Full-Stack Developer & AI Architect*
  - Spearheaded the complete migration of the frontend to React.
  - Architected and built the entire Express.js & SQLite backend from scratch.
  - Implemented secure JWT authentication and role management.
  - Integrated the OpenRouter AI ecosystem to create the contextual "Pisey" chatbot.
  - Finalized the project documentation and deployment configurations.

- **Tiek Chhunhour** - *Original Co-Creator & Web Developer*
  - Collaborated on the initial Term 1 foundation of the project.
  - Assisted with early HTML, CSS, and structural design concepts before the full-stack migration.
  - Give idea to add chat bot in the project!

For a detailed history of how this project evolved, please read the [PROJECT_JOURNEY.md](./PROJECT_JOURNEY.md).
