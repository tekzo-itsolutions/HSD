import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, getPool } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Helper to format date strings YYYY-MM-DD
function formatDateForSQL(d) {
  if (!d) return new Date().toISOString().split('T')[0];
  if (typeof d === 'string' && d.includes('T')) return d.split('T')[0];
  return d;
}

// ==================== HEALTH & STATUS ====================
app.get('/api/health', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT 1 as is_connected');
    res.json({
      status: 'ok',
      database: 'connected',
      dbName: process.env.DB_NAME || 'shreedan_hotel',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: err.message
    });
  }
});

// ==================== 1. ROOM BOOKINGS API ====================

// GET /api/rooms - List all room bookings
app.get('/api/rooms', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        room_type AS roomType, 
        room_code AS roomCode, 
        DATE_FORMAT(check_in, '%Y-%m-%d') AS checkIn, 
        DATE_FORMAT(check_out, '%Y-%m-%d') AS checkOut, 
        adults, 
        children, 
        nights, 
        total, 
        status, 
        pay_status AS payStatus,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS dateCreated
      FROM room_bookings 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Failed to fetch room bookings' });
  }
});

// POST /api/rooms - Create new room booking
app.post('/api/rooms', async (req, res) => {
  try {
    const pool = getPool();
    const {
      id,
      name,
      phone,
      email,
      roomType,
      roomCode,
      checkIn,
      checkOut,
      adults = 1,
      children = 0,
      nights = 1,
      total = 0,
      status = 'confirmed',
      payStatus = 'Paid'
    } = req.body;

    const bookingId = id || ('SD-' + Math.floor(1000000 + Math.random() * 9000000));
    const cleanCheckIn = formatDateForSQL(checkIn);
    const cleanCheckOut = formatDateForSQL(checkOut);

    await pool.query(`
      INSERT INTO room_bookings 
        (id, name, phone, email, room_type, room_code, check_in, check_out, adults, children, nights, total, status, pay_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      bookingId,
      name,
      phone || '',
      email || '',
      roomType,
      roomCode || '',
      cleanCheckIn,
      cleanCheckOut,
      Number(adults) || 1,
      Number(children) || 0,
      Number(nights) || 1,
      Number(total) || 0,
      status,
      payStatus
    ]);

    const [inserted] = await pool.query(`
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        room_type AS roomType, 
        room_code AS roomCode, 
        DATE_FORMAT(check_in, '%Y-%m-%d') AS checkIn, 
        DATE_FORMAT(check_out, '%Y-%m-%d') AS checkOut, 
        adults, 
        children, 
        nights, 
        total, 
        status, 
        pay_status AS payStatus,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS dateCreated
      FROM room_bookings WHERE id = ?
    `, [bookingId]);

    console.log(`🏨 [MySQL] Room Booking inserted: ${bookingId} for ${name}`);
    res.status(201).json(inserted[0]);
  } catch (err) {
    console.error('Error creating room booking:', err);
    res.status(500).json({ error: 'Failed to create room booking: ' + err.message });
  }
});

// PUT /api/rooms/:id/status - Update room booking status
app.put('/api/rooms/:id/status', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'checked-in', 'pending', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid room status' });
    }

    await pool.query('UPDATE room_bookings SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Room status updated successfully', id, status });
  } catch (err) {
    console.error('Error updating room status:', err);
    res.status(500).json({ error: 'Failed to update room status' });
  }
});

// DELETE /api/rooms/:id - Delete room booking
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    await pool.query('DELETE FROM room_bookings WHERE id = ?', [id]);
    res.json({ message: 'Room booking deleted successfully', id });
  } catch (err) {
    console.error('Error deleting room booking:', err);
    res.status(500).json({ error: 'Failed to delete room booking' });
  }
});

// ==================== 2. SPA BOOKINGS API ====================

// GET /api/spa - List all spa bookings
app.get('/api/spa', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        service, 
        service_code AS serviceCode, 
        DATE_FORMAT(date, '%Y-%m-%d') AS date, 
        time_slot AS timeSlot, 
        duration, 
        price, 
        status,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS dateCreated
      FROM spa_bookings 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching spa bookings:', err);
    res.status(500).json({ error: 'Failed to fetch spa bookings' });
  }
});

// POST /api/spa - Create new spa booking
app.post('/api/spa', async (req, res) => {
  try {
    const pool = getPool();
    const {
      id,
      name,
      phone,
      email,
      service,
      serviceCode = 'signature',
      date,
      timeSlot,
      duration = '60 mins',
      price = 0,
      status = 'confirmed'
    } = req.body;

    const spaId = id || ('SPA-' + Math.floor(1000 + Math.random() * 9000));
    const cleanDate = formatDateForSQL(date);

    await pool.query(`
      INSERT INTO spa_bookings 
        (id, name, phone, email, service, service_code, date, time_slot, duration, price, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      spaId,
      name,
      phone || '',
      email || '',
      service,
      serviceCode,
      cleanDate,
      timeSlot || '02:00 PM',
      duration,
      Number(price) || 0,
      status
    ]);

    const [inserted] = await pool.query(`
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        service, 
        service_code AS serviceCode, 
        DATE_FORMAT(date, '%Y-%m-%d') AS date, 
        time_slot AS timeSlot, 
        duration, 
        price, 
        status,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS dateCreated
      FROM spa_bookings WHERE id = ?
    `, [spaId]);

    console.log(`🧘 [MySQL] Spa Appointment inserted: ${spaId} for ${name}`);
    res.status(201).json(inserted[0]);
  } catch (err) {
    console.error('Error creating spa booking:', err);
    res.status(500).json({ error: 'Failed to create spa booking: ' + err.message });
  }
});

// PUT /api/spa/:id/status - Update spa booking status
app.put('/api/spa/:id/status', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'completed', 'pending', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid spa status' });
    }

    await pool.query('UPDATE spa_bookings SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Spa status updated successfully', id, status });
  } catch (err) {
    console.error('Error updating spa status:', err);
    res.status(500).json({ error: 'Failed to update spa status' });
  }
});

// DELETE /api/spa/:id - Delete spa booking
app.delete('/api/spa/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    await pool.query('DELETE FROM spa_bookings WHERE id = ?', [id]);
    res.json({ message: 'Spa booking deleted successfully', id });
  } catch (err) {
    console.error('Error deleting spa booking:', err);
    res.status(500).json({ error: 'Failed to delete spa booking' });
  }
});

// ==================== 3. MESSAGES & CONTACT API ====================

// GET /api/messages - List all messages
app.get('/api/messages', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        subject, 
        message, 
        status, 
        replied, 
        reply_text AS replyText,
        DATE_FORMAT(created_at, '%d %b %Y') AS date,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS dateCreated
      FROM messages 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/messages - Create new guest inquiry
app.post('/api/messages', async (req, res) => {
  try {
    const pool = getPool();
    const {
      id,
      name,
      email,
      phone,
      subject,
      message,
      status = 'unread'
    } = req.body;

    const msgId = id || ('MSG-' + Math.floor(1000 + Math.random() * 9000));

    await pool.query(`
      INSERT INTO messages 
        (id, name, email, phone, subject, message, status, replied) 
      VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)
    `, [
      msgId,
      name,
      email,
      phone || '',
      subject || 'General Inquiry',
      message || '',
      status
    ]);

    const [inserted] = await pool.query(`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        subject, 
        message, 
        status, 
        replied, 
        reply_text AS replyText,
        DATE_FORMAT(created_at, '%d %b %Y') AS date,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS dateCreated
      FROM messages WHERE id = ?
    `, [msgId]);

    console.log(`✉️ [MySQL] Guest Message inserted: ${msgId} from ${name}`);
    res.status(201).json(inserted[0]);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message: ' + err.message });
  }
});

// PUT /api/messages/:id/reply - Save reply and mark as replied
app.put('/api/messages/:id/reply', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { replyText } = req.body;

    await pool.query(`
      UPDATE messages 
      SET replied = TRUE, status = 'read', reply_text = ? 
      WHERE id = ?
    `, [replyText, id]);

    res.json({ message: 'Reply recorded successfully', id });
  } catch (err) {
    console.error('Error replying to message:', err);
    res.status(500).json({ error: 'Failed to record reply' });
  }
});

// PUT /api/messages/:id/status - Toggle read/unread
app.put('/api/messages/:id/status', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { status } = req.body;

    await pool.query('UPDATE messages SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Message status updated', id, status });
  } catch (err) {
    console.error('Error updating message status:', err);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

// DELETE /api/messages/:id - Delete message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    await pool.query('DELETE FROM messages WHERE id = ?', [id]);
    res.json({ message: 'Message deleted successfully', id });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ==================== START SERVER ====================
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🏨 HOTEL SHREE DAAN & SPA — BACKEND SERVER`);
      console.log(`🚀 Server running on: http://localhost:${PORT}`);
      console.log(`🔌 Connected Database: ${process.env.DB_NAME || 'shreedan_hotel'}`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start backend server:', err);
    process.exit(1);
  }
}

startServer();
