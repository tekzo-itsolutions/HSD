import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'abhi4585',
  database: process.env.DB_NAME || 'shreedan_hotel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

let pool = null;

export async function initDatabase() {
  try {
    // 1. First connect without database selected to ensure DB exists
    const rootConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });

    console.log('🔌 Connected to MySQL server successfully.');

    // 2. Create database if it does not exist
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`📁 Database \`${dbConfig.database}\` verified / created.`);
    await rootConnection.end();

    // 3. Create pool with the database selected
    pool = mysql.createPool(dbConfig);

    // 4. Create Tables
    // Table: room_bookings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS room_bookings (
        id VARCHAR(50) NOT NULL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(120) NULL,
        room_type VARCHAR(100) NOT NULL,
        room_code VARCHAR(50) NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        adults INT NOT NULL DEFAULT 1,
        children INT NOT NULL DEFAULT 0,
        nights INT NOT NULL DEFAULT 1,
        total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        status ENUM('confirmed', 'checked-in', 'pending', 'cancelled') NOT NULL DEFAULT 'confirmed',
        pay_status VARCHAR(50) NOT NULL DEFAULT 'Paid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_room_status (status),
        INDEX idx_room_checkin (check_in)
      ) ENGINE=InnoDB;
    `);

    // Table: spa_bookings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS spa_bookings (
        id VARCHAR(50) NOT NULL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(120) NULL,
        service VARCHAR(150) NOT NULL,
        service_code VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        time_slot VARCHAR(50) NOT NULL,
        duration VARCHAR(50) NOT NULL DEFAULT '60 mins',
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        status ENUM('confirmed', 'completed', 'pending', 'cancelled') NOT NULL DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_spa_status (status),
        INDEX idx_spa_date (date)
      ) ENGINE=InnoDB;
    `);

    // Table: messages
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(50) NOT NULL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(120) NOT NULL,
        phone VARCHAR(30) NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('unread', 'read') NOT NULL DEFAULT 'unread',
        replied BOOLEAN NOT NULL DEFAULT FALSE,
        reply_text TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_msg_status (status)
      ) ENGINE=InnoDB;
    `);

    // 5. Seed initial data if empty
    const [roomRows] = await pool.query('SELECT COUNT(*) as count FROM room_bookings');
    if (roomRows[0].count === 0) {
      await pool.query(`
        INSERT INTO room_bookings (id, name, phone, email, room_type, room_code, check_in, check_out, adults, children, nights, total, status, pay_status) VALUES
        ('SD-7859341', 'Arjun Mehta', '+91 98210 12345', 'arjun.mehta@example.com', 'Premier Suite', 'premier', CURDATE() + INTERVAL 1 DAY, CURDATE() + INTERVAL 3 DAY, 2, 1, 2, 15000.00, 'confirmed', 'Paid'),
        ('SD-7859342', 'Priya Sharma', '+91 97110 54321', 'priya.s@example.com', 'Executive Double', 'executive-double', CURDATE(), CURDATE() + INTERVAL 1 DAY, 2, 0, 1, 5500.00, 'checked-in', 'Paid'),
        ('SD-7859343', 'Rajesh Singhania', '+91 98450 87654', 'rajesh.singhania@corp.in', 'Banquet Hall', 'banquet-hall', CURDATE() + INTERVAL 5 DAY, CURDATE() + INTERVAL 6 DAY, 50, 10, 1, 25000.00, 'confirmed', 'Advance 50%');
      `);
      console.log('🏨 Seeded default room bookings into MySQL.');
    }

    const [spaRows] = await pool.query('SELECT COUNT(*) as count FROM spa_bookings');
    if (spaRows[0].count === 0) {
      await pool.query(`
        INSERT INTO spa_bookings (id, name, phone, email, service, service_code, date, time_slot, duration, price, status) VALUES
        ('SPA-8245', 'Rohan Patel', '+91 99000 98765', 'rohan@example.com', 'Shirodhara Therapy', 'shirodhara', CURDATE(), '02:00 PM', '75 mins', 4000.00, 'confirmed'),
        ('SPA-1934', 'Anjali Desai', '+91 98765 43210', 'anjali@example.com', 'Natural Scrub', 'natural-scrub', CURDATE() + INTERVAL 1 DAY, '11:30 AM', '30 Min', 1000.00, 'pending'),
        ('SPA-3190', 'Kavita Chawla', '+91 98112 34567', 'kavita.c@gmail.com', 'Signature Therapy', 'signature', CURDATE() + INTERVAL 2 DAY, '04:30 PM', '90 Min', 6000.00, 'confirmed');
      `);
      console.log('🧘 Seeded default spa appointments into MySQL.');
    }

    const [msgRows] = await pool.query('SELECT COUNT(*) as count FROM messages');
    if (msgRows[0].count === 0) {
      await pool.query(`
        INSERT INTO messages (id, name, email, phone, subject, message, status, replied) VALUES
        ('MSG-4001', 'Vikram Singh', 'vikram.singh@gmail.com', '+91 96543 21098', 'Corporate Booking Inquiry for 15 Rooms', 'Hello Hotel Shree Daan Team, we are planning a corporate executive retreat next month on the 15th. We require 15 executive rooms and banquet hall conference access for 2 days. Kindly share special group tariff packages and catering options.', 'unread', FALSE),
        ('MSG-4002', 'Sneha Gupta', 'sneha.gupta@example.com', '+91 95432 10987', 'Golden Sparsh Spa Couple Package Inquiry', 'Hi, I would like to book a Couple Connect rejuvenation therapy and luxury bath session for this Saturday anniversary celebration. Please confirm therapist availability and slot timings.', 'read', TRUE);
      `);
      console.log('✉️ Seeded default messages into MySQL.');
    }

    console.log('✅ Database initialization complete. All tables ready in MySQL!');
    return pool;
  } catch (error) {
    console.error('❌ MySQL Connection / Initialization Error:', error.message);
    throw error;
  }
}

export function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDatabase() first.');
  }
  return pool;
}
