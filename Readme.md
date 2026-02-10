# MERN Authentication System

A full-featured authentication system built using the MERN stack with email verification and password reset using OTP.

## Features
- User signup & login
- Email verification using OTP
- reset password flow
- OTP-based verification
- Global alert system for success & errors
- Secure authentication APIs
  
## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth & Utils:** JWT, bcrypt, nodemailer
- **State Management:** React Context API

## 📂 Project Structure
```
mern-authentication-system/
│
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── assets/             # Images & icons
│       ├── components/         # Reusable UI components
│       ├── context/            # Global state (Auth, Alerts)
│       ├── pages/              # Login, Signup, ResetPassword, EmailVerify
│       ├── App.jsx
│       └── main.jsx
│
├── server/                     # Node.js backend
│   ├── config/                 # db & mail configuration (nodemailer)
│   ├── controllers/            # Auth & OTP logic
│   ├── middleware/             # Auth middleware
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── utils/                  # async wrapper & custom error class
│   └── server.js               # Server entry point
│
└── README.md
```

