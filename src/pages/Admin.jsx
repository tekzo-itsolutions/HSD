import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const ROOM_KEY = 'hsd_room_bookings';
  const SPA_KEY = 'hsd_spa_bookings';
  const MSG_KEY = 'hsd_messages';

  // ==================== 1. STATE MANAGEMENT ====================
  const [activeTab, setActiveTab] = useState('dashboard');
  const [roomBookings, setRoomBookings] = useState([]);
  const [spaBookings, setSpaBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilterStatus, setRoomFilterStatus] = useState('all');
  const [spaFilterService, setSpaFilterService] = useState('all');
  const [spaFilterStatus, setSpaFilterStatus] = useState('all');
  const [msgFilterStatus, setMsgFilterStatus] = useState('all');

  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Modals Visibility
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [addSpaOpen, setAddSpaOpen] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState(null);

  // New booking form fields
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPhone, setNewRoomPhone] = useState('');
  const [newRoomEmail, setNewRoomEmail] = useState('');
  const [newRoomType, setNewRoomType] = useState('Premier Suite');
  const [newRoomPrice, setNewRoomPrice] = useState(7500);
  const [newRoomCheckIn, setNewRoomCheckIn] = useState('');
  const [newRoomCheckOut, setNewRoomCheckOut] = useState('');
  const [newRoomAdults, setNewRoomAdults] = useState('2');
  const [newRoomChildren, setNewRoomChildren] = useState('0');

  const [newSpaName, setNewSpaName] = useState('');
  const [newSpaPhone, setNewSpaPhone] = useState('');
  const [newSpaEmail, setNewSpaEmail] = useState('');
  const [newSpaServiceCode, setNewSpaServiceCode] = useState('signature');
  const [newSpaDate, setNewSpaDate] = useState('');
  const [newSpaTimeSlot, setNewSpaTimeSlot] = useState('02:00 PM');

  // Toasts
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==================== 2. SEEDING & LOAD ====================
  useEffect(() => {
    // Import admin CSS on mount
    import('../styles/admin.css').catch(() => {});

    // Ensure database keys exist and load data
    const rData = localStorage.getItem(ROOM_KEY);
    const sData = localStorage.getItem(SPA_KEY);
    const mData = localStorage.getItem(MSG_KEY) || localStorage.getItem('hsd_contact_inquiries');

    let parsedRooms = rData ? JSON.parse(rData) : [];
    let parsedSpa = sData ? JSON.parse(sData) : [];
    let parsedMsgs = mData ? JSON.parse(mData) : [];

    // Seed mock data if completely empty
    if (parsedRooms.length === 0 && parsedSpa.length === 0 && parsedMsgs.length === 0) {
      parsedRooms = [
        {
          id: 'SD7859341',
          name: 'Arjun Mehta',
          email: 'arjun.mehta@example.com',
          phone: '+91 98210 12345',
          roomType: 'Premier Suite',
          checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          adults: 2,
          children: 1,
          nights: 2,
          total: 15000,
          status: 'confirmed',
          payStatus: 'Paid',
          dateCreated: new Date().toISOString().split('T')[0]
        },
        {
          id: 'SD7859342',
          name: 'Priya Sharma',
          email: 'priya.s@example.com',
          phone: '+91 97110 54321',
          roomType: 'Executive Double',
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          adults: 2,
          children: 0,
          nights: 1,
          total: 5500,
          status: 'checked-in',
          payStatus: 'Paid',
          dateCreated: new Date().toISOString().split('T')[0]
        }
      ];

      parsedSpa = [
        {
          id: 'SPA-8245',
          name: 'Rohan Patel',
          email: 'rohan@example.com',
          phone: '+91 99000 98765',
          service: 'Shirodhara Therapy',
          serviceCode: 'shirodhara',
          date: new Date().toISOString().split('T')[0],
          timeSlot: '02:00 PM',
          duration: '75 mins',
          price: 4000,
          status: 'confirmed',
          dateCreated: new Date().toISOString().split('T')[0]
        },
        {
          id: 'SPA-1934',
          name: 'Anjali Desai',
          email: 'anjali@example.com',
          phone: '+91 98765 43210',
          service: 'Natural Scrub',
          serviceCode: 'natural-scrub',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          timeSlot: '11:30 AM',
          duration: '30 Min',
          price: 1000,
          status: 'pending',
          dateCreated: new Date().toISOString().split('T')[0]
        }
      ];

      parsedMsgs = [
        {
          id: 'MSG-4001',
          name: 'Vikram Singh',
          email: 'vikram.singh@gmail.com',
          phone: '+91 96543 21098',
          subject: 'Corporate Booking Inquiry',
          message: 'Hello, we are looking to book 15 executive rooms for a corporate retreat on next month 10th. Please let us know the group discount packages.',
          status: 'unread',
          replied: false,
          date: '10 Aug'
        },
        {
          id: 'MSG-4002',
          name: 'Sneha Gupta',
          email: 'sneha.gupta@example.com',
          phone: '+91 95432 10987',
          subject: 'Banquet Hall Reservations',
          message: 'Is the banquet hall available for a reception party on 25th of this month? What is the seating capacity with social distancing guidelines?',
          status: 'read',
          replied: false,
          date: '12 Aug'
        }
      ];

      localStorage.setItem(ROOM_KEY, JSON.stringify(parsedRooms));
      localStorage.setItem(SPA_KEY, JSON.stringify(parsedSpa));
      localStorage.setItem(MSG_KEY, JSON.stringify(parsedMsgs));
    }

    setRoomBookings(parsedRooms);
    setSpaBookings(parsedSpa);
    setMessages(parsedMsgs);
    if (parsedMsgs.length > 0) {
      setSelectedMsgId(parsedMsgs[0].id);
    }

    // Default form dates to today
    setNewRoomCheckIn(new Date().toISOString().split('T')[0]);
    setNewRoomCheckOut(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setNewSpaDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Listen for storage updates (cross-tab) and focus updates (same-tab navigation)
  useEffect(() => {
    const loadFromStorage = () => {
      const rooms = JSON.parse(localStorage.getItem(ROOM_KEY)) || [];
      const spas = JSON.parse(localStorage.getItem(SPA_KEY)) || [];
      const rawMsg = localStorage.getItem(MSG_KEY) || localStorage.getItem('hsd_contact_inquiries');
      const msgs = rawMsg ? JSON.parse(rawMsg) : [];
      setRoomBookings(rooms);
      setSpaBookings(spas);
      setMessages(msgs);
    };

    const handleStorageChange = (e) => {
      if (!e.key || [ROOM_KEY, SPA_KEY, MSG_KEY, 'hsd_contact_inquiries'].includes(e.key)) {
        loadFromStorage();
        triggerToast('New update received from Guest Booking Desk!');
      }
    };

    // Re-read when tab regains focus (same-tab navigation from booking page)
    const handleFocus = () => loadFromStorage();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Sync state to local storage when state changes
  const saveRooms = (newRooms) => {
    setRoomBookings(newRooms);
    localStorage.setItem(ROOM_KEY, JSON.stringify(newRooms));
  };

  const saveSpa = (newSpas) => {
    setSpaBookings(newSpas);
    localStorage.setItem(SPA_KEY, JSON.stringify(newSpas));
  };

  const saveMessagesState = (newMsgs) => {
    setMessages(newMsgs);
    localStorage.setItem(MSG_KEY, JSON.stringify(newMsgs));
  };

  // ==================== 3. COMPUTED QUICK STATS ====================
  const activeRoomsCount = roomBookings.filter(r => r.status === 'confirmed' || r.status === 'checked-in').length;
  const activeSpaCount = spaBookings.filter(s => s.status === 'confirmed' || s.status === 'pending').length;
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;

  const totalRoomRevenue = roomBookings
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + (r.total || 0), 0);

  const totalSpaRevenue = spaBookings
    .filter(s => s.status !== 'cancelled')
    .reduce((sum, s) => sum + (s.price || 0), 0);

  const totalRevenue = totalRoomRevenue + totalSpaRevenue;

  // ==================== 4. CRUD OPERATIONS ====================
  const deleteRoomBooking = (id) => {
    if (window.confirm(`Are you sure you want to delete room booking ${id}?`)) {
      const updated = roomBookings.filter(b => b.id !== id);
      saveRooms(updated);
      triggerToast(`Room booking ${id} deleted.`);
    }
  };

  const updateRoomStatus = (id, status) => {
    const updated = roomBookings.map(b => b.id === id ? { ...b, status } : b);
    saveRooms(updated);
    triggerToast(`Room booking ${id} status set to ${status}.`);
  };

  const deleteSpaBooking = (id) => {
    if (window.confirm(`Are you sure you want to delete spa booking ${id}?`)) {
      const updated = spaBookings.filter(s => s.id !== id);
      saveSpa(updated);
      triggerToast(`Spa appointment ${id} deleted.`);
    }
  };

  const updateSpaStatus = (id, status) => {
    const updated = spaBookings.map(s => s.id === id ? { ...s, status } : s);
    saveSpa(updated);
    triggerToast(`Spa appointment ${id} status set to ${status}.`);
  };

  const deleteMessage = (id) => {
    if (window.confirm('Are you sure you want to delete this guest inquiry?')) {
      const updated = messages.filter(m => m.id !== id);
      if (selectedMsgId === id) {
        setSelectedMsgId(updated.length > 0 ? updated[0].id : null);
      }
      saveMessagesState(updated);
      triggerToast('Guest query deleted.');
    }
  };

  const toggleMessageReadStatus = (id) => {
    const updated = messages.map(m => m.id === id ? { ...m, status: m.status === 'unread' ? 'read' : 'unread' } : m);
    saveMessagesState(updated);
    triggerToast('Message status updated.');
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const updated = messages.map(m => m.id === selectedMsgId ? { ...m, replied: true, status: 'read' } : m);
    saveMessagesState(updated);
    setReplyText('');
    triggerToast('Reply sent successfully (simulated)!');
  };

  const selectMessage = (id) => {
    setSelectedMsgId(id);
    const msg = messages.find(m => m.id === id);
    if (msg && msg.status === 'unread') {
      const updated = messages.map(m => m.id === id ? { ...m, status: 'read' } : m);
      saveMessagesState(updated);
    }
  };

  const handleRoomTypeSelect = (e) => {
    const val = e.target.value;
    setNewRoomType(val);
    // Price dictionary mapping
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

  const handleAddRoomBookingSubmit = (e) => {
    e.preventDefault();
    const inDate = new Date(newRoomCheckIn);
    const outDate = new Date(newRoomCheckOut);
    const nights = Math.max(1, Math.round((outDate - inDate) / (1000 * 60 * 60 * 24)));
    const total = nights * newRoomPrice;
    const bookingId = 'SD' + Date.now().toString().slice(-8);

    const newBooking = {
      id: bookingId,
      name: newRoomName,
      email: newRoomEmail,
      phone: newRoomPhone,
      roomType: newRoomType,
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

    saveRooms([newBooking, ...roomBookings]);
    setAddRoomOpen(false);
    setNewRoomName('');
    setNewRoomPhone('');
    setNewRoomEmail('');
    triggerToast(`Room booking ${bookingId} created successfully!`);
  };

  const handleAddSpaBookingSubmit = (e) => {
    e.preventDefault();
    const serviceMap = {
      'signature': { name: 'Signature Therapy', price: 6000 },
      'couple': { name: 'Couple Connect', price: 6000 },
      'deep_tissue': { name: 'Deep Tissue', price: 2500 },
      'shirodhara': { name: 'Shirodhara', price: 4000 },
      'natural-scrub': { name: 'Natural Scrub', price: 1000 }
    };
    const mapped = serviceMap[newSpaServiceCode] || { name: 'Spa Session', price: 2000 };
    const spaId = 'SPA-' + Math.floor(1000 + Math.random() * 9000);

    const newSpa = {
      id: spaId,
      name: newSpaName,
      phone: newSpaPhone,
      email: newSpaEmail,
      service: mapped.name,
      serviceCode: newSpaServiceCode,
      date: newSpaDate,
      timeSlot: newSpaTimeSlot,
      duration: '60 mins',
      price: mapped.price,
      status: 'confirmed',
      dateCreated: new Date().toISOString().split('T')[0]
    };

    saveSpa([newSpa, ...spaBookings]);
    setAddSpaOpen(false);
    setNewSpaName('');
    setNewSpaPhone('');
    setNewSpaEmail('');
    triggerToast(`Spa appointment ${spaId} created successfully!`);
  };

  const printInvoice = () => {
    if (!invoiceBooking) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
      <head>
        <title>Room Booking Invoice — Hotel Shree Daan</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #1E080E; }
          .invoice-printable { max-width: 600px; margin: 0 auto; border: 1px solid #ccc; padding: 30px; border-radius: 8px; }
          .invoice-header-brand { display: flex; justify-content: space-between; border-bottom: 2px solid #6E1027; padding-bottom: 14px; margin-bottom: 20px; }
          .invoice-brand-title { font-size: 22px; font-weight: bold; color: #6E1027; }
          .invoice-meta-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee; }
          .invoice-total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; margin-top: 14px; padding-top: 14px; border-top: 2px solid #6E1027; }
        </style>
      </head>
      <body>
        <div class="invoice-printable">
          <div class="invoice-header-brand">
            <div>
              <div class="invoice-brand-title">Hotel Shree Daan</div>
              <span style="font-size:0.85rem; color:#888;">Valsad Road, Balitha, Vapi - 396 191</span>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.1rem; font-weight:bold; color:#6E1027;">GUEST INVOICE</div>
              <span style="font-size:0.85rem;">Booking ID: <strong>${invoiceBooking.id}</strong></span>
            </div>
          </div>
          <div class="invoice-meta-row"><span>Guest Name</span><strong>${invoiceBooking.name}</strong></div>
          <div class="invoice-meta-row"><span>Contact Phone</span><span>${invoiceBooking.phone || 'N/A'}</span></div>
          <div class="invoice-meta-row"><span>Email Address</span><span>${invoiceBooking.email || 'N/A'}</span></div>
          <div class="invoice-meta-row"><span>Room Category</span><strong>${invoiceBooking.roomType}</strong></div>
          <div class="invoice-meta-row"><span>Check-in Date</span><span>${invoiceBooking.checkIn}</span></div>
          <div class="invoice-meta-row"><span>Check-out Date</span><span>${invoiceBooking.checkOut}</span></div>
          <div class="invoice-meta-row"><span>Total Duration</span><span>${invoiceBooking.nights || 1} Night(s)</span></div>
          <div class="invoice-meta-row"><span>Guests Count</span><span>${invoiceBooking.adults || 1} Adult(s), ${invoiceBooking.children || 0} Child</span></div>
          <div class="invoice-meta-row"><span>Payment Status</span><strong style="color:green;">${invoiceBooking.payStatus || 'Paid'}</strong></div>
          <div class="invoice-total-row">
            <span>Total Billing Amount</span>
            <span>₹${(invoiceBooking.total || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  const exportCSV = (filename, dataList, headers) => {
    if (!dataList.length) {
      alert('No booking logs available to export.');
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
    triggerToast(`Exported ${filename} successfully!`);
  };

  const resetAllData = () => {
    if (window.confirm('🚨 WARNING: This will permanently wipe all booking and inquiry records from LocalStorage. Proceed?')) {
      saveRooms([]);
      saveSpa([]);
      saveMessagesState([]);
      setSelectedMsgId(null);
      triggerToast('Database wiped.');
    }
  };

  // ==================== 5. FILTER LOGIC ====================
  const getFilteredRooms = () => {
    return roomBookings.filter(r => {
      const matchSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.roomType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = roomFilterStatus === 'all' || r.status === roomFilterStatus;
      return matchSearch && matchStatus;
    });
  };

  const getFilteredSpas = () => {
    return spaBookings.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = spaFilterStatus === 'all' || s.status === spaFilterStatus;
      const matchService = spaFilterService === 'all' || s.serviceCode === spaFilterService;
      return matchSearch && matchStatus && matchService;
    });
  };

  const getFilteredMessages = () => {
    return messages.filter(m => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = msgFilterStatus === 'all' || m.status === msgFilterStatus;
      return matchSearch && matchStatus;
    });
  };

  return (
    <div className="admin-body" style={{ minHeight: '100vh', background: '#f5f7fb', color: '#333', fontFamily: '"Jost", sans-serif' }}>
      <div className="admin-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
        
        {/* ===== SIDEBAR ===== */}
        <aside className="admin-sidebar" style={{ background: 'var(--admin-maroon-dark)', color: 'var(--white)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="admin-sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <img src="/assets/images/hsd-logo.png" alt="Logo" className="admin-sidebar-logo" style={{ height: '40px' }} />
              <div className="admin-brand-info" style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--admin-gold)', fontSize: '1.25rem' }}>Hotel Shree Daan</strong>
                <span style={{ fontSize: '0.72rem', color: '#c3a1a7' }}>Admin Portal</span>
              </div>
            </div>

            <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="admin-nav-section-title" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a07d85', margin: '15px 0 5px' }}>Core Management</div>
              <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                <span className="nav-icon">📊</span> Dashboard
              </button>
              <button className={`admin-nav-item ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
                <span className="nav-icon">🏨</span> Rooms <span className="nav-badge">{activeRoomsCount}</span>
              </button>
              <button className={`admin-nav-item ${activeTab === 'spa' ? 'active' : ''}`} onClick={() => setActiveTab('spa')}>
                <span className="nav-icon">🧘</span> Spa <span className="nav-badge">{activeSpaCount}</span>
              </button>

              <div className="admin-nav-section-title" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a07d85', margin: '15px 0 5px' }}>Communications</div>
              <button className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                <span className="nav-icon">✉️</span> Messages <span className="nav-badge">{unreadMessagesCount}</span>
              </button>

              <div className="admin-nav-section-title" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a07d85', margin: '15px 0 5px' }}>System &amp; Reports</div>
              <button className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                <span className="nav-icon">📈</span> Revenue
              </button>
              <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <span className="nav-icon">⚙️</span> Settings
              </button>
            </nav>
          </div>

          <div className="admin-sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', marginTop: '30px' }}>
            <div className="admin-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <div className="admin-avatar" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--admin-gold)', color: 'var(--admin-maroon-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>SD</div>
              <div className="admin-user-info" style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.85rem' }}>Admin Desk</p>
                <span style={{ fontSize: '0.72rem', color: '#c3a1a7' }}>General Manager</span>
              </div>
            </div>
            <Link to="/" className="back-to-site-btn" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.08)', padding: '10px', borderRadius: '4px', color: '#fff', fontSize: '0.82rem', textDecoration: 'none' }}>
              🌐 View Live Site
            </Link>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="admin-main" style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* TOPBAR */}
          <header className="admin-topbar" style={{ background: '#fff', borderBottom: '1px solid #e1e8ed', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--admin-maroon-dark)', fontFamily: 'var(--font-display)' }}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'rooms' && 'Room Booking Records'}
              {activeTab === 'spa' && 'Spa Bookings'}
              {activeTab === 'messages' && 'Guest Messages & Queries'}
              {activeTab === 'analytics' && 'Revenue Analytics'}
              {activeTab === 'settings' && 'System Settings & Control'}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="search-wrapper" style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', color: '#888' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search globally..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: '#f0f3f6', border: 'none', padding: '8px 12px 8px 32px', borderRadius: '6px', fontSize: '0.85rem', width: '220px' }}
                />
              </div>

              <button className="topbar-action-btn" onClick={() => setAddRoomOpen(true)} title="Add Room Booking">🏨</button>
              <button className="topbar-action-btn" onClick={() => setAddSpaOpen(true)} title="Add Spa Booking">🧘</button>
            </div>
          </header>

          {/* CONTENT PANEL */}
          <div className="admin-content" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
            
            {/* ==================== TAB: DASHBOARD ==================== */}
            {activeTab === 'dashboard' && (
              <>
                <div className="stat-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <div className="stat-card stat-card-gold">
                    <div className="stat-info">
                      <span>Total Revenue</span>
                      <h3>₹{totalRevenue.toLocaleString('en-IN')}</h3>
                      <p>Room + Spa Combined</p>
                    </div>
                    <div className="stat-icon-wrapper">💰</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-info">
                      <span>Room Bookings</span>
                      <h3>{roomBookings.length}</h3>
                      <p>All-Time Logged</p>
                    </div>
                    <div className="stat-icon-wrapper">🏨</div>
                  </div>
                  <div className="stat-card stat-card-success">
                    <div className="stat-info">
                      <span>Spa Bookings</span>
                      <h3>{spaBookings.length}</h3>
                      <p>Active Requested</p>
                    </div>
                    <div className="stat-icon-wrapper">🧘</div>
                  </div>
                  <div className="stat-card stat-card-info">
                    <div className="stat-info">
                      <span>Unread Queries</span>
                      <h3>{unreadMessagesCount}</h3>
                      <p>In Concierge Inbox</p>
                    </div>
                    <div className="stat-icon-wrapper">✉️</div>
                  </div>
                </div>

                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
                  <div className="admin-card">
                    <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--admin-maroon-dark)' }}>🏨 Recent Room Bookings</h3>
                      <button className="btn-admin btn-admin-secondary btn-admin-sm" onClick={() => setActiveTab('rooms')}>View All</button>
                    </div>
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Guest ID</th>
                            <th>Category</th>
                            <th>Stay Period</th>
                            <th>Total Tariff</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomBookings.slice(0, 5).map(r => (
                            <tr key={r.id}>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <strong>{r.name}</strong>
                                  <span style={{ fontSize: '0.75rem', color: '#888' }}>{r.id}</span>
                                </div>
                              </td>
                              <td>{r.roomType}</td>
                              <td>{r.checkIn} → {r.checkOut}</td>
                              <td><strong>₹{(r.total || 0).toLocaleString('en-IN')}</strong></td>
                              <td><span className={`badge-status status-${r.status}`}>{r.status}</span></td>
                            </tr>
                          ))}
                          {roomBookings.length === 0 && (
                            <tr><td colspan="5" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No room bookings recorded.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="admin-card">
                    <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--admin-maroon-dark)' }}>🧘 Recent Spa Requests</h3>
                      <button className="btn-admin btn-admin-secondary btn-admin-sm" onClick={() => setActiveTab('spa')}>View All</button>
                    </div>
                    <div className="table-responsive">
                      <table className="admin-table">
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
                              <td><strong>{s.name}</strong></td>
                              <td>{s.service}</td>
                              <td>{s.date} <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--admin-gold)', fontWeight: '600' }}>{s.timeSlot}</span></td>
                              <td><span className={`badge-status status-${s.status}`}>{s.status}</span></td>
                            </tr>
                          ))}
                          {spaBookings.length === 0 && (
                            <tr><td colspan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No spa bookings recorded.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ==================== TAB: ROOMS ==================== */}
            {activeTab === 'rooms' && (
              <div className="admin-card">
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select className="filter-select" value={roomFilterStatus} onChange={(e) => setRoomFilterStatus(e.target.value)}>
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked-In</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <button className="btn-admin btn-admin-primary" onClick={() => exportCSV('Room_Bookings.csv', roomBookings, ['id', 'name', 'phone', 'email', 'roomType', 'checkIn', 'checkOut', 'nights', 'total', 'status'])}>
                    📥 Export CSV Log
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Guest Info</th>
                        <th>Accommodation</th>
                        <th>Stay Period</th>
                        <th>Guests</th>
                        <th>Total Tariff</th>
                        <th>Status Control</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredRooms().map(r => (
                        <tr key={r.id}>
                          <td><strong>{r.id}</strong></td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong>{r.name}</strong>
                              <span style={{ fontSize: '0.75rem', color: '#666' }}>📞 {r.phone || 'N/A'}</span>
                            </div>
                          </td>
                          <td>{r.roomType}</td>
                          <td>
                            <div>{r.checkIn} → {r.checkOut}</div>
                            <span style={{ fontSize: '0.72rem', color: '#888' }}>{r.nights} Night(s)</span>
                          </td>
                          <td>{r.adults} Adults, {r.children} Children</td>
                          <td><strong style={{ color: 'var(--admin-maroon-dark)' }}>₹{r.total?.toLocaleString('en-IN')}</strong></td>
                          <td>
                            <select
                              value={r.status}
                              onChange={(e) => updateRoomStatus(r.id, e.target.value)}
                              className="filter-select"
                              style={{ padding: '4px 6px', fontSize: '0.8rem' }}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="checked-in">Checked-In</option>
                              <option value="pending">Pending</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn-icon-action" title="Invoice Receipt" onClick={() => setInvoiceBooking(r)}>📄</button>
                              <button className="btn-icon-action btn-icon-danger" title="Delete Log" onClick={() => deleteRoomBooking(r.id)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {getFilteredRooms().length === 0 && (
                        <tr><td colspan="8" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>No room bookings found matching filters.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== TAB: SPA ==================== */}
            {activeTab === 'spa' && (
              <div className="admin-card">
                <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select className="filter-select" value={spaFilterStatus} onChange={(e) => setSpaFilterStatus(e.target.value)}>
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <select className="filter-select" value={spaFilterService} onChange={(e) => setSpaFilterService(e.target.value)}>
                      <option value="all">All Therapies</option>
                      <option value="signature">Signature Therapy</option>
                      <option value="couple">Couple Connect</option>
                      <option value="deep_tissue">Deep Tissue</option>
                      <option value="shirodhara">Shirodhara</option>
                      <option value="natural-scrub">Natural Scrub</option>
                    </select>
                  </div>

                  <button className="btn-admin btn-admin-gold" onClick={() => exportCSV('Spa_Appointments.csv', spaBookings, ['id', 'name', 'phone', 'service', 'date', 'timeSlot', 'price', 'status'])}>
                    📥 Export Spa CSV Log
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Guest Info</th>
                        <th>Therapy Service</th>
                        <th>Preferred Time</th>
                        <th>Price Tariff</th>
                        <th>Status Control</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredSpas().map(s => (
                        <tr key={s.id}>
                          <td><strong>{s.id}</strong></td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong>{s.name}</strong>
                              <span style={{ fontSize: '0.75rem', color: '#666' }}>📞 {s.phone || 'N/A'}</span>
                            </div>
                          </td>
                          <td><strong>{s.service}</strong></td>
                          <td>
                            <div>{s.date}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-gold)', fontWeight: '600' }}>⏰ {s.timeSlot}</span>
                          </td>
                          <td><strong style={{ color: 'var(--admin-maroon-dark)' }}>₹{s.price?.toLocaleString('en-IN')}</strong></td>
                          <td>
                            <select
                              value={s.status}
                              onChange={(e) => updateSpaStatus(s.id, e.target.value)}
                              className="filter-select"
                              style={{ padding: '4px 6px', fontSize: '0.8rem' }}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="pending">Pending</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button className="btn-icon-action btn-icon-danger" title="Delete Log" onClick={() => deleteSpaBooking(s.id)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                      {getFilteredSpas().length === 0 && (
                        <tr><td colspan="7" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>No spa bookings found matching filters.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== TAB: MESSAGES ==================== */}
            {activeTab === 'messages' && (
              <div className="admin-card" style={{ padding: 0, display: 'grid', gridTemplateColumns: '380px 1fr', height: '620px', overflow: 'hidden' }}>
                <div style={{ borderRight: '1px solid #e1e8ed', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #e1e8ed', display: 'flex', gap: '8px' }}>
                    <select className="filter-select" style={{ flex: 1 }} value={msgFilterStatus} onChange={(e) => setMsgFilterStatus(e.target.value)}>
                      <option value="all">All Messages</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </select>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {getFilteredMessages().map(m => (
                      <div
                        key={m.id}
                        className={`inbox-item ${m.status === 'unread' ? 'unread' : ''} ${selectedMsgId === m.id ? 'active' : ''}`}
                        onClick={() => selectMessage(m.id)}
                        style={{ cursor: 'pointer', padding: '16px', borderBottom: '1px solid #f0f3f6' }}
                      >
                        <div className="inbox-item-head" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span className="inbox-sender" style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>{m.name}</span>
                          <span className="inbox-date" style={{ fontSize: '0.72rem', color: '#999' }}>{m.date || 'Today'}</span>
                        </div>
                        <div className="inbox-subject" style={{ fontWeight: '600', fontSize: '0.82rem', color: 'var(--admin-maroon-dark)', marginBottom: '4px' }}>{m.subject}</div>
                        <div className="inbox-preview" style={{ fontSize: '0.78rem', color: '#666', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{m.message}</div>
                      </div>
                    ))}
                    {getFilteredMessages().length === 0 && (
                      <p style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '0.9rem' }}>No guest queries found.</p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
                  {(() => {
                    const msg = messages.find(m => m.id === selectedMsgId);
                    if (!msg) {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#aaa' }}>
                          <span style={{ fontSize: '3rem' }}>✉️</span>
                          <h3>Select an inquiry to view details</h3>
                        </div>
                      );
                    }
                    return (
                      <>
                        <div className="reader-header" style={{ padding: '24px', borderBottom: '1px solid #e1e8ed' }}>
                          <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-maroon-dark)' }}>{msg.subject}</h3>
                          <div className="reader-meta-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong>{msg.name}</strong>
                              <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#666' }}>📧 {msg.email} | 📞 {msg.phone || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn-admin btn-admin-secondary btn-admin-sm" onClick={() => toggleMessageReadStatus(msg.id)}>
                                {msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                              </button>
                              <button className="btn-icon-action btn-icon-danger" onClick={() => deleteMessage(msg.id)}>🗑️</button>
                            </div>
                          </div>
                        </div>

                        <div className="reader-body" style={{ padding: '24px', flex: 1, overflowY: 'auto', fontSize: '0.92rem', lineHeight: '1.6', color: '#444' }}>
                          {msg.message}
                        </div>

                        <form onSubmit={handleSendReply} className="reader-reply-box" style={{ padding: '20px', borderTop: '1px solid #e1e8ed', background: '#f8fafc' }}>
                          <label style={{ fontWeight: '600', fontSize: '0.82rem', color: 'var(--admin-maroon-dark)', marginBottom: '8px', display: 'block' }}>Quick Reply via Desk Email:</label>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows="3"
                            placeholder={`Type reply email to ${msg.name}...`}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px', fontSize: '0.88rem' }}
                            required
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-admin btn-admin-primary">✉️ Send Reply</button>
                          </div>
                        </form>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ==================== TAB: ANALYTICS ==================== */}
            {activeTab === 'analytics' && (
              <div className="admin-card">
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--admin-maroon-dark)' }}>Combined Revenue Stream Analytics</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', margin: '30px 0' }}>
                  <div style={{ background: '#fcf8f2', padding: '24px', borderRadius: '8px', border: '1px solid #f3ebd7', textAlign: 'center' }}>
                    <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: '#9d7c66' }}>Accommodations Revenue</span>
                    <h2 style={{ fontSize: '2.2rem', margin: '10px 0', color: 'var(--admin-maroon-dark)' }}>₹{totalRoomRevenue.toLocaleString('en-IN')}</h2>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Total tariff billing across all room bookings</p>
                  </div>
                  <div style={{ background: '#f0faf1', padding: '24px', borderRadius: '8px', border: '1px solid #def3e1', textAlign: 'center' }}>
                    <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: '#568b5c' }}>Golden Sparsh Spa Revenue</span>
                    <h2 style={{ fontSize: '2.2rem', margin: '10px 0', color: 'green' }}>₹{totalSpaRevenue.toLocaleString('en-IN')}</h2>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Total fees billing across all spa treatments</p>
                  </div>
                </div>

                <div style={{ padding: '20px', background: '#fafbfc', borderRadius: '6px', border: '1px solid #e1e8ed', marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 10px' }}>📊 Operational Revenue Ratios</h4>
                  <div style={{ display: 'flex', height: '28px', borderRadius: '4px', overflow: 'hidden', margin: '15px 0' }}>
                    <div style={{ width: `${totalRevenue > 0 ? (totalRoomRevenue / totalRevenue) * 100 : 70}%`, background: 'var(--admin-maroon-dark)', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Rooms ({totalRevenue > 0 ? Math.round((totalRoomRevenue / totalRevenue) * 100) : 70}%)
                    </div>
                    <div style={{ width: `${totalRevenue > 0 ? (totalSpaRevenue / totalRevenue) * 100 : 30}%`, background: 'var(--admin-gold)', color: 'var(--admin-maroon-dark)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      Spa ({totalRevenue > 0 ? Math.round((totalSpaRevenue / totalRevenue) * 100) : 30}%)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: SETTINGS ==================== */}
            {activeTab === 'settings' && (
              <div className="admin-card">
                <h3 style={{ color: 'var(--admin-maroon-dark)' }}>Database &amp; Storage Controls</h3>
                <p>Manage localized booking registers and contact forms stored in the browser storage.</p>
                
                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px' }}>Wipe System Database</h4>
                    <p style={{ fontSize: '0.82rem', color: '#666', margin: 0 }}>Deletes all room records, spa forms, and emails from your LocalStorage register.</p>
                    <button className="btn-admin btn-admin-danger" style={{ marginTop: '10px' }} onClick={resetAllData}>Wipe All Storage Databases</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ==================== MODAL: ADD ROOM BOOKING ==================== */}
      {addRoomOpen && (
        <div className="modal-overlay active">
          <div className="modal-container">
            <div className="modal-header">
              <h3>🏨 Quick Room Booking Register</h3>
              <button className="modal-close-btn" onClick={() => setAddRoomOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddRoomBookingSubmit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Guest Full Name *</label>
                    <input type="text" className="form-control" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} required placeholder="Guest Name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" className="form-control" value={newRoomPhone} onChange={(e) => setNewRoomPhone(e.target.value)} required placeholder="Phone" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" value={newRoomEmail} onChange={(e) => setNewRoomEmail(e.target.value)} placeholder="guest@example.com" />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Room Category *</label>
                    <select className="form-control" value={newRoomType} onChange={handleRoomTypeSelect}>
                      <option value="Premier Suite">Premier Suite — ₹7,500</option>
                      <option value="Executive Double">Executive Double — ₹5,500</option>
                      <option value="Executive Single">Executive Single — ₹4,500</option>
                      <option value="Standard Double">Standard Double — ₹3,500</option>
                      <option value="Standard Single">Standard Single — ₹2,500</option>
                      <option value="Banquet Hall">Banquet Hall — ₹25,000</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Total Tariff Per Night</label>
                    <input type="number" className="form-control" value={newRoomPrice} onChange={(e) => setNewRoomPrice(parseInt(e.target.value, 10))} />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Check-In *</label>
                    <input type="date" className="form-control" value={newRoomCheckIn} onChange={(e) => setNewRoomCheckIn(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Check-Out *</label>
                    <input type="date" className="form-control" value={newRoomCheckOut} onChange={(e) => setNewRoomCheckOut(e.target.value)} required />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Adults</label>
                    <select className="form-control" value={newRoomAdults} onChange={(e) => setNewRoomAdults(e.target.value)}>
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Children</label>
                    <select className="form-control" value={newRoomChildren} onChange={(e) => setNewRoomChildren(e.target.value)}>
                      <option value="0">0 Children</option>
                      <option value="1">1 Child</option>
                      <option value="2">2 Children</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-admin btn-admin-secondary" onClick={() => setAddRoomOpen(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary">Confirm &amp; Create Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD SPA BOOKING ==================== */}
      {addSpaOpen && (
        <div className="modal-overlay active">
          <div className="modal-container">
            <div className="modal-header" style={{ backgroundColor: 'var(--admin-maroon-dark)' }}>
              <h3 style={{ color: 'var(--admin-gold)' }}>🧘 Add Spa Appointment</h3>
              <button className="modal-close-btn" onClick={() => setAddSpaOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSpaBookingSubmit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Guest Full Name *</label>
                    <input type="text" className="form-control" value={newSpaName} onChange={(e) => setNewSpaName(e.target.value)} required placeholder="Guest Name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" className="form-control" value={newSpaPhone} onChange={(e) => setNewSpaPhone(e.target.value)} required placeholder="Phone Number" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" value={newSpaEmail} onChange={(e) => setNewSpaEmail(e.target.value)} placeholder="guest@example.com" />
                </div>
                <div className="form-group">
                  <label>Spa Service / Therapy *</label>
                  <select className="form-control" value={newSpaServiceCode} onChange={(e) => setNewSpaServiceCode(e.target.value)} required>
                    <option value="signature">Signature Therapy — ₹6,000</option>
                    <option value="couple">Couple Connect — ₹6,000</option>
                    <option value="deep_tissue">Deep Tissue Massage — ₹2,500</option>
                    <option value="shirodhara">Ayurvedic Shirodhara — ₹4,000</option>
                    <option value="natural-scrub">Natural Scrub — ₹1,000</option>
                  </select>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="date" className="form-control" value={newSpaDate} onChange={(e) => setNewSpaDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Time Slot</label>
                    <select className="form-control" value={newSpaTimeSlot} onChange={(e) => setNewSpaTimeSlot(e.target.value)}>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:30 PM">06:30 PM</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-admin btn-admin-secondary" onClick={() => setAddSpaOpen(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-gold">Create Spa Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: VIEW INVOICE ==================== */}
      {invoiceBooking && (
        <div className="modal-overlay active">
          <div className="modal-container">
            <div className="modal-header">
              <h3>📄 Booking Receipt &amp; Invoice</h3>
              <button className="modal-close-btn" onClick={() => setInvoiceBooking(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="invoice-printable" id="printableRoomInvoice">
                <div className="invoice-header-brand" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--admin-maroon-main)', paddingBottom: '14px', marginBottom: '20px' }}>
                  <div>
                    <div className="invoice-brand-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--admin-maroon-main)' }}>Hotel Shree Daan</div>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Valsad Road, Balitha, Vapi - 396 191</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--admin-maroon-main)' }}>GUEST INVOICE</div>
                    <span style={{ fontSize: '0.85rem' }}>Booking ID: <strong>{invoiceBooking.id}</strong></span>
                  </div>
                </div>

                <div className="invoice-meta-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}><span>Guest Name</span><strong>{invoiceBooking.name}</strong></div>
                <div className="invoice-meta-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}><span>Contact Phone</span><span>{invoiceBooking.phone || 'N/A'}</span></div>
                <div className="invoice-meta-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}><span>Email Address</span><span>{invoiceBooking.email || 'N/A'}</span></div>
                <div className="invoice-meta-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}><span>Room Category</span><strong>{invoiceBooking.roomType}</strong></div>
                <div className="invoice-meta-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}><span>Check-in Date</span><span>{invoiceBooking.checkIn}</span></div>
                <div className="invoice-meta-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}><span>Check-out Date</span><span>{invoiceBooking.checkOut}</span></div>
                <div className="invoice-meta-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}><span>Total Duration</span><span>{invoiceBooking.nights || 1} Night(s)</span></div>
                <div className="invoice-meta-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}><span>Guests Count</span><span>{invoiceBooking.adults || 1} Adult(s), {invoiceBooking.children || 0} Child</span></div>
                <div className="invoice-meta-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' }}><span>Payment Status</span><strong style={{ color: 'var(--admin-success)' }}>{invoiceBooking.payStatus || 'Paid'}</strong></div>

                <div className="invoice-total-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '14px', paddingTop: '14px', borderTop: '2px solid var(--admin-maroon-main)' }}>
                  <span>Total Billing Amount</span>
                  <span>₹{(invoiceBooking.total || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-admin btn-admin-secondary" onClick={() => setInvoiceBooking(null)}>Close</button>
              <button className="btn-admin btn-admin-primary" onClick={printInvoice}>🖨️ Print Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GLOBAL TOAST ==================== */}
      {toastMessage && (
        <div className="toast-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999 }}>
          <div className="toast-msg" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#333', color: '#fff', padding: '12px 18px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
