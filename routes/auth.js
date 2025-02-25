const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: "User not found" });

    const user = userResult.rows[0];
    if (user.password !== password) return res.status(401).json({ error: "Incorrect password" });

    req.session.user = { id: user.id, username: user.username };
    await new Promise((resolve) => req.session.save(resolve)); // Ensures session is saved before sending response

    console.log("Session after login:", req.session); // Debugging
    res.json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

// Update User Profile
router.put('/update-profile', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
  
    const { profile_pic, bio } = req.body;
  
    try {
      await pool.query(
        'UPDATE users SET profilepic = $1, bio = $2 WHERE id = $3',
        [profile_pic, bio, req.session.user.id]
      );
  
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Profile update failed" });
    }
  });

// Add a Friend
router.post('/add-friend', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
  
    const { friend_id } = req.body;
  
    try {
      await pool.query(
        'INSERT INTO friends (user_id, friend_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [req.session.user.id, friend_id]
      );
  
      res.json({ message: "Friend added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add friend" });
    }
  });
  
  // Get Friends List
  router.get('/friends', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
  
    try {
      const result = await pool.query(
        'SELECT users.id, users.username FROM friends JOIN users ON friends.friend_id = users.id WHERE friends.user_id = $1',
        [req.session.user.id]
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch friends" });
    }
  });
  
module.exports = router;