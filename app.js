/* =====================================================
   CHITECHMA UNIVERSITY INSTITUTE — MARKETPLACE
   app.js  |  Core Engine: DB · Auth · Utils · UI
   ===================================================== */

'use strict';

/* ══════════════════════════════════════════════════════
   DATABASE  (localStorage wrapper)
   ══════════════════════════════════════════════════════ */
const DB = {
  K: {
    users:    'cm_users',
    products: 'cm_products',
    team:     'cm_team',
    messages: 'cm_messages',
    session:  'cm_session'
  },

  _get(key)      { try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e) { return []; } },
  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

  /* Users */
  getUsers()        { return this._get(this.K.users); },
  saveUsers(u)      { this._set(this.K.users, u); },
  getUserById(id)   { return this.getUsers().find(u => u.id === id) || null; },
  getUserByEmail(e) { return this.getUsers().find(u => u.email === e) || null; },
  updateUser(id, data) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...data }; this.saveUsers(users); return true; }
    return false;
  },
  deleteUser(id) {
    this.saveUsers(this.getUsers().filter(u => u.id !== id));
    this.saveProducts(this.getProducts().filter(p => p.sellerId !== id));
  },

  /* Products */
  getProducts()       { return this._get(this.K.products); },
  saveProducts(p)     { this._set(this.K.products, p); },
  getProductById(id)  { return this.getProducts().find(p => p.id === id) || null; },
  getApproved()       { return this.getProducts().filter(p => p.approved !== false); },
  addProduct(p)       { const list = this.getProducts(); list.push(p); this.saveProducts(list); },
  deleteProduct(id)   { this.saveProducts(this.getProducts().filter(p => p.id !== id)); },
  updateProduct(id, data) {
    const list = this.getProducts();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; this.saveProducts(list); return true; }
    return false;
  },

  /* Team */
  getTeam()     { return this._get(this.K.team); },
  saveTeam(t)   { this._set(this.K.team, t); },
  addTeamMember(m)   { const t = this.getTeam(); t.push(m); this.saveTeam(t); },
  deleteTeamMember(id) { this.saveTeam(this.getTeam().filter(m => m.id !== id)); },
  updateTeamMember(id, data) {
    const t = this.getTeam();
    const idx = t.findIndex(m => m.id === id);
    if (idx !== -1) { t[idx] = { ...t[idx], ...data }; this.saveTeam(t); }
  },

  /* Messages */
  getMessages()   { return this._get(this.K.messages); },
  saveMessages(m) { this._set(this.K.messages, m); },
  addMessage(msg) { const m = this.getMessages(); m.push(msg); this.saveMessages(m); },
  getInbox(userId){ return this.getMessages().filter(m => m.toId === userId); },
  getSent(userId) { return this.getMessages().filter(m => m.fromId === userId); },
  markRead(id) {
    const m = this.getMessages();
    const idx = m.findIndex(msg => msg.id === id);
    if (idx !== -1) { m[idx].read = true; this.saveMessages(m); }
  },
  countUnread(userId) { return this.getMessages().filter(m => m.toId===userId && !m.read).length; },

  /* Session */
  getSession()   { try { return JSON.parse(localStorage.getItem(this.K.session)); } catch(e) { return null; } },
  setSession(u)  { localStorage.setItem(this.K.session, JSON.stringify(u)); },
  clearSession() { localStorage.removeItem(this.K.session); },

  /* ── SEED DATA ─────────────────────────────────────── */
  init() {
    /* Default users */
    if (this.getUsers().length === 0) {
      this.saveUsers([
        { id:1, name:'Administrator', email:'admin@chitechma.cm', password:'admin123',
          role:'admin', matricule:'ADMIN', phone:'+237 677 000 001',
          profileImage:null, joinDate: new Date().toISOString() },
        { id:2, name:'Jean Mballa', email:'jean@chitechma.cm', password:'student123',
          role:'student', matricule:'CHI/2023/001', phone:'677 123 456',
          profileImage:null, joinDate: new Date().toISOString() }
      ]);
    }

    /* Sample products */
    if (this.getProducts().length === 0) {
      this.saveProducts([
        { id:1001, name:'Nike Running Shoes (Size 42)', category:'clothing', price:5000,
          condition:'good', description:'Nike running shoes worn for 3 months. Very comfortable. Good grip and support.',
          sellerName:'Jean Mballa', sellerPhone:'677 123 456', sellerEmail:'jean@chitechma.cm',
          sellerId:2, image:null, emoji:'👟', color:'#33A344', date: new Date().toISOString(), approved:true },
        { id:1002, name:'HP Laptop 15" Core i5', category:'electronics', price:180000,
          condition:'good', description:'HP laptop, 8GB RAM, 500GB HDD. Works perfectly. Comes with charger and bag.',
          sellerName:'Amina Fomban', sellerPhone:'699 234 567', sellerEmail:'amina@chitechma.cm',
          sellerId:3, image:null, emoji:'💻', color:'#2E86AB', date: new Date().toISOString(), approved:true },
        { id:1003, name:'Engineering Mathematics Textbook', category:'books', price:3500,
          condition:'fair', description:'Level 2 Engineering Mathematics. Some pencil notes inside. All content intact.',
          sellerName:'Grace Ewane', sellerPhone:'650 456 789', sellerEmail:'grace@chitechma.cm',
          sellerId:4, image:null, emoji:'📚', color:'#7B5EA7', date: new Date().toISOString(), approved:true },
        { id:1004, name:'School Backpack (Black, Large)', category:'clothing', price:8000,
          condition:'very-good', description:'Large black backpack with multiple compartments. Fits 15" laptop. Barely used.',
          sellerName:'Peter Ngom', sellerPhone:'670 345 678', sellerEmail:'peter@chitechma.cm',
          sellerId:5, image:null, emoji:'🎒', color:'#E07B39', date: new Date().toISOString(), approved:true },
        { id:1005, name:'Tecno Spark 10 Phone', category:'electronics', price:65000,
          condition:'very-good', description:'128GB storage. Comes with original charger and earphones. Perfect condition.',
          sellerName:'Rachel Ngo', sellerPhone:'678 555 222', sellerEmail:'rachel@chitechma.cm',
          sellerId:6, image:null, emoji:'📱', color:'#7B5EA7', date: new Date().toISOString(), approved:true },
        { id:1006, name:'Medical Affairs Notes Bundle', category:'books', price:4500,
          condition:'good', description:'Year 1 and Year 2 complete medical lecture notes. Very organized and detailed.',
          sellerName:'Diane Nkoum', sellerPhone:'691 303 404', sellerEmail:'diane@chitechma.cm',
          sellerId:7, image:null, emoji:'📓', color:'#C84B31', date: new Date().toISOString(), approved:true }
      ]);
    }

    /* Default team */
    if (this.getTeam().length === 0) {
      this.saveTeam([
        { id:1, name:'Member One Name',   role:'Home Page & Navigation',      photo:null },
        { id:2, name:'Member Two Name',   role:'Login Page & Dashboard',      photo:null },
        { id:3, name:'Member Three Name', role:'Products Page',               photo:null },
        { id:4, name:'Member Four Name',  role:'Sell Form, About & Contact',  photo:null },
        { id:5, name:'Member Five Name',  role:'CSS Styling & Branding',      photo:null }
      ]);
    }
  }
};

/* ══════════════════════════════════════════════════════
   AUTHENTICATION
   ══════════════════════════════════════════════════════ */
const Auth = {
  login(email, password) {
    const u = DB.getUserByEmail(email.trim().toLowerCase());
    if (u && u.password === password) {
      DB.setSession({ id:u.id, name:u.name, role:u.role, email:u.email, profileImage:u.profileImage });
      return { success:true, user:u };
    }
    return { success:false, msg:'Incorrect email or password.' };
  },

  register(data) {
    const existing = DB.getUserByEmail(data.email.trim().toLowerCase());
    if (existing) return { success:false, msg:'This email is already registered.' };
    if (data.password.length < 6) return { success:false, msg:'Password must be at least 6 characters.' };
    const newUser = {
      ...data,
      id: Date.now(),
      email: data.email.trim().toLowerCase(),
      role: 'student',
      profileImage: null,
      joinDate: new Date().toISOString()
    };
    const users = DB.getUsers();
    users.push(newUser);
    DB.saveUsers(users);
    return { success:true, user:newUser };
  },

  logout() { DB.clearSession(); window.location.href = 'index.html'; },
  getUser() { return DB.getSession(); },
  isLoggedIn() { return DB.getSession() !== null; },
  isAdmin() { const s = DB.getSession(); return s && s.role === 'admin'; },

  requireLogin() {
    if (!this.isLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
  },
  requireAdmin() {
    if (!this.isAdmin()) { window.location.href = 'login.html'; return false; }
    return true;
  }
};

/* ══════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════ */
function formatPrice(n) {
  return parseInt(n).toLocaleString('fr-CM') + ' FCFA';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

function uid() { return Date.now() + Math.floor(Math.random() * 9000); }

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showAlert(msg, type, boxId) {
  boxId = boxId || 'alert-box';
  const el = document.getElementById(boxId);
  if (!el) return;
  const cls = type === 'error' ? 'alert-error' : 'alert-success';
  const icon = type === 'error' ? '❌' : '✅';
  el.innerHTML = `<div class="alert ${cls}">${icon} ${msg}</div>`;
  setTimeout(() => { if (el) el.innerHTML = ''; }, 5000);
}

/* Read a file and return base64 via callback */
function readImage(file, cb) {
  if (!file) { cb(null); return; }
  if (file.size > 1.5 * 1024 * 1024) {
    alert('Image too large. Please choose a file under 1.5 MB.');
    cb(null); return;
  }
  const reader = new FileReader();
  reader.onload = e => cb(e.target.result);
  reader.readAsDataURL(file);
}

/* Condition label lookup */
const CONDITIONS = {
  'new': 'Brand New',
  'like-new': 'Like New',
  'very-good': 'Very Good',
  'good': 'Good',
  'fair': 'Fair'
};

/* Category icon lookup */
const CAT_EMOJI = {
  clothing:'👔', electronics:'💻', books:'📚',
  furniture:'🪑', sports:'⚽', other:'📦'
};
const CAT_COLOR = {
  clothing:'#33A344', electronics:'#2E86AB', books:'#7B5EA7',
  furniture:'#E07B39', sports:'#2A9D8F', other:'#888'
};

/* ── Build one product card HTML ─────────────────────── */
function buildCard(p) {
  const imgHtml = p.image
    ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:150px;object-fit:cover;">`
    : `<div class="product-img" style="background-color:${p.color || CAT_COLOR[p.category] || '#33A344'};">${p.emoji || CAT_EMOJI[p.category] || '📦'}</div>`;

  return `
  <div class="product-card">
    ${imgHtml}
    <div class="product-card-body">
      <span class="condition-badge">${CONDITIONS[p.condition] || p.condition}</span>
      <div class="product-name">${escHtml(p.name)}</div>
      <div class="product-price">${formatPrice(p.price)}</div>
      <div class="product-seller">👤 ${escHtml(p.sellerName)}</div>
      <div class="product-contact">📞 ${escHtml(p.sellerPhone)}</div>
      <a href="product-contact.html?id=${p.id}" class="btn btn-sm" style="margin-top:8px;">Contact Seller</a>
    </div>
  </div>`;
}

/* XSS-safe escaping */
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Navbar: inject login/logout dynamically ─────────── */
function updateNavbar() {
  const extra = document.getElementById('nav-extra');
  if (!extra) return;
  const u = Auth.getUser();
  if (u) {
    const unread = DB.countUnread(u.id);
    const badge = unread > 0 ? ` <span style="background:#ef4444;color:#fff;border-radius:50%;padding:1px 6px;font-size:11px;">${unread}</span>` : '';
    extra.innerHTML = `
      <li><a href="${u.role==='admin' ? 'admin.html' : 'dashboard.html'}" style="color:#FFD700;">
        👤 ${escHtml(u.name.split(' ')[0])}${badge}
      </a></li>
      <li><a href="#" onclick="Auth.logout();return false;" style="color:#ffb3b3;">Logout</a></li>`;
  } else {
    extra.innerHTML = `<li><a href="login.html" style="color:#FFD700;font-weight:bold;">🔑 Login</a></li>`;
  }
}

/* ── Mobile nav toggle ───────────────────────────────── */
function toggleMobileNav() {
  const ul = document.getElementById('nav-links');
  if (ul) ul.classList.toggle('nav-open');
}

/* ── INIT on every page ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  DB.init();
  updateNavbar();
});
