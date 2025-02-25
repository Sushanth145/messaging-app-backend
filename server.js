require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(express.json());


app.use(cors({
  origin: "http://localhost:3000", // Allow frontend access
  credentials: true // Important for session-based auth
}));

// **Configure Sessions Correctly**
app.use(session({
  store: new pgSession({
    pool: pool, 
    tableName: 'sessions'
  }),
  secret: 'your_secret_key', // Change this to a secure key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// **Import Routes AFTER initializing session**
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);

app.get('/', (req, res) => res.send("Messaging App API Running"));

app.listen(3000, () => console.log('Server running on port 3000'));
