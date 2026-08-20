-- ============================================================================
-- HOTEL SHREE DAAN & GOLDEN SPARSH SPA — MYSQL DATABASE SCHEMA
-- Database: shreedan_hotel
-- Compatible with MySQL 8.0+ and MySQL Workbench
-- ============================================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS shreedan_hotel
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE shreedan_hotel;

-- 2. Room Bookings Table
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

-- 3. Spa Appointments Table
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

-- 4. Guest Inquiries / Messages Table
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

