const express = require('express');
const pool = require('../db');

const router = express.Router();

// Create Group
router.post('/create', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

  const { name } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO groups (name, created_by) VALUES ($1, $2) RETURNING id',
      [name, req.session.user.id]
    );

    res.json({ group_id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Send Message to Group
router.post('/send', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

  const { group_id, content } = req.body;

  try {
    await pool.query(
      'INSERT INTO group_messages (group_id, sender_id, content) VALUES ($1, $2, $3)',
      [group_id, req.session.user.id, content]
    );

    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
