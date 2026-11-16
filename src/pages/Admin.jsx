import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin.css';
import {
  fetchRoomBookings,
  createRoomBooking,
  updateRoomStatus as apiUpdateRoomStatus,
  deleteRoomBooking as apiDeleteRoomBooking,
  fetchSpaBookings,
  createSpaBooking,
  updateSpaStatus as apiUpdateSpaStatus,
  deleteSpaBooking as apiDeleteSpaBooking,
  fetchMessages,
  replyToMessage,
  updateMessageStatus as apiUpdateMessageStatus,
  deleteMessage as apiDeleteMessage,
  checkHealth
} from '../api';

export default function Admin() {
  const ROOM_KEY = 'hsd_room_bookings';
  const SPA_KEY = 'hsd_spa_bookings';
  const MSG_KEY = 'hsd_messages';

  // ==================== 1. STATE MANAGEMENT ====================
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking');

  const [roomBookings, setRoomBookings] = useState([]);
  const [spaBookings, setSpaBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilterStatus, setRoomFilterStatus] = useState('all');
  const [roomFilterCategory, setRoomFilterCategory] = useState('all');
  const [spaFilterService, setSpaFilterService] = useState('all');
  const [spaFilterStatus, setSpaFilterStatus] = useState('all');
  const [msgFilterStatus, setMsgFilterStatus] = useState('all');

  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Modals Visibility
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [addSpaOpen, setAddSpaOpen] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState(null);

  // New Room Form Fields
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPhone, setNewRoomPhone] = useState('');
  const [newRoomEmail, setNewRoomEmail] = useState('');
  const [newRoomType, setNewRoomType] = useState('Premier Suite');
  const [newRoomPrice, setNewRoomPrice] = useState(7500);
  const [newRoomCheckIn, setNewRoomCheckIn] = useState('');
  const [newRoomCheckOut, setNewRoomCheckOut] = useState('');
  const [newRoomAdults, setNewRoomAdults] = useState('2');
  const [newRoomChildren, setNewRoomChildren] = useState('0');

  // New Spa Form Fields
  const [newSpaName, setNewSpaName] = useState('');
  const [newSpaPhone, setNewSpaPhone] = useState('');
  const [newSpaEmail, setNewSpaEmail] = useState('');
  const [newSpaServiceCode, setNewSpaServiceCode] = useState('signature');
  const [newSpaDate, setNewSpaDate] = useState('');
  const [newSpaTimeSlot, setNewSpaTimeSlot] = useState('02:00 PM');

  // Live Digital Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // Toasts
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ==================== 2. SEEDING & API / STORAGE LOAD ====================
  const loadData = async () => {
    try {
      const health = await checkHealth();
      if (health.status === 'ok' && health.database === 'connected') {
        setDbStatus('connected');
      } else {
        setDbStatus('offline');
      }

      const [rooms, spas, msgs] = await Promise.all([
        fetchRoomBookings(),
        fetchSpaBookings(),
        fetchMessages()
      ]);

      setRoomBookings(rooms);
      setSpaBookings(spas);
      setMessages(msgs);
      if (msgs.length > 0 && !selectedMsgId) {
        setSelectedMsgId(msgs[0].id);
      }
    } catch (err) {
      console.warn('Data load error:', err);
      setDbStatus('offline');
    }
  };

  useEffect(() => {
    loadData();
    setNewRoomCheckIn(new Date().toISOString().split('T')[0]);
    setNewRoomCheckOut(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setNewSpaDate(new Date().toISOString().split('T')[0]);

    const handleStorageChange = (e) => {
      if (!e.key || [ROOM_KEY, SPA_KEY, MSG_KEY, 'hsd_contact_inquiries'].includes(e.key)) {
        loadData();
        triggerToast('Guest desk data synchronised.');
      }
    };
    const handleFocus = () => loadData();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // ==================== 3. COMPUTED METRICS ====================
  const activeRoomsCount = roomBookings.filter(r => r.status === 'confirmed' || r.status === 'checked-in').length;
  const activeSpaCount = spaBookings.filter(s => s.status === 'confirmed' || s.status === 'pending').length;
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;

  const totalRoomRevenue = roomBookings
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + (Number(r.total) || 0), 0);

  const totalSpaRevenue = spaBookings
    .filter(s => s.status !== 'cancelled')
    .reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  const totalRevenue = totalRoomRevenue + totalSpaRevenue;
  const avgBookingValue = (roomBookings.length + spaBookings.length) > 0 
    ? Math.round(totalRevenue / (roomBookings.length + spaBookings.length)) 
    : 0;

  // ==================== 4. CRUD OPERATIONS ====================
  const deleteRoomBooking = async (id) => {
    if (window.confirm(`Delete reservation record ${id} from registry?`)) {
      await apiDeleteRoomBooking(id);
      const updated = roomBookings.filter(b => b.id !== id);
      setRoomBookings(updated);
      triggerToast(`Room booking ${id} removed from database.`);
    }
  };

  const updateRoomStatus = async (id, status) => {
    await apiUpdateRoomStatus(id, status);
    const updated = roomBookings.map(b => b.id === id ? { ...b, status } : b);
    setRoomBookings(updated);
    triggerToast(`Room booking ${id} updated to ${status} in MySQL.`);
  };

  const deleteSpaBooking = async (id) => {
    if (window.confirm(`Delete spa appointment ${id}?`)) {
      await apiDeleteSpaBooking(id);
      const updated = spaBookings.filter(s => s.id !== id);
      setSpaBookings(updated);
      triggerToast(`Spa appointment ${id} removed from database.`);
    }
  };

  const updateSpaStatus = async (id, status) => {
    await apiUpdateSpaStatus(id, status);
    const updated = spaBookings.map(s => s.id === id ? { ...s, status } : s);
    setSpaBookings(updated);
    triggerToast(`Spa appointment ${id} updated to ${status} in MySQL.`);
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Delete this guest message inquiry?')) {
      await apiDeleteMessage(id);
      const updated = messages.filter(m => m.id !== id);
      if (selectedMsgId === id) {
        setSelectedMsgId(updated.length > 0 ? updated[0].id : null);
      }
      setMessages(updated);
      triggerToast('Guest inquiry deleted from database.');
    }
  };

  const toggleMessageReadStatus = async (id) => {
    const msg = messages.find(m => m.id === id);
    const newStatus = msg && msg.status === 'unread' ? 'read' : 'unread';
    await apiUpdateMessageStatus(id, newStatus);
    const updated = messages.map(m => m.id === id ? { ...m, status: newStatus } : m);
    setMessages(updated);
    triggerToast('Message status updated in database.');
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await replyToMessage(selectedMsgId, replyText);
    const updated = messages.map(m => m.id === selectedMsgId ? { ...m, replied: true, status: 'read', replyText } : m);
    setMessages(updated);
    setReplyText('');
    triggerToast('Official response recorded & dispatched to guest email!');
  };

  const selectMessage = async (id) => {
    setSelectedMsgId(id);
    const msg = messages.find(m => m.id === id);
    if (msg && msg.status === 'unread') {
      await apiUpdateMessageStatus(id, 'read');
      const updated = messages.map(m => m.id === id ? { ...m, status: 'read' } : m);
      setMessages(updated);
    }
  };

  const handleRoomTypeSelect = (e) => {
    const val = e.target.value;
    setNewRoomType(val);
    const prices = {
      'Premier Suite': 7500,
      'Executive Double': 5500,
      'Executive Single': 4500,
      'Standard Double': 3500,
      'Standard Single': 2500,
      'Banquet Hall': 25000
    };
    if (prices[val]) setNewRoomPrice(prices[val]);
  };

  const handleAddRoomBookingSubmit = async (e) => {
    e.preventDefault();
    const inDate = new Date(newRoomCheckIn);
    const outDate = new Date(newRoomCheckOut);
    const diffTime = Math.abs(outDate - inDate);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 1;
    const total = nights * newRoomPrice;
    const bookingId = 'SD-' + Math.floor(1000000 + Math.random() * 9000000);

    const newBooking = {
      id: bookingId,
      name: newRoomName,
      email: newRoomEmail || 'guest@shreedaangroup.com',
      phone: newRoomPhone,
      roomType: newRoomType,
      roomCode: newRoomType.toLowerCase().replace(/\s+/g, '-'),
      checkIn: newRoomCheckIn,
      checkOut: newRoomCheckOut,
      adults: parseInt(newRoomAdults, 10),
      children: parseInt(newRoomChildren, 10),
      nights,
      total,
      status: 'confirmed',
      payStatus: 'Paid',
      dateCreated: new Date().toISOString().split('T')[0]
    };

    await createRoomBooking(newBooking);
    setRoomBookings([newBooking, ...roomBookings]);
    setAddRoomOpen(false);
    setNewRoomName('');
    setNewRoomPhone('');
    setNewRoomEmail('');
    triggerToast(`Reservation ${bookingId} saved into MySQL database!`);
  };

  const handleAddSpaBookingSubmit = async (e) => {
    e.preventDefault();
    const serviceMap = {
      'signature': { name: 'Signature Therapy', price: 6000, duration: '90 mins' },
      'couple': { name: 'Couple Connect Rejuvenation', price: 6000, duration: '90 mins' },
      'deep_tissue': { name: 'Deep Tissue Massage', price: 2500, duration: '60 mins' },
      'shirodhara': { name: 'Ayurvedic Shirodhara Therapy', price: 4000, duration: '75 mins' },
      'natural-scrub': { name: 'Natural Body Scrub', price: 1000, duration: '30 mins' }
    };
    const mapped = serviceMap[newSpaServiceCode] || { name: 'Spa Session', price: 2000, duration: '60 mins' };
    const spaId = 'SPA-' + Math.floor(1000 + Math.random() * 9000);

    const newSpa = {
      id: spaId,
      name: newSpaName,
      phone: newSpaPhone,
      email: newSpaEmail || 'spa.guest@shreedaangroup.com',
      service: mapped.name,
      serviceCode: newSpaServiceCode,
      date: newSpaDate,
      timeSlot: newSpaTimeSlot,
      duration: mapped.duration,
      price: mapped.price,
      status: 'confirmed',
      dateCreated: new Date().toISOString().split('T')[0]
    };

    await createSpaBooking(newSpa);
    setSpaBookings([newSpa, ...spaBookings]);
    setAddSpaOpen(false);
    setNewSpaName('');
    setNewSpaPhone('');
    setNewSpaEmail('');
    triggerToast(`Spa slot ${spaId} saved into MySQL database!`);
  };

  // Print Invoice
  const printInvoice = () => {
    if (!invoiceBooking) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${invoiceBooking.id} — Hotel Shree Daan</title>
        <style>
          body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #1E080E; margin: 0; background: #fff; }
          .invoice-box { max-width: 680px; margin: 0 auto; border: 1px solid #e5e5e5; padding: 35px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .invoice-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #580d1f; padding-bottom: 18px; margin-bottom: 24px; }
          .brand-title { font-size: 24px; font-weight: 800; color: #580d1f; margin: 0; }
          .brand-sub { font-size: 12px; color: #666; margin-top: 4px; }
          .invoice-title { font-size: 18px; font-weight: 700; color: #c9a227; text-align: right; text-transform: uppercase; letter-spacing: 1px; }
          .invoice-id { font-size: 13px; color: #333; margin-top: 4px; text-align: right; }
          .section-title { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #580d1f; font-weight: 700; margin: 20px 0 10px; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee; font-size: 14px; }
          .row span { color: #666; }
          .row strong { color: #1e080e; }
          .total-row { display: flex; justify-content: space-between; font-size: 20px; font-weight: 800; margin-top: 20px; padding-top: 16px; border-top: 2px solid #580d1f; color: #580d1f; }
          .footer-note { text-align: center; font-size: 11px; color: #888; margin-top: 30px; border-top: 1px solid #f0f0f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="invoice-header">
            <div>
              <h1 class="brand-title">Hotel Shree Daan</h1>
              <div class="brand-sub">Luxury Hotel &amp; Golden Sparsh Spa<br>Valsad Road, Balitha, Vapi - 396 191, Gujarat</div>
            </div>
            <div>
              <div class="invoice-title">Official Guest Invoice</div>
              <div class="invoice-id">Folio ID: <strong>${invoiceBooking.id}</strong></div>
              <div class="invoice-id">Date: <strong>${invoiceBooking.dateCreated || new Date().toISOString().split('T')[0]}</strong></div>
            </div>
          </div>

          <div class="section-title">Guest &amp; Stay Information</div>
          <div class="row"><span>Primary Guest</span><strong>${invoiceBooking.name}</strong></div>
          <div class="row"><span>Contact Phone</span><strong>${invoiceBooking.phone || 'N/A'}</strong></div>
          <div class="row"><span>Email Address</span><strong>${invoiceBooking.email || 'N/A'}</strong></div>
          <div class="row"><span>Room Category</span><strong>${invoiceBooking.roomType}</strong></div>
          <div class="row"><span>Check-In Date</span><strong>${invoiceBooking.checkIn} (12:00 PM)</strong></div>
          <div class="row"><span>Check-Out Date</span><strong>${invoiceBooking.checkOut} (11:00 AM)</strong></div>
          <div class="row"><span>Length of Stay</span><strong>${invoiceBooking.nights || 1} Night(s)</strong></div>
          <div class="row"><span>Occupancy</span><strong>${invoiceBooking.adults || 1} Adult(s), ${invoiceBooking.children || 0} Child(ren)</strong></div>
          <div class="row"><span>Settlement Status</span><strong style="color:#15803d;">${invoiceBooking.payStatus || 'Paid in Full'}</strong></div>

          <div class="total-row">
            <span>Total Tariff Payable</span>
            <span>₹${(invoiceBooking.total || 0).toLocaleString('en-IN')}</span>
          </div>

          <div class="footer-note">
            Thank you for choosing Hotel Shree Daan. We wish you an exceptional and memorable stay.<br>
            For desk assistance or concierge inquiries, contact frontdesk@hotelshreedaan.com
          </div>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 350);
  };

  // CSV Exporters
  const exportCSV = (filename, dataList, headers) => {
    if (!dataList.length) {
      alert('No database records available to export.');
      return;
    }
    const csvContent = [
      headers.join(','),
      ...dataList.map(row => headers.map(h => `"${(row[h] !== undefined ? row[h] : '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`File ${filename} downloaded.`);
  };

  // JSON Backup / Restore
  const exportFullBackupJSON = () => {
    const backup = {
      rooms: roomBookings,
      spas: spaBookings,
      messages: messages,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Hotel_Shree_Daan_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Full system JSON backup downloaded.');
  };

  const resetAllData = () => {
    if (window.confirm('⚠️ WARNING: This will permanently wipe all local bookings and contact messages from LocalStorage. Are you sure you want to proceed?')) {
      saveRooms([]);
      saveSpa([]);
      saveMessagesState([]);
      setSelectedMsgId(null);
      triggerToast('All local storage records have been cleared.');
    }
  };

  // ==================== 5. FILTER LOGIC ====================
  const getFilteredRooms = () => {
    return roomBookings.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        r.name?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.roomType?.toLowerCase().includes(q);
      const matchStatus = roomFilterStatus === 'all' || r.status === roomFilterStatus;
      const matchCategory = roomFilterCategory === 'all' || r.roomType === roomFilterCategory;
      return matchSearch && matchStatus && matchCategory;
    });
  };

  const getFilteredSpas = () => {
    return spaBookings.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        s.name?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q) ||
        s.service?.toLowerCase().includes(q);
      const matchStatus = spaFilterStatus === 'all' || s.status === spaFilterStatus;
      const matchService = spaFilterService === 'all' || s.serviceCode === spaFilterService;
      return matchSearch && matchStatus && matchService;
    });
  };

  const getFilteredMessages = () => {
    return messages.filter(m => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        m.name?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q);
      const matchStatus = msgFilterStatus === 'all' || m.status === msgFilterStatus;
      return matchSearch && matchStatus;
    });
  };

  const quickReplyTemplates = [
    { title: 'Room Booking Confirmed', text: 'Dear Guest, Greetings from Hotel Shree Daan. We are delighted to confirm your room reservation. We look forward to hosting you in luxury!' },
    { title: 'Spa Slot Confirmed', text: 'Dear Guest, Your holistic wellness session at Golden Sparsh Spa is confirmed. Please arrive 10 minutes prior for tea & consultation.' },
    { title: 'Banquet Hall Details', text: 'Greetings, our banquet hall accommodates up to 250 guests with full luxury audio-visual setups and catering. We have sent tariff packages to your email.' }
  ];

  return (
    <div className="admin-body">
      <div className="admin-layout-container">
        
        {/* ==================== 1. SIDEBAR ==================== */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          
          {/* Logo & Brand Header */}
          <div className="admin-sidebar-brand">
            <Link to="/" className="admin-brand-link" title="Hotel Shree Daan - Visit Live Site">
              <img 
                src="/assets/images/hsd-logo.png" 
                alt="Hotel Shree Daan Logo" 
                className="admin-sidebar-logo-img" 
                onError={(e) => { e.target.src = '/assets/images/logo-sticky.png'; }}
              />
            </Link>
            <div className="admin-console-pill">
              <span className="admin-live-pulse"></span>
              <span className="admin-console-pill-text">MANAGEMENT CONSOLE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="admin-sidebar-nav">
            <div className="admin-nav-group-title">Core Operations</div>
            
            <button 
              className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            >
              <span className="admin-nav-icon">📊</span>
              <span>Dashboard Overview</span>
            </button>

            <button 
              className={`admin-nav-btn ${activeTab === 'rooms' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('rooms'); setMobileMenuOpen(false); }}
            >
              <span className="admin-nav-icon">🏨</span>
              <span>Room Bookings</span>
              <span className="admin-nav-badge">{activeRoomsCount}</span>
            </button>

            <button 
              className={`admin-nav-btn ${activeTab === 'spa' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('spa'); setMobileMenuOpen(false); }}
            >
              <span className="admin-nav-icon">🧘</span>
              <span>Golden Sparsh Spa</span>
              <span className="admin-nav-badge">{activeSpaCount}</span>
            </button>

            <div className="admin-nav-group-title">Guest Relations</div>
            
            <button 
              className={`admin-nav-btn ${activeTab === 'messages' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('messages'); setMobileMenuOpen(false); }}
            >
              <span className="admin-nav-icon">✉️</span>
              <span>Inquiries &amp; Inbox</span>
              {unreadMessagesCount > 0 ? (
                <span className="admin-nav-badge">{unreadMessagesCount}</span>
              ) : (
                <span className="admin-nav-badge admin-nav-badge-neutral">0</span>
              )}
            </button>

            <div className="admin-nav-group-title">Business &amp; Controls</div>

            <button 
              className={`admin-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
            >
              <span className="admin-nav-icon">📈</span>
              <span>Revenue &amp; Analytics</span>
            </button>

            <button 
              className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
            >
              <span className="admin-nav-icon">⚙️</span>
              <span>System &amp; Data</span>
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className="admin-sidebar-footer">
            <div className="admin-profile-card">
              <div className="admin-profile-avatar">SD</div>
              <div className="admin-profile-details">
                <h4>Admin Concierge</h4>
                <p>General Manager • Live</p>
              </div>
            </div>
            
            <Link to="/" className="admin-view-site-link">
              <span>🌐</span> Visit Live Guest Site
            </Link>
          </div>
        </aside>

        {/* ==================== 2. MAIN VIEWPORT ==================== */}
        <div className="admin-main-container">
          
          {/* Topbar Header */}
          <header className="admin-topbar-header">
            <div className="admin-topbar-left">
              <button 
                className="admin-mobile-toggle" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                ☰
              </button>
              <div className="admin-title-wrap">
                <h1>
                  {activeTab === 'dashboard' && 'Operations Dashboard'}
                  {activeTab === 'rooms' && 'Room Booking Register'}
                  {activeTab === 'spa' && 'Golden Sparsh Spa Appointments'}
                  {activeTab === 'messages' && 'Guest Inquiries & Concierge Desk'}
                  {activeTab === 'analytics' && 'Financial & Revenue Intelligence'}
                  {activeTab === 'settings' && 'System Settings & Data Control'}
                </h1>
                <p>Hotel Shree Daan • Vapi, Gujarat | Management Portal</p>
              </div>
            </div>

            <div className="admin-topbar-right">
              {/* Database Status Chip */}
              <div 
                className="admin-clock-chip" 
                style={{ 
                  background: dbStatus === 'connected' ? 'rgba(21, 128, 61, 0.1)' : 'rgba(180, 83, 9, 0.1)',
                  borderColor: dbStatus === 'connected' ? '#bbf7d0' : '#fde68a',
                  color: dbStatus === 'connected' ? '#15803d' : '#b45309'
                }}
                title={dbStatus === 'connected' ? 'Connected to MySQL: shreedan_hotel (Port 3306)' : 'Operating in offline localStorage fallback mode'}
              >
                <span style={{ fontSize: '0.7rem' }}>{dbStatus === 'connected' ? '🟢' : '🟠'}</span>
                <span style={{ fontWeight: '700', fontSize: '0.78rem' }}>
                  {dbStatus === 'connected' ? 'MySQL: shreedan_hotel' : 'Local Cache'}
                </span>
              </div>

              {/* Live Digital Clock */}
              <div className="admin-clock-chip" title="Current Local IST Time">
                <span>🕒</span>
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>

              {/* Global Search */}
              <div className="admin-search-box">
                <span className="admin-search-icon">🔍</span>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  placeholder="Search guest or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quick Action Buttons */}
              <button 
                className="admin-topbar-btn admin-topbar-btn-maroon" 
                onClick={() => setAddRoomOpen(true)}
                title="Create Room Booking"
              >
                <span>➕</span> Room
              </button>
              <button 
                className="admin-topbar-btn admin-topbar-btn-gold" 
                onClick={() => setAddSpaOpen(true)}
                title="Create Spa Booking"
              >
                <span>🧘</span> Spa
              </button>
            </div>
          </header>

          {/* Content Area */}
          <main className="admin-content-viewport">
            
            {/* ==================== TAB 1: DASHBOARD ==================== */}
            {activeTab === 'dashboard' && (
              <>
                {/* Hero Welcome Banner */}
                <div className="admin-hero-banner">
                  <div className="admin-hero-text">
                    <h2>Welcome to <span>Hotel Shree Daan</span> Desk</h2>
                    <p>Live overview of room reservations, spa wellness therapies, and guest communications.</p>
                  </div>
                  <div className="admin-hero-actions">
                    <button className="btn-luxury btn-luxury-gold" onClick={() => setAddRoomOpen(true)}>
                      ➕ Quick Room Register
                    </button>
                    <button className="btn-luxury btn-luxury-secondary" onClick={() => setAddSpaOpen(true)}>
                      🧘 Book Spa Therapy
                    </button>
                  </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="admin-stats-grid">
                  <div className="admin-stat-card card-gold">
                    <div className="admin-stat-info">
                      <span className="stat-label">Gross Revenue</span>
                      <h3>₹{totalRevenue.toLocaleString('en-IN')}</h3>
                      <p className="stat-subtitle">Rooms + Golden Sparsh Spa</p>
                    </div>
                    <div className="admin-stat-icon-wrap">💰</div>
                  </div>

                  <div className="admin-stat-card card-rooms">
                    <div className="admin-stat-info">
                      <span className="stat-label">Active Rooms</span>
                      <h3>{roomBookings.length}</h3>
                      <p className="stat-subtitle">{activeRoomsCount} currently active/confirmed</p>
                    </div>
                    <div className="admin-stat-icon-wrap">🏨</div>
                  </div>

                  <div className="admin-stat-card card-spa">
                    <div className="admin-stat-info">
                      <span className="stat-label">Spa Appointments</span>
                      <h3>{spaBookings.length}</h3>
                      <p className="stat-subtitle">{activeSpaCount} active treatment slots</p>
                    </div>
                    <div className="admin-stat-icon-wrap">🧘</div>
                  </div>

                  <div className="admin-stat-card card-msg">
                    <div className="admin-stat-info">
                      <span className="stat-label">Guest Inquiries</span>
                      <h3>{unreadMessagesCount}</h3>
                      <p className="stat-subtitle">{messages.length} total messages logged</p>
                    </div>
                    <div className="admin-stat-icon-wrap">✉️</div>
                  </div>
                </div>

                {/* Split Table Grid */}
                <div className="admin-split-grid">
                  {/* Recent Rooms */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h3 className="admin-card-title">🏨 Recent Room Bookings</h3>
                      <button className="btn-luxury btn-luxury-secondary btn-luxury-sm" onClick={() => setActiveTab('rooms')}>
                        View All ({roomBookings.length})
                      </button>
                    </div>
                    <div className="admin-table-responsive">
                      <table className="luxury-table">
                        <thead>
                          <tr>
                            <th>Guest</th>
                            <th>Category</th>
                            <th>Stay Period</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomBookings.slice(0, 5).map(r => (
                            <tr key={r.id}>
                              <td>
                                <span className="guest-cell-title">{r.name}</span>
                                <span className="id-badge">{r.id}</span>
                              </td>
                              <td><strong>{r.roomType}</strong></td>
                              <td>{r.checkIn} <span style={{ color: '#999' }}>→</span> {r.checkOut}</td>
                              <td><strong style={{ color: 'var(--admin-maroon-main)' }}>₹{(r.total || 0).toLocaleString('en-IN')}</strong></td>
                              <td>
                                <span className={`status-pill status-${r.status}`}>{r.status}</span>
                              </td>
                              <td>
                                <div className="action-btns-wrap">
                                  <button className="btn-table-icon" title="View & Print Invoice" onClick={() => setInvoiceBooking(r)}>📄</button>
                                  <button className="btn-table-icon icon-danger" title="Delete" onClick={() => deleteRoomBooking(r.id)}>🗑️</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {roomBookings.length === 0 && (
                            <tr>
                              <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>No room bookings recorded.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Spa */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h3 className="admin-card-title">🧘 Recent Spa Sessions</h3>
                      <button className="btn-luxury btn-luxury-secondary btn-luxury-sm" onClick={() => setActiveTab('spa')}>
                        View All ({spaBookings.length})
                      </button>
                    </div>
                    <div className="admin-table-responsive">
                      <table className="luxury-table">
                        <thead>
                          <tr>
                            <th>Guest</th>
                            <th>Therapy</th>
                            <th>Date / Slot</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {spaBookings.slice(0, 5).map(s => (
                            <tr key={s.id}>
                              <td>
                                <span className="guest-cell-title">{s.name}</span>
                                <span className="id-badge">{s.id}</span>
                              </td>
                              <td><strong>{s.service}</strong></td>
                              <td>
                                <div>{s.date}</div>
                                <span style={{ fontSize: '0.74rem', color: 'var(--admin-gold)', fontWeight: '700' }}>⏰ {s.timeSlot}</span>
                              </td>
                              <td>
                                <span className={`status-pill status-${s.status}`}>{s.status}</span>
                              </td>
                            </tr>
                          ))}
                          {spaBookings.length === 0 && (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>No spa bookings recorded.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ==================== TAB 2: ROOMS ==================== */}
            {activeTab === 'rooms' && (
              <div className="admin-card">
                <div className="admin-filter-toolbar">
                  <div className="admin-filter-group">
                    <span className="admin-filter-label">Filter:</span>
                    
                    <select 
                      className="admin-select-input" 
                      value={roomFilterStatus} 
                      onChange={(e) => setRoomFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked-In</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <select 
                      className="admin-select-input" 
                      value={roomFilterCategory} 
                      onChange={(e) => setRoomFilterCategory(e.target.value)}
                    >
                      <option value="all">All Room Categories</option>
                      <option value="Premier Suite">Premier Suite</option>
                      <option value="Executive Double">Executive Double</option>
                      <option value="Executive Single">Executive Single</option>
                      <option value="Standard Double">Standard Double</option>
                      <option value="Standard Single">Standard Single</option>
                      <option value="Banquet Hall">Banquet Hall</option>
                    </select>
                  </div>

                  <div className="admin-toolbar-actions">
                    <button className="btn-luxury btn-luxury-primary" onClick={() => setAddRoomOpen(true)}>
                      ➕ New Room Booking
                    </button>
                    <button 
                      className="btn-luxury btn-luxury-secondary" 
                      onClick={() => exportCSV('Hotel_Shree_Daan_Room_Bookings.csv', roomBookings, ['id', 'name', 'phone', 'email', 'roomType', 'checkIn', 'checkOut', 'nights', 'adults', 'children', 'total', 'status', 'payStatus'])}
                    >
                      📥 Export CSV Log
                    </button>
                  </div>
                </div>

                <div className="admin-table-responsive">
                  <table className="luxury-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Guest Details</th>
                        <th>Accommodation</th>
                        <th>Dates &amp; Duration</th>
                        <th>Occupancy</th>
                        <th>Total Tariff</th>
                        <th>Status Control</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredRooms().map(r => (
                        <tr key={r.id}>
                          <td>
                            <span className="id-badge">{r.id}</span>
                          </td>
                          <td>
                            <span className="guest-cell-title">{r.name}</span>
                            <span className="guest-cell-sub">📞 {r.phone || 'N/A'}</span>
                            <span className="guest-cell-sub">✉️ {r.email || 'N/A'}</span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--admin-maroon-darkest)' }}>{r.roomType}</strong>
                          </td>
                          <td>
                            <div>{r.checkIn} <span style={{ color: '#999' }}>→</span> {r.checkOut}</div>
                            <span style={{ fontSize: '0.74rem', color: 'var(--admin-gold)', fontWeight: '700' }}>{r.nights || 1} Night(s)</span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.82rem' }}>{r.adults || 1} Adults, {r.children || 0} Kids</span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--admin-maroon-main)', fontSize: '0.96rem' }}>
                              ₹{(r.total || 0).toLocaleString('en-IN')}
                            </strong>
                          </td>
                          <td>
                            <select
                              value={r.status}
                              onChange={(e) => updateRoomStatus(r.id, e.target.value)}
                              className="admin-select-input"
                              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="checked-in">Checked-In</option>
                              <option value="pending">Pending</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div className="action-btns-wrap">
                              <button className="btn-table-icon" title="Print Invoice" onClick={() => setInvoiceBooking(r)}>📄</button>
                              <button className="btn-table-icon icon-danger" title="Delete Booking" onClick={() => deleteRoomBooking(r.id)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {getFilteredRooms().length === 0 && (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            No room reservations matching the selected filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== TAB 3: SPA ==================== */}
            {activeTab === 'spa' && (
              <div className="admin-card">
                <div className="admin-filter-toolbar">
                  <div className="admin-filter-group">
                    <span className="admin-filter-label">Filter:</span>
                    
                    <select 
                      className="admin-select-input" 
                      value={spaFilterStatus} 
                      onChange={(e) => setSpaFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <select 
                      className="admin-select-input" 
                      value={spaFilterService} 
                      onChange={(e) => setSpaFilterService(e.target.value)}
                    >
                      <option value="all">All Therapies</option>
                      <option value="signature">Signature Therapy</option>
                      <option value="couple">Couple Connect</option>
                      <option value="deep_tissue">Deep Tissue Massage</option>
                      <option value="shirodhara">Ayurvedic Shirodhara</option>
                      <option value="natural-scrub">Natural Scrub</option>
                    </select>
                  </div>

                  <div className="admin-toolbar-actions">
                    <button className="btn-luxury btn-luxury-gold" onClick={() => setAddSpaOpen(true)}>
                      🧘 Add Spa Appointment
                    </button>
                    <button 
                      className="btn-luxury btn-luxury-secondary" 
                      onClick={() => exportCSV('Golden_Sparsh_Spa_Appointments.csv', spaBookings, ['id', 'name', 'phone', 'email', 'service', 'date', 'timeSlot', 'duration', 'price', 'status'])}
                    >
                      📥 Export Spa Log
                    </button>
                  </div>
                </div>

                <div className="admin-table-responsive">
                  <table className="luxury-table">
                    <thead>
                      <tr>
                        <th>Appointment ID</th>
                        <th>Guest Details</th>
                        <th>Therapy Service</th>
                        <th>Date &amp; Slot</th>
                        <th>Duration</th>
                        <th>Price Tariff</th>
                        <th>Status Control</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredSpas().map(s => (
                        <tr key={s.id}>
                          <td>
                            <span className="id-badge">{s.id}</span>
                          </td>
                          <td>
                            <span className="guest-cell-title">{s.name}</span>
                            <span className="guest-cell-sub">📞 {s.phone || 'N/A'}</span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--admin-maroon-darkest)' }}>{s.service}</strong>
                          </td>
                          <td>
                            <div>{s.date}</div>
                            <span style={{ fontSize: '0.74rem', color: 'var(--admin-gold)', fontWeight: '700' }}>⏰ {s.timeSlot}</span>
                          </td>
                          <td>{s.duration || '60 mins'}</td>
                          <td>
                            <strong style={{ color: 'var(--admin-maroon-main)', fontSize: '0.96rem' }}>
                              ₹{(s.price || 0).toLocaleString('en-IN')}
                            </strong>
                          </td>
                          <td>
                            <select
                              value={s.status}
                              onChange={(e) => updateSpaStatus(s.id, e.target.value)}
                              className="admin-select-input"
                              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="pending">Pending</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button className="btn-table-icon icon-danger" title="Delete Spa Record" onClick={() => deleteSpaBooking(s.id)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                      {getFilteredSpas().length === 0 && (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            No spa reservations matching the selected filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== TAB 4: MESSAGES ==================== */}
            {activeTab === 'messages' && (
              <div className="admin-inbox-shell">
                
                {/* Left: Message List */}
                <div className="admin-inbox-list">
                  <div className="inbox-list-toolbar">
                    <select 
                      className="admin-select-input" 
                      style={{ width: '100%' }}
                      value={msgFilterStatus} 
                      onChange={(e) => setMsgFilterStatus(e.target.value)}
                    >
                      <option value="all">All Inquiries ({messages.length})</option>
                      <option value="unread">Unread Only ({unreadMessagesCount})</option>
                      <option value="read">Read Only</option>
                    </select>
                  </div>

                  <div className="inbox-scroll-items">
                    {getFilteredMessages().map(m => (
                      <div
                        key={m.id}
                        className={`inbox-card-item ${m.status === 'unread' ? 'unread' : ''} ${selectedMsgId === m.id ? 'active' : ''}`}
                        onClick={() => selectMessage(m.id)}
                      >
                        <div className="inbox-card-head">
                          <span className="inbox-card-sender">{m.name}</span>
                          <span className="inbox-card-date">{m.date || 'Today'}</span>
                        </div>
                        <div className="inbox-card-subject">{m.subject}</div>
                        <div className="inbox-card-preview">{m.message}</div>
                      </div>
                    ))}
                    {getFilteredMessages().length === 0 && (
                      <p style={{ textAlign: 'center', padding: '40px 20px', color: '#999', fontSize: '0.85rem' }}>
                        No guest inquiries found.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Message Reader & Composer */}
                <div className="admin-inbox-view">
                  {(() => {
                    const msg = messages.find(m => m.id === selectedMsgId);
                    if (!msg) {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#aaa', padding: '40px' }}>
                          <span style={{ fontSize: '3rem' }}>✉️</span>
                          <h3 style={{ fontFamily: 'var(--admin-font-title)', color: 'var(--admin-maroon-darkest)', marginTop: '10px' }}>Select an inquiry to view</h3>
                          <p style={{ fontSize: '0.85rem' }}>Choose an email or inquiry from the left panel to review and reply.</p>
                        </div>
                      );
                    }
                    return (
                      <>
                        <div className="inbox-view-header">
                          <h3 className="inbox-view-title">{msg.subject}</h3>
                          <div className="inbox-view-meta">
                            <div>
                              <strong style={{ color: 'var(--admin-maroon-darkest)' }}>{msg.name}</strong>
                              <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#666' }}>
                                📧 {msg.email} &bull; 📞 {msg.phone || 'N/A'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn-luxury btn-luxury-secondary btn-luxury-sm" onClick={() => toggleMessageReadStatus(msg.id)}>
                                {msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                              </button>
                              <button className="btn-table-icon icon-danger" title="Delete Inquiry" onClick={() => deleteMessage(msg.id)}>
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="inbox-view-body">
                          {msg.message}
                        </div>

                        {/* Quick Responses Bar */}
                        <div style={{ padding: '10px 24px', background: '#fff', borderTop: '1px solid var(--admin-border)', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>⚡ Quick Templates:</span>
                          {quickReplyTemplates.map((t, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setReplyText(t.text)}
                              style={{ background: 'var(--admin-bg-subtle)', border: '1px solid var(--admin-border)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', cursor: 'pointer', color: 'var(--admin-maroon-main)', fontWeight: '600' }}
                            >
                              {t.title}
                            </button>
                          ))}
                        </div>

                        {/* Reply Box */}
                        <form onSubmit={handleSendReply} className="inbox-view-reply-box">
                          <label style={{ fontWeight: '700', fontSize: '0.78rem', color: 'var(--admin-maroon-darkest)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Respond via Official Desk Email:
                          </label>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows="3"
                            placeholder={`Compose official response to ${msg.name}...`}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)', marginBottom: '10px', fontSize: '0.88rem', fontFamily: 'var(--admin-font-body)', outline: 'none' }}
                            required
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-luxury btn-luxury-primary">
                              ✉️ Dispatch Reply Email
                            </button>
                          </div>
                        </form>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ==================== TAB 5: REVENUE & ANALYTICS ==================== */}
            {activeTab === 'analytics' && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">📈 Financial Intelligence &amp; Revenue Breakdown</h3>
                  <button className="btn-luxury btn-luxury-secondary btn-luxury-sm" onClick={exportFullBackupJSON}>
                    📥 Export Financial Ledger
                  </button>
                </div>
                
                <div className="admin-card-body">
                  <div className="analytics-metric-grid">
                    <div className="analytics-banner-card analytics-banner-rooms">
                      <span style={{ textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '1px', color: '#9d7c66', fontWeight: '700' }}>
                        Accommodation Revenue
                      </span>
                      <h2 style={{ fontSize: '2.4rem', margin: '8px 0', color: 'var(--admin-maroon-darkest)', fontFamily: 'var(--admin-font-title)' }}>
                        ₹{totalRoomRevenue.toLocaleString('en-IN')}
                      </h2>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                        Across {roomBookings.length} room reservation bookings
                      </p>
                    </div>

                    <div className="analytics-banner-card analytics-banner-spa">
                      <span style={{ textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '1px', color: '#3b7a42', fontWeight: '700' }}>
                        Golden Sparsh Spa Revenue
                      </span>
                      <h2 style={{ fontSize: '2.4rem', margin: '8px 0', color: '#15803d', fontFamily: 'var(--admin-font-title)' }}>
                        ₹{totalSpaRevenue.toLocaleString('en-IN')}
                      </h2>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                        Across {spaBookings.length} wellness treatment sessions
                      </p>
                    </div>

                    <div className="analytics-banner-card" style={{ background: '#faf8f5' }}>
                      <span style={{ textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '1px', color: 'var(--admin-gold)', fontWeight: '700' }}>
                        Average Booking Ticket (ADR)
                      </span>
                      <h2 style={{ fontSize: '2.4rem', margin: '8px 0', color: 'var(--admin-gold)', fontFamily: 'var(--admin-font-title)' }}>
                        ₹{avgBookingValue.toLocaleString('en-IN')}
                      </h2>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                        Average guest expenditure per booking
                      </p>
                    </div>
                  </div>

                  {/* Revenue Distribution Bar */}
                  <div className="analytics-ratio-bar-wrap">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-maroon-darkest)' }}>
                        📊 Departmental Revenue Distribution
                      </h4>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--admin-maroon-main)' }}>
                        Total: ₹{totalRevenue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="analytics-ratio-bar">
                      <div 
                        className="ratio-fill-rooms" 
                        style={{ width: `${totalRevenue > 0 ? (totalRoomRevenue / totalRevenue) * 100 : 70}%` }}
                      >
                        Rooms ({totalRevenue > 0 ? Math.round((totalRoomRevenue / totalRevenue) * 100) : 70}%)
                      </div>
                      <div 
                        className="ratio-fill-spa" 
                        style={{ width: `${totalRevenue > 0 ? (totalSpaRevenue / totalRevenue) * 100 : 30}%` }}
                      >
                        Spa ({totalRevenue > 0 ? Math.round((totalSpaRevenue / totalRevenue) * 100) : 30}%)
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#777' }}>
                      <span>🏨 Rooms Contribution: ₹{totalRoomRevenue.toLocaleString('en-IN')}</span>
                      <span>🧘 Spa Contribution: ₹{totalSpaRevenue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 6: SETTINGS ==================== */}
            {activeTab === 'settings' && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">⚙️ Hotel Shree Daan System &amp; Data Hub</h3>
                </div>
                <div className="admin-card-body">
                  
                  {/* Property Info */}
                  <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--admin-border)', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 10px', color: 'var(--admin-maroon-darkest)' }}>🏨 Hotel Property Profile</h4>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 14px' }}>
                      Operational configuration for Hotel Shree Daan &amp; Golden Sparsh Spa.
                    </p>
                    <div className="form-grid-2">
                      <div className="form-group-field">
                        <label>Property Name</label>
                        <input type="text" className="form-input-control" value="Hotel Shree Daan — Luxury Accommodations & Spa" readOnly />
                      </div>
                      <div className="form-group-field">
                        <label>Location &amp; Address</label>
                        <input type="text" className="form-input-control" value="Valsad Road, Balitha, Vapi - 396 191, Gujarat" readOnly />
                      </div>
                    </div>
                  </div>

                  {/* Data Backups */}
                  <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--admin-border)', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 6px', color: 'var(--admin-maroon-darkest)' }}>💾 Database Backup &amp; Synchronization</h4>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 14px' }}>
                      Export complete snapshot of all bookings, spa logs, and guest inquiries.
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-luxury btn-luxury-gold" onClick={exportFullBackupJSON}>
                        📥 Download Full JSON Backup
                      </button>
                      <button className="btn-luxury btn-luxury-secondary" onClick={() => { loadData(); triggerToast('Database re-synchronized with MySQL.'); }}>
                        🔄 Refresh / Sync Database
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div>
                    <h4 style={{ margin: '0 0 6px', color: 'var(--admin-danger)' }}>🚨 Reset System Database</h4>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 14px' }}>
                      Permanently wipes all booking registers and messages from LocalStorage cache.
                    </p>
                    <button className="btn-luxury btn-luxury-danger" onClick={resetAllData}>
                      🗑️ Wipe All Database Registers
                    </button>
                  </div>

                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ==================== MODAL: ADD ROOM BOOKING ==================== */}
      {addRoomOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>🏨 New Room Reservation</h3>
              <button className="admin-modal-close" onClick={() => setAddRoomOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddRoomBookingSubmit}>
              <div className="admin-modal-body">
                <div className="form-grid-2">
                  <div className="form-group-field">
                    <label>Guest Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input-control" 
                      value={newRoomName} 
                      onChange={(e) => setNewRoomName(e.target.value)} 
                      required 
                      placeholder="e.g. Rajesh Kumar" 
                    />
                  </div>
                  <div className="form-group-field">
                    <label>Contact Phone *</label>
                    <input 
                      type="tel" 
                      className="form-input-control" 
                      value={newRoomPhone} 
                      onChange={(e) => setNewRoomPhone(e.target.value)} 
                      required 
                      placeholder="+91 98000 00000" 
                    />
                  </div>
                </div>

                <div className="form-group-field">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-input-control" 
                    value={newRoomEmail} 
                    onChange={(e) => setNewRoomEmail(e.target.value)} 
                    placeholder="guest@example.com" 
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group-field">
                    <label>Room Category *</label>
                    <select className="form-input-control" value={newRoomType} onChange={handleRoomTypeSelect}>
                      <option value="Premier Suite">Premier Suite — ₹7,500 / night</option>
                      <option value="Executive Double">Executive Double — ₹5,500 / night</option>
                      <option value="Executive Single">Executive Single — ₹4,500 / night</option>
                      <option value="Standard Double">Standard Double — ₹3,500 / night</option>
                      <option value="Standard Single">Standard Single — ₹2,500 / night</option>
                      <option value="Banquet Hall">Banquet Hall — ₹25,000 / night</option>
                    </select>
                  </div>
                  <div className="form-group-field">
                    <label>Rate Per Night (₹)</label>
                    <input 
                      type="number" 
                      className="form-input-control" 
                      value={newRoomPrice} 
                      onChange={(e) => setNewRoomPrice(Number(e.target.value))} 
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group-field">
                    <label>Check-In Date *</label>
                    <input 
                      type="date" 
                      className="form-input-control" 
                      value={newRoomCheckIn} 
                      onChange={(e) => setNewRoomCheckIn(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group-field">
                    <label>Check-Out Date *</label>
                    <input 
                      type="date" 
                      className="form-input-control" 
                      value={newRoomCheckOut} 
                      onChange={(e) => setNewRoomCheckOut(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group-field">
                    <label>Adults Count (Max 3)</label>
                    <select className="form-input-control" value={newRoomAdults} onChange={(e) => setNewRoomAdults(e.target.value)}>
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults (Max Capacity)</option>
                    </select>
                    <small style={{ color: '#777', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                      Max 3 persons per room. Up to 10 yrs free; above 10 yrs ₹450/night extra.
                    </small>
                  </div>
                  <div className="form-group-field">
                    <label>Children Count</label>
                    <select className="form-input-control" value={newRoomChildren} onChange={(e) => setNewRoomChildren(e.target.value)}>
                      <option value="0">0 Children</option>
                      {parseInt(newRoomAdults, 10) < 3 && <option value="1">1 Child</option>}
                      {parseInt(newRoomAdults, 10) === 1 && <option value="2">2 Children</option>}
                    </select>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-luxury btn-luxury-secondary" onClick={() => setAddRoomOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-luxury btn-luxury-primary">
                  Confirm &amp; Register Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD SPA BOOKING ==================== */}
      {addSpaOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header" style={{ background: 'linear-gradient(135deg, #1e030b 0%, #3d0716 100%)' }}>
              <h3>🧘 Book Golden Sparsh Spa Session</h3>
              <button className="admin-modal-close" onClick={() => setAddSpaOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSpaBookingSubmit}>
              <div className="admin-modal-body">
                <div className="form-grid-2">
                  <div className="form-group-field">
                    <label>Guest Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input-control" 
                      value={newSpaName} 
                      onChange={(e) => setNewSpaName(e.target.value)} 
                      required 
                      placeholder="Guest Name" 
                    />
                  </div>
                  <div className="form-group-field">
                    <label>Contact Phone *</label>
                    <input 
                      type="tel" 
                      className="form-input-control" 
                      value={newSpaPhone} 
                      onChange={(e) => setNewSpaPhone(e.target.value)} 
                      required 
                      placeholder="+91 98000 00000" 
                    />
                  </div>
                </div>

                <div className="form-group-field">
                  <label>Therapy Treatment *</label>
                  <select 
                    className="form-input-control" 
                    value={newSpaServiceCode} 
                    onChange={(e) => setNewSpaServiceCode(e.target.value)} 
                    required
                  >
                    <option value="signature">Signature Therapy — ₹6,000 (90 mins)</option>
                    <option value="couple">Couple Connect Rejuvenation — ₹6,000 (90 mins)</option>
                    <option value="deep_tissue">Deep Tissue Massage — ₹2,500 (60 mins)</option>
                    <option value="shirodhara">Ayurvedic Shirodhara — ₹4,000 (75 mins)</option>
                    <option value="natural-scrub">Natural Body Scrub — ₹1,000 (30 mins)</option>
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="form-group-field">
                    <label>Date *</label>
                    <input 
                      type="date" 
                      className="form-input-control" 
                      value={newSpaDate} 
                      onChange={(e) => setNewSpaDate(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group-field">
                    <label>Preferred Time Slot *</label>
                    <select 
                      className="form-input-control" 
                      value={newSpaTimeSlot} 
                      onChange={(e) => setNewSpaTimeSlot(e.target.value)}
                    >
                      <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:30 PM">06:30 PM (Evening Rejuvenation)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-luxury btn-luxury-secondary" onClick={() => setAddSpaOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-luxury btn-luxury-gold">
                  Reserve Spa Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: VIEW & PRINT INVOICE ==================== */}
      {invoiceBooking && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card" style={{ maxWidth: '650px' }}>
            <div className="admin-modal-header">
              <h3>📄 Guest Invoice &amp; Folio</h3>
              <button className="admin-modal-close" onClick={() => setInvoiceBooking(null)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <div className="invoice-lux-box">
                <div className="invoice-lux-header">
                  <div>
                    <img 
                      src="/assets/images/hsd-logo.png" 
                      alt="Hotel Shree Daan Logo" 
                      className="invoice-brand-logo-img" 
                      onError={(e) => { e.target.src = '/assets/images/logo-sticky.png'; }}
                    />
                    <div style={{ fontSize: '0.78rem', color: '#666' }}>Valsad Road, Balitha, Vapi - 396 191, Gujarat</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--admin-maroon-darkest)', textTransform: 'uppercase' }}>GUEST INVOICE</div>
                    <span className="id-badge">ID: {invoiceBooking.id}</span>
                  </div>
                </div>

                <div className="invoice-meta-line"><span>Guest Full Name</span><strong>{invoiceBooking.name}</strong></div>
                <div className="invoice-meta-line"><span>Contact Phone</span><span>{invoiceBooking.phone || 'N/A'}</span></div>
                <div className="invoice-meta-line"><span>Email Address</span><span>{invoiceBooking.email || 'N/A'}</span></div>
                <div className="invoice-meta-line"><span>Room Category</span><strong>{invoiceBooking.roomType}</strong></div>
                <div className="invoice-meta-line"><span>Check-In Date</span><span>{invoiceBooking.checkIn}</span></div>
                <div className="invoice-meta-line"><span>Check-Out Date</span><span>{invoiceBooking.checkOut}</span></div>
                <div className="invoice-meta-line"><span>Duration</span><span>{invoiceBooking.nights || 1} Night(s)</span></div>
                <div className="invoice-meta-line"><span>Occupancy</span><span>{invoiceBooking.adults || 1} Adult(s), {invoiceBooking.children || 0} Child(ren)</span></div>
                <div className="invoice-meta-line"><span>Payment Status</span><strong style={{ color: 'var(--admin-success)' }}>{invoiceBooking.payStatus || 'Paid in Full'}</strong></div>

                <div className="invoice-total-highlight">
                  <span>Total Billing Amount</span>
                  <span>₹{(invoiceBooking.total || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn-luxury btn-luxury-secondary" onClick={() => setInvoiceBooking(null)}>
                Close
              </button>
              <button className="btn-luxury btn-luxury-primary" onClick={printInvoice}>
                🖨️ Print Official Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GLOBAL TOAST ALERT ==================== */}
      {toastMessage && (
        <div className="admin-toast-wrapper">
          <div className="admin-toast-card">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
