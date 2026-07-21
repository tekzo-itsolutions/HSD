/* ==========================================================================
   HOTEL SHREE DAAN & GOLDEN SPARSH SPA — ADMIN PANEL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Storage Keys
  const ROOM_KEY = 'hsd_room_bookings';
  const SPA_KEY = 'hsd_spa_bookings';
  const MSG_KEY = 'hsd_messages';

  // Seed Initial Mock Data if missing
  initSeedData();

  // State Management
  let roomBookings = JSON.parse(localStorage.getItem(ROOM_KEY)) || [];
  let spaBookings = JSON.parse(localStorage.getItem(SPA_KEY)) || [];
  let messages = JSON.parse(localStorage.getItem(MSG_KEY)) || [];

  let selectedMessageId = null;

  // Initial UI Setup
  initNavigation();
  initQuickStats();
  renderDashboard();
  renderRoomBookings();
  renderSpaBookings();
  renderMessages();
  initModals();
  initSearchAndFilters();
  initExportBtns();

  // Listen for storage changes from other tabs (e.g. public website booking forms)
  window.addEventListener('storage', (e) => {
    if ([ROOM_KEY, SPA_KEY, MSG_KEY].includes(e.key)) {
      refreshDataFromStorage();
      showToast('New update received from guest booking desk!');
    }
  });

  function refreshDataFromStorage() {
    roomBookings = JSON.parse(localStorage.getItem(ROOM_KEY)) || [];
    spaBookings = JSON.parse(localStorage.getItem(SPA_KEY)) || [];
    messages = JSON.parse(localStorage.getItem(MSG_KEY)) || [];

    updateNavBadges();
    initQuickStats();
    renderDashboard();
    renderRoomBookings();
    renderSpaBookings();
    renderMessages();
  }

  /* ---------- 1. SEED MOCK DATA & STORAGE SETUP ---------- */
  function initSeedData() {
    if (!localStorage.getItem(ROOM_KEY)) {
      localStorage.setItem(ROOM_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(SPA_KEY)) {
      localStorage.setItem(SPA_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(MSG_KEY)) {
      localStorage.setItem(MSG_KEY, JSON.stringify([]));
    }
  }

  /* ---------- 2. NAVIGATION & TABS ---------- */
  function initNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitleEl = document.getElementById('adminPageTitle');

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = item.dataset.tab;

        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        tabContents.forEach(content => {
          if (content.id === `tab-${targetTab}`) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });

        // Update Topbar Title
        const titleMap = {
          'dashboard': 'Dashboard Overview',
          'rooms': 'Room Booking Records',
          'spa': 'Golden Sparsh Spa Bookings',
          'messages': 'Guest Messages & Inquiries',
          'analytics': 'Analytics & Performance',
          'settings': 'System Settings & Control'
        };
        if (pageTitleEl && titleMap[targetTab]) {
          pageTitleEl.textContent = titleMap[targetTab];
        }

        // Close Mobile Sidebar if open
        const sidebar = document.getElementById('adminSidebar');
        if (sidebar) sidebar.classList.remove('open');
      });
    });

    // Mobile Sidebar Toggle
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    updateNavBadges();
  }

  function updateNavBadges() {
    const roomBadge = document.getElementById('navBadgeRooms');
    const spaBadge = document.getElementById('navBadgeSpa');
    const msgBadge = document.getElementById('navBadgeMessages');

    const activeRooms = roomBookings.filter(r => r.status === 'confirmed' || r.status === 'pending').length;
    const activeSpa = spaBookings.filter(s => s.status === 'confirmed' || s.status === 'pending').length;
    const unreadMsgs = messages.filter(m => m.status === 'unread').length;

    if (roomBadge) roomBadge.textContent = activeRooms;
    if (spaBadge) spaBadge.textContent = activeSpa;
    if (msgBadge) {
      msgBadge.textContent = unreadMsgs;
      msgBadge.style.display = unreadMsgs > 0 ? 'inline-block' : 'none';
    }
  }

  /* ---------- 3. QUICK STATS CALCULATION ---------- */
  function initQuickStats() {
    const totalRoomRev = roomBookings
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + (r.total || 0), 0);
    
    const totalSpaRev = spaBookings
      .filter(s => s.status !== 'cancelled')
      .reduce((sum, s) => sum + (s.price || 0), 0);

    const totalRev = totalRoomRev + totalSpaRev;

    const unreadMsgs = messages.filter(m => m.status === 'unread').length;

    const elTotalRev = document.getElementById('statTotalRevenue');
    const elRoomCount = document.getElementById('statRoomBookingsCount');
    const elSpaCount = document.getElementById('statSpaBookingsCount');
    const elUnreadMsgs = document.getElementById('statUnreadMsgsCount');

    if (elTotalRev) elTotalRev.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
    if (elRoomCount) elRoomCount.textContent = roomBookings.length;
    if (elSpaCount) elSpaCount.textContent = spaBookings.length;
    if (elUnreadMsgs) elUnreadMsgs.textContent = unreadMsgs;
  }

  /* ---------- 4. DASHBOARD RENDER ---------- */
  function renderDashboard() {
    // Recent Room Bookings Widget
    const recentRoomTable = document.getElementById('recentRoomTableBody');
    if (recentRoomTable) {
      const recentRooms = [...roomBookings].reverse().slice(0, 5);
      if (recentRooms.length === 0) {
        recentRoomTable.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#888;">No room bookings recorded yet.</td></tr>`;
      } else {
        recentRoomTable.innerHTML = recentRooms.map(r => `
          <tr>
            <td>
              <div class="table-user-info">
                <strong>${escapeHtml(r.name)}</strong>
                <span>${r.id}</span>
              </div>
            </td>
            <td>${escapeHtml(r.roomType)}</td>
            <td>${formatDate(r.checkIn)} → ${formatDate(r.checkOut)}</td>
            <td><strong>₹${(r.total || 0).toLocaleString('en-IN')}</strong></td>
            <td><span class="badge-status status-${r.status}">${r.status}</span></td>
            <td>
              <button class="btn-icon-action btn-icon-danger" title="Delete Booking" onclick="deleteRoomBooking('${r.id}')">🗑️</button>
            </td>
          </tr>
        `).join('');
      }
    }

    // Recent Spa Bookings Widget
    const recentSpaTable = document.getElementById('recentSpaTableBody');
    if (recentSpaTable) {
      const recentSpa = [...spaBookings].reverse().slice(0, 5);
      if (recentSpa.length === 0) {
        recentSpaTable.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#888;">No spa appointments recorded yet.</td></tr>`;
      } else {
        recentSpaTable.innerHTML = recentSpa.map(s => `
          <tr>
            <td>
              <div class="table-user-info">
                <strong>${escapeHtml(s.name)}</strong>
                <span>${s.id}</span>
              </div>
            </td>
            <td>${escapeHtml(s.service)}</td>
            <td>${formatDate(s.date)} (${s.timeSlot || 'Slot TBD'})</td>
            <td><span class="badge-status status-${s.status}">${s.status}</span></td>
            <td>
              <button class="btn-icon-action btn-icon-danger" title="Delete Spa Appointment" onclick="deleteSpaBooking('${s.id}')">🗑️</button>
            </td>
          </tr>
        `).join('');
      }
    }

    // Unread Messages Widget
    const recentMsgList = document.getElementById('recentMsgListWidget');
    if (recentMsgList) {
      const unreadList = messages.filter(m => m.status === 'unread').slice(0, 4);
      if (unreadList.length === 0) {
        recentMsgList.innerHTML = `<p style="color:var(--admin-text-muted); font-size:0.9rem; text-align:center; padding:20px;">🎉 All guest messages have been read!</p>`;
      } else {
        recentMsgList.innerHTML = unreadList.map(m => `
          <div class="inbox-item unread" onclick="openMessageTabAndSelect('${m.id}')">
            <div class="inbox-item-head">
              <span class="inbox-sender">${escapeHtml(m.name)}</span>
              <span class="inbox-date">${m.date || 'Today'}</span>
            </div>
            <div class="inbox-subject">${escapeHtml(m.subject)}</div>
            <div class="inbox-preview">${escapeHtml(m.message)}</div>
          </div>
        `).join('');
      }
    }
  }

  /* ---------- 5. ROOM BOOKINGS TAB (SEPARATED) ---------- */
  function renderRoomBookings(filterSearch = '', filterStatus = 'all') {
    const tableBody = document.getElementById('roomBookingsTableBody');
    if (!tableBody) return;

    let filtered = [...roomBookings];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (filterSearch.trim() !== '') {
      const q = filterSearch.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.roomType.toLowerCase().includes(q) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:var(--admin-text-muted);">No room bookings matched your criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(r => `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>
          <div class="table-user-info">
            <strong>${escapeHtml(r.name)}</strong>
            <span>${escapeHtml(r.phone || 'No phone')} | ${escapeHtml(r.email || '')}</span>
          </div>
        </td>
        <td>${escapeHtml(r.roomType)}</td>
        <td>
          <div>${formatDate(r.checkIn)} → ${formatDate(r.checkOut)}</div>
          <span style="font-size:0.75rem; color:var(--admin-text-muted);">${r.nights || 1} Night(s)</span>
        </td>
        <td>${r.adults || 1} Adult(s), ${r.children || 0} Child</td>
        <td><strong style="color:var(--admin-maroon-dark);">₹${(r.total || 0).toLocaleString('en-IN')}</strong></td>
        <td>
          <select class="filter-select" style="padding:4px 8px; font-size:0.8rem;" onchange="updateRoomStatus('${r.id}', this.value)">
            <option value="confirmed" ${r.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="checked-in" ${r.status === 'checked-in' ? 'selected' : ''}>Checked-In</option>
            <option value="pending" ${r.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="cancelled" ${r.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-action" title="View & Print Invoice" onclick="viewRoomInvoice('${r.id}')">📄</button>
            <button class="btn-icon-action btn-icon-danger" title="Delete Record" onclick="deleteRoomBooking('${r.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* ---------- 6. SPA BOOKINGS TAB (SEPARATED) ---------- */
  function renderSpaBookings(filterSearch = '', filterService = 'all', filterStatus = 'all') {
    const tableBody = document.getElementById('spaBookingsTableBody');
    if (!tableBody) return;

    let filtered = [...spaBookings];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (filterService !== 'all') {
      filtered = filtered.filter(s => s.serviceCode === filterService || s.service.toLowerCase().includes(filterService.toLowerCase()));
    }

    if (filterSearch.trim() !== '') {
      const q = filterSearch.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.service.toLowerCase().includes(q) ||
        (s.phone && s.phone.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--admin-text-muted);">No spa bookings matched your criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(s => `
      <tr>
        <td><strong>${s.id}</strong></td>
        <td>
          <div class="table-user-info">
            <strong>${escapeHtml(s.name)}</strong>
            <span>${escapeHtml(s.phone || 'No phone')}</span>
          </div>
        </td>
        <td><strong>${escapeHtml(s.service)}</strong></td>
        <td>
          <div>${formatDate(s.date)}</div>
          <span style="font-size:0.75rem; color:var(--admin-gold); font-weight:600;">⏰ ${s.timeSlot || 'Morning Slot'}</span>
        </td>
        <td>${escapeHtml(s.duration || '60 mins')}</td>
        <td><strong style="color:var(--admin-maroon-dark);">₹${(s.price || 0).toLocaleString('en-IN')}</strong></td>
        <td>
          <select class="filter-select" style="padding:4px 8px; font-size:0.8rem;" onchange="updateSpaStatus('${s.id}', this.value)">
            <option value="confirmed" ${s.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="completed" ${s.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="pending" ${s.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="cancelled" ${s.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-action btn-icon-danger" title="Delete Spa Record" onclick="deleteSpaBooking('${s.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* ---------- 7. MESSAGES TAB (SEPARATED) ---------- */
  function renderMessages(filterSearch = '', filterStatus = 'all') {
    const listEl = document.getElementById('messageInboxList');
    if (!listEl) return;

    let filtered = [...messages];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(m => m.status === filterStatus);
    }

    if (filterSearch.trim() !== '') {
      const q = filterSearch.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `<p style="padding:20px; text-align:center; color:var(--admin-text-muted);">No messages found.</p>`;
      renderMessageDetail(null);
      return;
    }

    listEl.innerHTML = filtered.map(m => `
      <div class="inbox-item ${m.status === 'unread' ? 'unread' : ''} ${selectedMessageId === m.id ? 'active' : ''}" onclick="selectMessage('${m.id}')">
        <div class="inbox-item-head">
          <span class="inbox-sender">${escapeHtml(m.name)}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="inbox-date">${m.date || ''}</span>
            <button class="btn-icon-action btn-icon-danger" style="width:26px; height:26px; font-size:0.75rem; padding:0; border-radius:4px;" title="Delete Query" onclick="event.stopPropagation(); deleteMessage('${m.id}')">🗑️</button>
          </div>
        </div>
        <div class="inbox-subject">${escapeHtml(m.subject)}</div>
        <div class="inbox-preview">${escapeHtml(m.message)}</div>
      </div>
    `).join('');

    // Auto select first message if none selected
    if (!selectedMessageId || !messages.find(m => m.id === selectedMessageId)) {
      selectedMessageId = filtered.length > 0 ? filtered[0].id : null;
    }
    renderMessageDetail(selectedMessageId);
  }

  window.selectMessage = function(id) {
    selectedMessageId = id;
    const msg = messages.find(m => m.id === id);
    if (msg && msg.status === 'unread') {
      msg.status = 'read';
      saveMessages();
      updateNavBadges();
      initQuickStats();
    }
    
    // Highlight item
    document.querySelectorAll('.inbox-item').forEach(el => el.classList.remove('active'));
    renderMessages(document.getElementById('msgSearchInput')?.value || '', document.getElementById('msgStatusFilter')?.value || 'all');
    renderMessageDetail(id);
  };

  function renderMessageDetail(id) {
    const readerEl = document.getElementById('messageReaderPanel');
    if (!readerEl) return;

    const msg = messages.find(m => m.id === id);
    if (!msg) {
      readerEl.innerHTML = `
        <div class="inbox-empty-state">
          <span>✉️</span>
          <h3>Select a message to view details</h3>
          <p>Choose an inquiry from the list on the left to read and respond.</p>
        </div>
      `;
      return;
    }

    readerEl.innerHTML = `
      <div class="reader-header">
        <h3>${escapeHtml(msg.subject)}</h3>
        <div class="reader-meta-bar">
          <div class="reader-sender-details">
            <strong>${escapeHtml(msg.name)}</strong>
            <span>📧 ${escapeHtml(msg.email || 'No email')} | 📞 ${escapeHtml(msg.phone || 'No phone')}</span>
          </div>
          <div class="action-btn-group">
            <button class="btn-admin btn-admin-secondary btn-admin-sm" onclick="toggleMessageReadStatus('${msg.id}')">
              ${msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
            </button>
            <button class="btn-icon-action btn-icon-danger" title="Delete Message" onclick="deleteMessage('${msg.id}')">🗑️</button>
          </div>
        </div>
      </div>
      <div class="reader-body">${escapeHtml(msg.message)}</div>
      <div class="reader-reply-box">
        <label style="font-weight:600; font-size:0.88rem; color:var(--admin-maroon-dark); margin-bottom:8px; display:block;">Quick Reply to Guest:</label>
        <textarea id="replyTextarea" rows="3" placeholder="Type your response to ${escapeHtml(msg.name)}..."></textarea>
        <div style="display:flex; justify-content:flex-end;">
          <button class="btn-admin btn-admin-primary" onclick="sendReplySimulated('${msg.id}')">✉️ Send Reply</button>
        </div>
      </div>
    `;
  }

  /* ---------- 8. ACTIONS & CRUD FUNCTIONS ---------- */
  // Room Actions
  window.updateRoomStatus = function(id, newStatus) {
    const r = roomBookings.find(b => b.id === id);
    if (r) {
      r.status = newStatus;
      saveRooms();
      initQuickStats();
      updateNavBadges();
      showToast(`Room booking ${id} status set to ${newStatus}.`);
    }
  };

  window.deleteRoomBooking = function(id) {
    if (confirm(`Are you sure you want to delete room booking ${id}?`)) {
      roomBookings = roomBookings.filter(b => b.id !== id);
      saveRooms();
      initQuickStats();
      updateNavBadges();
      renderDashboard();
      renderRoomBookings();
      showToast(`Room booking ${id} deleted.`);
    }
  };

  window.deleteAllRoomBookings = function() {
    if (roomBookings.length === 0) {
      alert('There are no room bookings to delete.');
      return;
    }
    if (confirm(`⚠️ Warning: Are you sure you want to delete ALL (${roomBookings.length}) room bookings? This cannot be undone.`)) {
      roomBookings = [];
      saveRooms();
      initQuickStats();
      updateNavBadges();
      renderDashboard();
      renderRoomBookings();
      showToast('All room bookings have been deleted.');
    }
  };

  window.deleteAllSpaBookings = function() {
    if (spaBookings.length === 0) {
      alert('There are no spa appointments to delete.');
      return;
    }
    if (confirm(`⚠️ Warning: Are you sure you want to delete ALL (${spaBookings.length}) spa appointments? This cannot be undone.`)) {
      spaBookings = [];
      saveSpa();
      initQuickStats();
      updateNavBadges();
      renderDashboard();
      renderSpaBookings();
      showToast('All spa appointments have been deleted.');
    }
  };

  window.viewRoomInvoice = function(id) {
    const r = roomBookings.find(b => b.id === id);
    if (!r) return;

    const modalBody = document.getElementById('invoiceModalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="invoice-printable" id="printableRoomInvoice">
        <div class="invoice-header-brand">
          <div>
            <div class="invoice-brand-title">Hotel Shree Daan</div>
            <span style="font-size:0.85rem; color:var(--admin-text-muted);">Valsad Road, Balitha, Vapi - 396 191</span>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.1rem; font-weight:bold; color:var(--admin-maroon-main);">GUEST INVOICE</div>
            <span style="font-size:0.85rem;">Booking ID: <strong>${r.id}</strong></span>
          </div>
        </div>

        <div class="invoice-meta-row"><span>Guest Name</span><strong>${escapeHtml(r.name)}</strong></div>
        <div class="invoice-meta-row"><span>Contact Phone</span><span>${escapeHtml(r.phone || 'N/A')}</span></div>
        <div class="invoice-meta-row"><span>Email Address</span><span>${escapeHtml(r.email || 'N/A')}</span></div>
        <div class="invoice-meta-row"><span>Room Category</span><strong>${escapeHtml(r.roomType)}</strong></div>
        <div class="invoice-meta-row"><span>Check-in Date</span><span>${formatDate(r.checkIn)}</span></div>
        <div class="invoice-meta-row"><span>Check-out Date</span><span>${formatDate(r.checkOut)}</span></div>
        <div class="invoice-meta-row"><span>Total Duration</span><span>${r.nights || 1} Night(s)</span></div>
        <div class="invoice-meta-row"><span>Guests Count</span><span>${r.adults || 1} Adult(s), ${r.children || 0} Child</span></div>
        <div class="invoice-meta-row"><span>Payment Status</span><strong style="color:var(--admin-success);">${r.payStatus || 'Paid'}</strong></div>

        <div class="invoice-total-row">
          <span>Total Billing Amount</span>
          <span>₹${(r.total || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>
    `;

    openModal('invoiceModal');
  };

  window.printCurrentInvoice = function() {
    const content = document.getElementById('printableRoomInvoice');
    if (!content) return;

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Room Booking Invoice — Hotel Shree Daan</title>
      <style>
        body{font-family:sans-serif; padding:40px; color:#1E080E;}
        .invoice-printable{max-width:600px; margin:0 auto; border:1px solid #ccc; padding:30px; border-radius:8px;}
        .invoice-header-brand{display:flex; justify-content:space-between; border-bottom:2px solid #6E1027; padding-bottom:14px; margin-bottom:20px;}
        .invoice-brand-title{font-size:22px; font-weight:bold; color:#6E1027;}
        .invoice-meta-row{display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed #eee;}
        .invoice-total-row{display:flex; justify-content:space-between; font-size:18px; font-weight:bold; margin-top:14px; padding-top:14px; border-top:2px solid #6E1027;}
      </style></head><body>${content.outerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  // Spa Actions
  window.updateSpaStatus = function(id, newStatus) {
    const s = spaBookings.find(b => b.id === id);
    if (s) {
      s.status = newStatus;
      saveSpa();
      initQuickStats();
      updateNavBadges();
      showToast(`Spa appointment ${id} status set to ${newStatus}.`);
    }
  };

  window.deleteSpaBooking = function(id) {
    if (confirm(`Are you sure you want to delete spa booking ${id}?`)) {
      spaBookings = spaBookings.filter(b => b.id !== id);
      saveSpa();
      initQuickStats();
      updateNavBadges();
      renderDashboard();
      renderSpaBookings();
      showToast(`Spa appointment ${id} deleted.`);
    }
  };

  // Message Actions
  window.toggleMessageReadStatus = function(id) {
    const m = messages.find(msg => msg.id === id);
    if (m) {
      m.status = m.status === 'unread' ? 'read' : 'unread';
      saveMessages();
      updateNavBadges();
      initQuickStats();
      renderMessages(document.getElementById('msgSearchInput')?.value || '', document.getElementById('msgStatusFilter')?.value || 'all');
      showToast(`Message marked as ${m.status}.`);
    }
  };

  window.deleteMessage = function(id) {
    if (confirm('Are you sure you want to delete this guest query/message?')) {
      messages = messages.filter(m => m.id !== id);
      if (selectedMessageId === id) {
        selectedMessageId = messages.length > 0 ? messages[0].id : null;
      }
      saveMessages();
      updateNavBadges();
      initQuickStats();
      renderDashboard();
      renderMessages(document.getElementById('msgSearchInput')?.value || '', document.getElementById('msgStatusFilter')?.value || 'all');
      showToast('Guest query deleted successfully.');
    }
  };

  window.deleteAllMessages = function() {
    if (messages.length === 0) {
      alert('There are no messages or queries to delete.');
      return;
    }
    if (confirm(`Are you sure you want to delete ALL (${messages.length}) guest messages and queries?`)) {
      messages = [];
      selectedMessageId = null;
      saveMessages();
      updateNavBadges();
      initQuickStats();
      renderDashboard();
      renderMessages();
      showToast('All guest queries have been deleted.');
    }
  };

  window.sendReplySimulated = function(id) {
    const textarea = document.getElementById('replyTextarea');
    if (!textarea || textarea.value.trim() === '') {
      alert('Please enter a response message before sending.');
      return;
    }

    const m = messages.find(msg => msg.id === id);
    if (m) {
      m.status = 'read';
      m.replied = true;
      saveMessages();
      showToast(`Reply sent successfully to ${m.email || m.name}!`);
      textarea.value = '';
    }
  };

  window.openMessageTabAndSelect = function(id) {
    const navMsg = document.querySelector('.admin-nav-item[data-tab="messages"]');
    if (navMsg) navMsg.click();
    selectMessage(id);
  };

  /* ---------- 9. SAVE TO LOCALSTORAGE ---------- */
  function saveRooms() {
    localStorage.setItem(ROOM_KEY, JSON.stringify(roomBookings));
  }

  function saveSpa() {
    localStorage.setItem(SPA_KEY, JSON.stringify(spaBookings));
  }

  function saveMessages() {
    localStorage.setItem(MSG_KEY, JSON.stringify(messages));
  }

  /* ---------- 10. MODALS & FORMS ---------- */
  function initModals() {
    // Add Room Booking Form Submit
    const addRoomForm = document.getElementById('addRoomBookingForm');
    if (addRoomForm) {
      addRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('mRoomGuestName').value;
        const phone = document.getElementById('mRoomPhone').value;
        const email = document.getElementById('mRoomEmail').value;
        const roomSelect = document.getElementById('mRoomType');
        const roomType = roomSelect.options[roomSelect.selectedIndex].text.split(' — ')[0];
        const pricePerNight = parseInt(roomSelect.options[roomSelect.selectedIndex].dataset.price, 10) || 5000;
        const checkIn = document.getElementById('mRoomCheckIn').value;
        const checkOut = document.getElementById('mRoomCheckOut').value;
        const adults = parseInt(document.getElementById('mRoomAdults').value, 10);
        const children = parseInt(document.getElementById('mRoomChildren').value, 10);

        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const nights = Math.max(1, Math.round((outDate - inDate) / (1000 * 60 * 60 * 24)));
        const total = nights * pricePerNight;
        const bookingId = 'SD' + Date.now().toString().slice(-8);

        const newBooking = {
          id: bookingId,
          name,
          email,
          phone,
          roomType,
          checkIn,
          checkOut,
          adults,
          children,
          nights,
          total,
          status: 'confirmed',
          payStatus: 'Paid',
          dateCreated: new Date().toISOString().split('T')[0]
        };

        roomBookings.unshift(newBooking);
        saveRooms();
        initQuickStats();
        updateNavBadges();
        renderDashboard();
        renderRoomBookings();
        closeModal('addRoomModal');
        addRoomForm.reset();
        showToast(`Room booking ${bookingId} created successfully!`);
      });
    }

    // Add Spa Booking Form Submit
    const addSpaForm = document.getElementById('addSpaBookingForm');
    if (addSpaForm) {
      addSpaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('mSpaGuestName').value;
        const phone = document.getElementById('mSpaPhone').value;
        const email = document.getElementById('mSpaEmail').value;
        const serviceSelect = document.getElementById('mSpaService');
        const service = serviceSelect.options[serviceSelect.selectedIndex].text.split(' — ')[0];
        const price = parseInt(serviceSelect.options[serviceSelect.selectedIndex].dataset.price, 10) || 2000;
        const date = document.getElementById('mSpaDate').value;
        const timeSlot = document.getElementById('mSpaTimeSlot').value;
        const spaId = 'SPA-' + Math.floor(1000 + Math.random() * 9000);

        const newSpa = {
          id: spaId,
          name,
          phone,
          email,
          service,
          date,
          timeSlot,
          duration: '60 mins',
          price,
          status: 'confirmed',
          dateCreated: new Date().toISOString().split('T')[0]
        };

        spaBookings.unshift(newSpa);
        saveSpa();
        initQuickStats();
        updateNavBadges();
        renderDashboard();
        renderSpaBookings();
        closeModal('addSpaModal');
        addSpaForm.reset();
        showToast(`Spa appointment ${spaId} created!`);
      });
    }
  }

  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  };

  /* ---------- 11. SEARCH & FILTERS ENGINE ---------- */
  function initSearchAndFilters() {
    // Room Filter Controls
    const roomSearch = document.getElementById('roomSearchInput');
    const roomStatus = document.getElementById('roomStatusFilter');
    if (roomSearch) roomSearch.addEventListener('input', () => renderRoomBookings(roomSearch.value, roomStatus ? roomStatus.value : 'all'));
    if (roomStatus) roomStatus.addEventListener('change', () => renderRoomBookings(roomSearch ? roomSearch.value : '', roomStatus.value));

    // Spa Filter Controls
    const spaSearch = document.getElementById('spaSearchInput');
    const spaService = document.getElementById('spaServiceFilter');
    const spaStatus = document.getElementById('spaStatusFilter');

    const updateSpaFilter = () => {
      renderSpaBookings(
        spaSearch ? spaSearch.value : '',
        spaService ? spaService.value : 'all',
        spaStatus ? spaStatus.value : 'all'
      );
    };

    if (spaSearch) spaSearch.addEventListener('input', updateSpaFilter);
    if (spaService) spaService.addEventListener('change', updateSpaFilter);
    if (spaStatus) spaStatus.addEventListener('change', updateSpaFilter);

    // Global Topbar Search
    const topbarSearch = document.getElementById('topbarSearchInput');
    if (topbarSearch) {
      topbarSearch.addEventListener('input', (e) => {
        const q = e.target.value;
        if (roomSearch) roomSearch.value = q;
        if (spaSearch) spaSearch.value = q;
        renderRoomBookings(q, roomStatus ? roomStatus.value : 'all');
        renderSpaBookings(q, spaService ? spaService.value : 'all', spaStatus ? spaStatus.value : 'all');
      });
    }
  }

  /* ---------- 12. CSV EXPORTER ---------- */
  function initExportBtns() {
    const exportRoomsBtn = document.getElementById('exportRoomsCsvBtn');
    if (exportRoomsBtn) {
      exportRoomsBtn.addEventListener('click', () => {
        exportToCSV('Room_Bookings_Hotel_Shree_Daan.csv', roomBookings, [
          'id', 'name', 'phone', 'email', 'roomType', 'checkIn', 'checkOut', 'nights', 'adults', 'children', 'total', 'status'
        ]);
      });
    }

    const exportSpaBtn = document.getElementById('exportSpaCsvBtn');
    if (exportSpaBtn) {
      exportSpaBtn.addEventListener('click', () => {
        exportToCSV('Spa_Bookings_Golden_Sparsh.csv', spaBookings, [
          'id', 'name', 'phone', 'email', 'service', 'date', 'timeSlot', 'duration', 'price', 'status'
        ]);
      });
    }
  }

  function exportToCSV(filename, rows, keys) {
    if (!rows || !rows.length) {
      alert('No data available to export.');
      return;
    }
    const header = keys.join(',');
    const csvContent = rows.map(r => keys.map(k => `"${(r[k] !== undefined ? r[k] : '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([header + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename} successfully!`);
  }

  /* ---------- UTILS ---------- */
  function formatDate(str) {
    if (!str) return '—';
    const d = new Date(str);
    return isNaN(d.getTime()) ? str : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(msg) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // System Settings Actions
  window.deleteAllEntries = function() {
    if (confirm('🚨 Are you sure you want to delete ALL entries (room bookings, spa appointments, and guest messages) from the Admin Panel?')) {
      roomBookings = [];
      spaBookings = [];
      messages = [];
      selectedMessageId = null;

      localStorage.setItem(ROOM_KEY, JSON.stringify([]));
      localStorage.setItem(SPA_KEY, JSON.stringify([]));
      localStorage.setItem(MSG_KEY, JSON.stringify([]));

      updateNavBadges();
      initQuickStats();
      renderDashboard();
      renderRoomBookings();
      renderSpaBookings();
      renderMessages();

      showToast('All entries have been permanently deleted from the admin panel.');
    }
  };

  const resetBtn = document.getElementById('resetDataSystemBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      window.deleteAllEntries();
    });
  }
});
