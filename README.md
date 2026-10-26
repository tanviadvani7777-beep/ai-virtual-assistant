# AI Virtual Assistant (MERN Stack + Google Gemini AI)

A full-stack, voice-enabled AI Virtual Assistant (JARVIS-like clone) built with the **MERN Stack** (MongoDB, Express, React, Node.js) and powered by **Google Gemini AI**.

Inspired by and based on the tutorial: **"Build your own AI Virtual Assistant With MERN STACK | #4 Major Project"** by Virtual Code (Priyanshu Raj).

---

## 🌟 Features

- 🎙️ **Voice Interaction:** Native Web Speech API integration (`SpeechRecognition` & `SpeechSynthesis`) with Hindi & English voice recognition and speech output.
- 🧠 **Google Gemini AI Intelligence:** Natural language intent detection and dynamic voice response formatting.
- ⚡ **Action Execution:** Automatically performs real browser actions based on voice prompts:
  - 🔍 **Google Search:** Opens Google search with spoken queries.
  - 📺 **YouTube Search & Play:** Searches or plays videos directly on YouTube.
  - 🧮 **Calculator:** Opens browser calculator.
  - 📸 **Instagram & Facebook:** Directly launches social media apps.
  - 🌦️ **Weather Forecast:** Shows current local weather.
  - 📅 **Date & Time:** Speaks current time, date, day of the week, or month.
- 👤 **User Authentication:** Complete Signup, Login, and Logout flow secured with **JWT** (stored in HTTP-only cookies) and **bcryptjs** password hashing.
- 🎨 **Persona Customization:**
  - Custom assistant naming (e.g., "Jarvis", "Friday", "Shifra", etc.).
  - Select from predefined avatars or upload your own custom assistant avatar via **Cloudinary** and **Multer**.
- 📜 **Command History:** Logs user voice commands to MongoDB and displays past interactions in the dashboard drawer.
- 📱 **Responsive UI:** Modern futuristic dark theme built with React and Tailwind CSS v4.

---

## 🏗️ Architecture & Tech Stack

```
ai-virtual-assistant/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary SDK setup for avatar uploads
│   │   ├── db.js               # MongoDB connection logic
│   │   └── token.js            # JWT token generator
│   ├── controllers/
│   │   ├── auth.controllers.js # Signup, Signin, Logout handlers
│   │   └── user.controllers.js # Profile, assistant updates, command handling
│   ├── middlewares/
│   │   ├── isAuth.js           # JWT verification middleware
│   │   └── multer.js           # File upload handling (public folder)
│   ├── models/
│   │   └── user.model.js       # User & assistant profile Mongoose schema
│   ├── routes/
│   │   ├── auth.routes.js      # Auth API endpoints (/api/auth)
│   │   └── user.routes.js      # User & Assistant API endpoints (/api/user)
│   ├── gemini.js               # Google Gemini API prompt & intent engine
│   ├── index.js                # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/             # Assistant avatars, GIFs, and background images
│   │   ├── components/         # Card and reusable UI components
│   │   ├── context/            # UserContext (authentication & state store)
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Main Assistant interface with speech controls
│   │   │   ├── SignIn.jsx      # Login page
│   │   │   ├── SignUp.jsx      # Registration page
│   │   │   ├── Customize.jsx   # Avatar selection & image upload
│   │   │   └── Customize2.jsx  # Assistant naming step
│   │   ├── App.jsx             # React Router routing & protected routes
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind CSS imports
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local MongoDB instance or free MongoDB Atlas cluster)
- **Google Gemini API Key** (Get free key from [Google AI Studio](https://aistudio.google.com/))
- **Cloudinary Account** (Optional: only needed if uploading custom assistant avatar images)

---

### 2. Backend Setup

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file inside `backend/` (or copy from `.env.example`):
   ```env
   PORT=8000
   CLIENT_URL=http://localhost:5173
   MONGODB_URL=mongodb://localhost:27017/virtual-assistant
   JWT_SECRET=your_jwt_secret_key_here

   # Google Gemini API (Either GEMINI_API_KEY or full GEMINI_API_URL)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Cloudinary (Optional, for custom avatar uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:8000`.

---

### 3. Frontend Setup

1. Open a new terminal in `frontend/`:
   ```bash
   cd frontend
   npm install
   ```

2. (Optional) Check `frontend/.env`:
   ```env
   VITE_SERVER_URL=http://localhost:8000
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser (Google Chrome or Microsoft Edge recommended for Web Speech API).

---

## 🎙️ How to Use the Virtual Assistant

1. **Sign Up**: Create an account with your Name, Email, and Password.
2. **Customize**:
   - Choose one of the preset assistant avatars or upload your own picture.
   - Enter your Assistant's Name (e.g. `Jarvis`, `Friday`, `Alexa`, `Shifra`).
3. **Voice Interaction**:
   - Allow microphone permissions in your browser when prompted.
   - Say the assistant's name followed by a command:
     - *"Jarvis, what is the time?"*
     - *"Jarvis, what is today's date?"*
     - *"Jarvis, play Interstellar soundtrack on YouTube"*
     - *"Jarvis, search Quantum Computing on Google"*
     - *"Jarvis, open calculator"*
     - *"Jarvis, what is the weather today?"*
     - *"Jarvis, who made you?"* (The assistant will respond with your name!)

---

## 💡 Notes & Troubleshooting
- **Microphone Permissions**: Ensure microphone access is permitted for `http://localhost:5173`.
- **Browser Compatibility**: The Web Speech API is natively supported in Google Chrome, Microsoft Edge, and Opera.
- **Speech Synthesis Voice**: Home page configures speech synthesis to speak responses with natural vocal feedback.
