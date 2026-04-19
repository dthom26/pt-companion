# PT Companion

A comprehensive physical therapy management application for physical therapists and their clients.

## Overview

PT Companion is a full-stack web application that helps physical therapists manage their clients, create exercise programs, track progress, and communicate with clients. Clients can view their assigned programs, log workout sessions, and track their recovery progress.

## Tech Stack

### Backend

- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **ShadCN** - UI components
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
pt-companion/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env
│
├── react/                   # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── ui/         # ShadCN UI components
│   │   ├── context/        # React Context (Auth, Theme)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── lib/            # Utilities
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── .env
│
└── README.md
```

## Features

### For Physical Therapists (PTs)

- ✅ Register and login with secure authentication
- ✅ Generate unique signup codes for clients
- ✅ View and manage client list
- ✅ Create custom exercise programs and workouts
- ✅ Assign programs to clients
- ✅ Track client progress and session history
- ✅ Message clients
- 🔄 Subscription management (Stripe integration placeholder)

### For Clients

- ✅ Register using PT-provided signup code
- ✅ Login securely
- ✅ View assigned exercise programs
- ✅ Log workout sessions with sets, reps, and weight
- ✅ Track personal progress and statistics
- ✅ Message their PT
- ✅ View workout history

### Additional Features

- ✅ Light/Dark theme toggle (user-selectable)
- ✅ Responsive design
- ✅ RESTful API architecture
- ✅ JWT-based authentication
- ✅ Protected routes

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   cd c:\Users\dalli\pt-companion
   ```

2. **Set up the Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**

   - Copy `.env.example` to `.env`
   - Update MongoDB connection string and JWT secret:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pt-companion
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Set up the Frontend**

   ```bash
   cd ../react
   npm install
   ```

5. **Configure Frontend Environment**
   - The `.env` file is already created with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start MongoDB** (if running locally)

   ```bash
   mongod
   ```

2. **Start the Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

   The API will run on `http://localhost:5000`

3. **Start the Frontend Dev Server** (in a new terminal)

   ```bash
   cd react
   npm run dev
   ```

   The app will run on `http://localhost:5173`

4. **Access the Application**
   - Open your browser to `http://localhost:5173`
   - Start with PT registration at `/trainer/login`
   - Or client registration at `/client/login`

## API Endpoints

### Authentication

- `POST /api/auth/trainer/register` - Register new PT
- `POST /api/auth/client/register` - Register new client (requires signup code)
- `POST /api/auth/login` - Login (trainer or client)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Trainer (PT) Routes

- `GET /api/trainer/clients` - Get all clients
- `GET /api/trainer/clients/:clientId` - Get client details
- `PUT /api/trainer/clients/:clientId` - Update client info
- `DELETE /api/trainer/clients/:clientId` - Remove client

### Programs

- `POST /api/programs` - Create program
- `GET /api/programs` - Get all programs (trainer)
- `GET /api/programs/:programId` - Get program by ID
- `PUT /api/programs/:programId` - Update program
- `DELETE /api/programs/:programId` - Delete program
- `GET /api/programs/my/active` - Get client's active program
- `GET /api/programs/client/:clientId` - Get client's programs

### Workouts

- `POST /api/workouts` - Create workout
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:workoutId` - Get workout by ID
- `PUT /api/workouts/:workoutId` - Update workout
- `DELETE /api/workouts/:workoutId` - Delete workout

### Sessions

- `POST /api/sessions` - Start new session
- `GET /api/sessions` - Get client's sessions
- `GET /api/sessions/:sessionId` - Get session by ID
- `PUT /api/sessions/:sessionId/exercises/:exerciseId` - Update exercise in session
- `PUT /api/sessions/:sessionId/complete` - Complete session
- `GET /api/sessions/client/:clientId` - Get client sessions (trainer)

### Messages

- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/:userId` - Get conversation with user
- `GET /api/messages/unread` - Get unread messages
- `PUT /api/messages/:messageId/read` - Mark message as read
- `PUT /api/messages/conversation/:userId/read` - Mark conversation as read

## Database Schema

### Collections

- **Trainers** - PT accounts with signup codes
- **Clients** - Client accounts linked to trainers
- **Programs** - Exercise programs with blocks and workouts
- **Workouts** - Individual workout templates
- **Sessions** - Client workout session logs
- **Messages** - PT-Client communication

## Next Steps / TODO

- [ ] File upload integration for exercise images/videos
- [ ] Stripe subscription integration
- [ ] Real-time messaging with Socket.io
- [ ] Advanced analytics dashboard
- [ ] Calendar view for scheduled workouts
- [ ] Exercise library with video demonstrations
- [ ] Progress charts and visualization
- [ ] Mobile responsive improvements
- [ ] Push notifications
- [ ] Export workout data

## Design Specifications

- **Theme**: User-selectable Light/Dark mode (default: Light)
- **Primary Color**: #9784FA (purple accent)
- **UI Framework**: ShadCN with Tailwind CSS
- **Design Style**: Friendly, approachable, rounded, fun, uncomplicated

## Development Notes

### Authentication Flow

1. PT registers → receives unique signup code
2. PT shares code with clients
3. Clients register using the code → automatically linked to PT
4. Both can login with email/password
5. JWT tokens stored in localStorage
6. Protected routes check authentication and role

### Signup Code System

- Generated using nanoid (8 characters)
- Format: XXXX-XXXX
- Reusable (not one-time use)
- Each PT has one persistent code
- Clients use code during registration to link to PT

### File Uploads

- Placeholder implementation ready
- Can integrate Cloudinary, AWS S3, or local storage
- Exercise images and videos will be stored as URLs

### Stripe Integration

- Controller and route structure in place
- Webhook handlers ready
- Need to add Stripe API keys and complete integration

## License

Private project - All rights reserved

## Contact

For questions or support, contact your development team.
