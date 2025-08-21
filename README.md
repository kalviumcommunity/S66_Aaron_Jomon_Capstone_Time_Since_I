# Time Since I...

## Authored by Aaron Jomon

## Backend Deployed Link
- https://time-since-i.onrender.com

## Frontend Deployed Link
- https://timesincei.netlify.app/

## Project Idea & Brief Description
"Time Since I..." is a web application that helps users track the time since they last completed an activity. Unlike recurring alarms, which can get out of sync when missed, this app provides a simple "Done It" button to reset the timer dynamically. The goal is to help users manage habits, chores, and personal activities efficiently.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT-based authentication
- **Hosting:** Vercel (Frontend) & Render/Heroku (Backend)
- **Version Control:** GitHub

## Features
- ✅ Track various activities and how long since they were last done
- ✅ Simple "Done It" button to reset the timer
- ✅ User authentication & account management (JWT-based)
- ✅ Activity creation with name, description, and frequency
- ✅ Visual time indicators (color-coded based on frequency)
- ✅ Activity editing and deletion
- ✅ Responsive design with modern UI
- ✅ Secure API endpoints with authentication middleware
- ✅ Input validation and error handling
- 🔄 Task grouping and categorization (future enhancement)
- 🔄 Optional sharing with family groups (future enhancement)
- 🔄 Recommendation engine for recurring tasks (future enhancement)

## How to Run Locally

### Backend Setup
1. Navigate to the Backend directory: `cd Backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Set up your MongoDB connection string in the `.env` file
5. Start the server: `npm run dev` (development) or `npm start` (production)

### Frontend Setup
1. Navigate to the Frontend directory: `cd Frontend`
2. Install dependencies: `npm install`
3. Update the API URL in `.env` if needed (defaults to production backend)
4. Start the development server: `npm start`

### Environment Variables
- **Backend**: Copy `.env.example` to `.env` and update with your values
- **Frontend**: Update `REACT_APP_API_URL` in `.env` to point to your backend

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user

### Activities (Protected Routes)
- `GET /api/activities` - Get all activities for authenticated user
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `PATCH /api/activities/:id/done` - Mark activity as done

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 30-Day Plan

### **Week 1: Planning & Setup**
- **Day 1-2:** Define the project scope, finalize features, and set up GitHub repo.
- **Day 3:** Design low-fidelity wireframes for UI.
- **Day 4:** Create high-fidelity UI designs using Figma.
- **Day 5:** Set up React frontend with initial folder structure.
- **Day 6:** Set up Node.js and Express backend.
- **Day 7:** Plan and define MongoDB schema.

### **Week 2: Backend Development**
- **Day 8-9:** Implement user authentication (JWT-based login & signup).
- **Day 10-11:** Create CRUD APIs for tasks and activity tracking.
- **Day 12:** Integrate authentication middleware.
- **Day 13-14:** Test API endpoints using Postman.

### **Week 3: Frontend Development**
- **Day 15-16:** Implement React components for the home screen and dashboard.
- **Day 17-18:** Set up state management (Context API / Redux if needed).
- **Day 19:** Connect frontend with backend APIs.
- **Day 20:** Implement UI for "Done It" functionality.
- **Day 21:** Implement task creation & tracking views.

### **Week 4: Enhancements & Deployment**
- **Day 22-23:** Add user profile and settings page.
- **Day 24:** Implement notification/reminder system.
- **Day 25:** Implement optional task sharing within groups.
- **Day 26:** Final debugging & testing.
- **Day 27:** Deploy frontend to Vercel.
- **Day 28:** Deploy backend to Render/Heroku.
- **Day 29:** Conduct final testing & polish UI.
- **Day 30:** Prepare final documentation and presentation.
