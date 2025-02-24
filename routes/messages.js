const express = require('express');
const pool = require('../db');

const router = express.Router();

// Send Message
router.post('/send', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

  const { receiver_id, content } = req.body;

  try {
    await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)',
      [req.session.user.id, receiver_id, content]
    );
    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Message sending failed" });
  }
});

// Fetch Messages
router.get('/history/:receiver_id', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY timestamp',
      [req.session.user.id, req.params.receiver_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

// Delete a message
router.delete('/delete/:message_id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
  
    try {
      const result = await pool.query(
        'DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING *',
        [req.params.message_id, req.session.user.id]
      );
  
      if (result.rowCount === 0) return res.status(403).json({ error: "Not allowed to delete" });
  
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Message deletion failed" });
    }
  });

// Mark Message as Read
router.put('/mark-read/:message_id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
  
    try {
      await pool.query(
        'UPDATE messages SET read_status = TRUE WHERE id = $1 AND receiver_id = $2',
        [req.params.message_id, req.session.user.id]
      );
  
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update read status" });
    }
  });
  

module.exports = router;
