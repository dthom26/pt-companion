# Quick Start Guide - PT Companion

## 🚀 Your App is Now Running!

### Current Status

✅ Backend API running on: `http://localhost:5000`
✅ Frontend app running on: `http://localhost:5173`
✅ MongoDB connection ready (configure in backend/.env)

## 📝 First Steps

### 1. Test the Application

**Option A: Register as a Physical Therapist (PT)**

1. Go to `http://localhost:5173/trainer/login`
2. Click "Don't have an account? Register"
3. Fill in your details
4. After registration, you'll see your **signup code** on the dashboard
5. Share this code with clients

**Option B: Register as a Client**

1. Go to `http://localhost:5173/client/login`
2. Click "Don't have an account? Register"
3. Enter the signup code from your PT
4. Fill in your details
5. You'll be linked to your PT automatically

### 2. Test the Features

#### As a PT:

- ✅ View your signup code on the dashboard
- ✅ See your client list (empty initially)
- ✅ Toggle light/dark theme
- 🔜 Create workouts and programs (UI ready, coming soon)
- 🔜 View client details and progress

#### As a Client:

- ✅ View your dashboard
- ✅ See assigned programs (none initially)
- ✅ View session history
- ✅ Toggle light/dark theme
- 🔜 Log workout sessions
- 🔜 Track progress

## 🔧 Configuration

### MongoDB Setup

#### Option 1: Local MongoDB

```bash
# Install MongoDB locally
# Then start it:
mongod
```

#### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pt-companion
```

### Environment Variables

**Backend** (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pt-companion
JWT_SECRET=change-this-to-a-secure-random-string
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend** (`react/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🛠️ Development Commands

### Backend

```bash
cd backend
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start without auto-reload
```

### Frontend

```bash
cd react
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📋 Testing the API Directly

You can use tools like Postman or curl to test the API:

### Register a Trainer

```bash
curl -X POST http://localhost:5000/api/auth/trainer/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trainer@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "company": "Physio Clinic"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trainer@example.com",
    "password": "password123",
    "role": "trainer"
  }'
```

### Health Check

```bash
curl http://localhost:5000/api/health
```

## 🎨 Customization

### Change Primary Color

Edit `react/tailwind.config.js`:

```js
colors: {
  primary: "#9784FA", // Change this to your desired color
}
```

### Modify Theme Variables

Edit `react/src/index.css` to adjust colors, spacing, etc.

## 📁 Project Structure Recap

```
pt-companion/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/      # MongoDB schemas
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   └── server.js    # Entry point
│   └── package.json
│
└── react/               # React + Vite frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── context/     # Auth & Theme context
    │   ├── services/    # API calls
    │   └── App.jsx      # Main app
    └── package.json
```

## 🐛 Troubleshooting

### Backend won't start

- Check if MongoDB is running
- Verify `.env` file exists in `backend/`
- Check if port 5000 is available

### Frontend won't start

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 5173 is available
- Verify `.env` file exists in `react/`

### Can't login

- Check browser console for errors
- Verify backend is running on port 5000
- Check MongoDB connection

### Database errors

- Ensure MongoDB is running
- Check connection string in `backend/.env`
- Look at backend terminal for error messages

## 🚧 What's Built vs What's Next

### ✅ Already Built

- Complete authentication system (JWT)
- User registration (PT and Client)
- Signup code system
- Dashboard layouts for both roles
- Theme switching (light/dark)
- API structure for all features
- Database models and schemas
- Protected routes

### 🔜 Coming Next

- Create workout and program forms
- Session logging interface
- Client detail pages
- Progress tracking charts
- Messaging interface
- File upload for exercise images/videos
- Stripe subscription integration

## 💡 Tips

1. **Keep both terminals running** - Backend and frontend need to run simultaneously
2. **Check MongoDB** - Make sure it's connected before testing
3. **Use the browser console** - It shows helpful error messages
4. **Dark mode** - Toggle the moon/sun icon in the top right
5. **API documentation** - Check the README.md for all available endpoints

## 📞 Need Help?

- Check the main `README.md` for detailed documentation
- Review the CSV files for feature specifications
- Look at API endpoint documentation in README
- Check browser console and server logs for errors

Happy coding! 🎉
