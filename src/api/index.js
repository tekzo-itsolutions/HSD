// Centralized API Service for Hotel Shree Daan & Golden Sparsh Spa
// Connects to Express + MySQL Backend on http://localhost:5000
// Dual-syncs with LocalStorage for offline resilience

const API_BASE = 'http://localhost:5000/api';

const ROOM_STORAGE_KEY = 'hsd_room_bookings';
const SPA_STORAGE_KEY = 'hsd_spa_bookings';
const MSG_STORAGE_KEY = 'hsd_messages';

// Health / Connection Check
export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', database: 'disconnected', error: err.message };
  }
}

export const checkHealth = checkServerHealth;

// ==================== 1. ROOM BOOKINGS ====================

export async function fetchRoomBookings() {
  try {
    const res = await fetch(`${API_BASE}/rooms`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('[API] Backend unreachable for rooms, using local cache:', err.message);
  }
  const local = localStorage.getItem(ROOM_STORAGE_KEY);
  return local ? JSON.parse(local) : [];
}

export async function createRoomBooking(bookingData) {
  let created = { ...bookingData };
  try {
    const res = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (res.ok) {
      created = await res.json();
    }
  } catch (err) {
    console.warn('[API] Backend unreachable, saving room booking locally:', err.message);
  }

  // Update local storage
  try {
    const local = JSON.parse(localStorage.getItem(ROOM_STORAGE_KEY)) || [];
    const filtered = local.filter(b => b.id !== created.id);
    filtered.unshift(created);
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new StorageEvent('storage', { key: ROOM_STORAGE_KEY }));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }

  return created;
}

export async function updateRoomStatus(id, status) {
  try {
    await fetch(`${API_BASE}/rooms/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch (err) {
    console.warn('[API] Backend update failed, updating locally:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem(ROOM_STORAGE_KEY)) || [];
    const updated = local.map(b => b.id === id ? { ...b, status } : b);
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: ROOM_STORAGE_KEY }));
  } catch (e) {}
}

export async function deleteRoomBooking(id) {
  try {
    await fetch(`${API_BASE}/rooms/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('[API] Backend delete failed, deleting locally:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem(ROOM_STORAGE_KEY)) || [];
    const filtered = local.filter(b => b.id !== id);
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new StorageEvent('storage', { key: ROOM_STORAGE_KEY }));
  } catch (e) {}
}

// ==================== 2. SPA BOOKINGS ====================

export async function fetchSpaBookings() {
  try {
    const res = await fetch(`${API_BASE}/spa`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(SPA_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('[API] Backend unreachable for spa, using local cache:', err.message);
  }
  const local = localStorage.getItem(SPA_STORAGE_KEY);
  return local ? JSON.parse(local) : [];
}

export async function createSpaBooking(spaData) {
  let created = { ...spaData };
  try {
    const res = await fetch(`${API_BASE}/spa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spaData)
    });
    if (res.ok) {
      created = await res.json();
    }
  } catch (err) {
    console.warn('[API] Backend unreachable, saving spa booking locally:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem(SPA_STORAGE_KEY)) || [];
    const filtered = local.filter(b => b.id !== created.id);
    filtered.unshift(created);
    localStorage.setItem(SPA_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new StorageEvent('storage', { key: SPA_STORAGE_KEY }));
  } catch (e) {}

  return created;
}

export async function updateSpaStatus(id, status) {
  try {
    await fetch(`${API_BASE}/spa/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch (err) {
    console.warn('[API] Backend update failed, updating locally:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem(SPA_STORAGE_KEY)) || [];
    const updated = local.map(b => b.id === id ? { ...b, status } : b);
    localStorage.setItem(SPA_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: SPA_STORAGE_KEY }));
  } catch (e) {}
}

export async function deleteSpaBooking(id) {
  try {
    await fetch(`${API_BASE}/spa/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('[API] Backend delete failed, deleting locally:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem(SPA_STORAGE_KEY)) || [];
    const filtered = local.filter(b => b.id !== id);
    localStorage.setItem(SPA_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new StorageEvent('storage', { key: SPA_STORAGE_KEY }));
  } catch (e) {}
}

// ==================== 3. MESSAGES & CONTACT ====================

export async function fetchMessages() {
  try {
    const res = await fetch(`${API_BASE}/messages`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('[API] Backend unreachable for messages, using local cache:', err.message);
  }
  const local = localStorage.getItem(MSG_STORAGE_KEY) || localStorage.getItem('hsd_contact_inquiries');
  return local ? JSON.parse(local) : [];
}

export async function createMessage(msgData) {
  let created = { ...msgData };
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData)
    });
    if (res.ok) {
      created = await res.json();
    }
  } catch (err) {
    console.warn('[API] Backend unreachable, saving message locally:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem(MSG_STORAGE_KEY)) || [];
    const filtered = local.filter(b => b.id !== created.id);
    filtered.unshift(created);
    localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(filtered));
    localStorage.setItem('hsd_contact_inquiries', JSON.stringify(filtered));
    window.dispatchEvent(new StorageEvent('storage', { key: MSG_STORAGE_KEY }));
  } catch (e) {}

  return created;
}

export async function replyToMessage(id, replyText) {
  try {
    await fetch(`${API_BASE}/messages/${encodeURIComponent(id)}/reply`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyText })
    });
  } catch (err) {
    console.warn('[API] Backend reply failed, saving locally:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem(MSG_STORAGE_KEY)) || [];
    const updated = local.map(m => m.id === id ? { ...m, replied: true, status: 'read', replyText } : m);
    localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: MSG_STORAGE_KEY }));
  } catch (e) {}
}

export async function updateMessageStatus(id, status) {
  try {
    await fetch(`${API_BASE}/messages/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch (err) {
    console.warn('[API] Backend update failed, updating locally:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem(MSG_STORAGE_KEY)) || [];
    const updated = local.map(m => m.id === id ? { ...m, status } : m);
    localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: MSG_STORAGE_KEY }));
  } catch (e) {}
}

export async function deleteMessage(id) {
  try {
    await fetch(`${API_BASE}/messages/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('[API] Backend delete failed, deleting locally:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem(MSG_STORAGE_KEY)) || [];
    const filtered = local.filter(m => m.id !== id);
    localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new StorageEvent('storage', { key: MSG_STORAGE_KEY }));
  } catch (e) {}
}
