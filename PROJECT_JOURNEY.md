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

## Phase 4: The Backend Integration (Upcoming)
**Next Steps**

While the application currently handles state purely on the frontend (utilizing `localStorage` for data persistence), the vision for the project doesn't stop here.

The next major milestone is to integrate a **PHP Backend API**. 
- The `api/` directory has already been initialized to house the server logic.
- We plan to implement real user authentication, cloud database storage for trips, and cross-device synchronization.

---

*This project stands as a testament to the power of iterative development. By consistently evaluating our tools and being willing to refactor, we have built an application that is not only useful for travelers but also serves as a comprehensive portfolio of our growth as web developers.*
