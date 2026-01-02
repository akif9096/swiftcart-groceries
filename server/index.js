require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('./models/Admin');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ADMIN_CREATE_SECRET = process.env.ADMIN_CREATE_SECRET || 'create-secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
const axios = require('axios');

async function start(){
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set. See .env.example');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // health
  app.get('/api/health', (req,res) => res.json({ok:true}));

  // create admin (only allowed when presenting ADMIN_CREATE_SECRET header)
  // Convenience: GET returns a small HTML form to create admin (dev only)
  app.get('/api/admin/create', (req, res) => {
    res.type('html').send(`
      <!doctype html>
      <html>
      <head><meta charset="utf-8"><title>Create Admin</title></head>
      <body>
        <h2>Create Admin (dev only)</h2>
        <form id="f">
          <label>Admin ID: <input id="id" /></label><br/>
          <label>Password: <input id="pwd" type="password"/></label><br/>
          <label>Create Secret: <input id="secret" /></label><br/>
          <button type="submit">Create</button>
        </form>
        <pre id="out"></pre>
        <script>
          document.getElementById('f').addEventListener('submit', async (e)=>{
            e.preventDefault();
            const id = document.getElementById('id').value;
            const password = document.getElementById('pwd').value;
            const secret = document.getElementById('secret').value;
            const res = await fetch('/api/admin/create', {
              method: 'POST',
              headers: { 'content-type': 'application/json', 'x-create-secret': secret },
              body: JSON.stringify({ id, password })
            });
            const data = await res.json();
            document.getElementById('out').textContent = JSON.stringify({ status: res.status, data }, null, 2);
          });
        </script>
      </body>
      </html>
    `);
  });

  app.post('/api/admin/create', async (req,res) => {
    try{
      const secret = req.headers['x-create-secret'];
      if (secret !== ADMIN_CREATE_SECRET) return res.status(403).json({ error: 'forbidden' });
      const { id, password } = req.body;
      if (!id || !password) return res.status(400).json({ error: 'id+password required' });
      const existing = await Admin.findOne({ id });
      if (existing) return res.status(409).json({ error: 'admin exists' });
      const hash = await bcrypt.hash(password, 10);
      const a = new Admin({ id, passwordHash: hash });
      await a.save();
      return res.json({ ok: true });
    }catch(e){
      console.error(e);
      return res.status(500).json({ error: 'server error' });
    }
  });

  // login
  app.post('/api/admin/login', async (req,res) => {
    try{
      const { id, password } = req.body;
      if (!id || !password) return res.status(400).json({ error: 'id+password required' });
      const admin = await Admin.findOne({ id });
      if (!admin) return res.status(401).json({ error: 'invalid' });
      const ok = await bcrypt.compare(password, admin.passwordHash);
      if (!ok) return res.status(401).json({ error: 'invalid' });
      const token = jwt.sign({ id: admin.id, sub: admin._id }, JWT_SECRET, { expiresIn: '12h' });
      return res.json({ ok: true, token });
    }catch(e){
      console.error(e);
      return res.status(500).json({ error: 'server error' });
    }
  });

  // Google OAuth start (redirect to Google's consent screen)
  app.get('/api/auth/google', (req, res) => {
    if (!GOOGLE_CLIENT_ID) return res.status(500).json({ error: 'google client id not configured' });
    const redirect = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const scope = encodeURIComponent('openid email profile');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    return res.redirect(url);
  });

  // Google OAuth callback
  app.get('/api/auth/google/callback', async (req, res) => {
    try {
      const code = req.query.code;
      if (!code) return res.status(400).send('Missing code');
      const redirect = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

      // Exchange code for tokens
      const tokenResp = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
        code: String(code),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirect,
        grant_type: 'authorization_code'
      }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

      const { access_token, id_token } = tokenResp.data;

      // Get userinfo
      const userInfoResp = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${access_token}` } });
      const userInfo = userInfoResp.data;

      // Create or find user
      let user = await User.findOne({ email: userInfo.email });
      if (!user) {
        user = new User({ name: userInfo.name || userInfo.email.split('@')[0], email: userInfo.email, meta: { picture: userInfo.picture, sub: userInfo.sub } });
        await user.save();
      }

      // Issue JWT for frontend
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      // Redirect to frontend with token
      const dest = `${FRONTEND_URL.replace(/\/$/, '')}/?token=${token}`;
      return res.redirect(dest);
    } catch (e) {
      console.error('google oauth callback error', e.response ? e.response.data : e.message);
      return res.status(500).send('OAuth error');
    }
  });

  // Return current user info when provided a Bearer token
  app.get('/api/auth/me', async (req, res) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ error: 'missing token' });
      const [, token] = auth.split(' ');
      if (!token) return res.status(401).json({ error: 'missing token' });
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload.id).lean();
      if (!user) return res.status(404).json({ error: 'not found' });
      return res.json({ ok: true, user });
    } catch (e) {
      return res.status(401).json({ error: 'invalid token' });
    }
  });

  // simple users endpoint (listing only for now)
  app.get('/api/users', async (req,res) => {
    try{
      const users = await User.find().limit(50).lean();
      res.json({ ok:true, users });
    }catch(e){ res.status(500).json({ error:'server' }); }
  });

  const port = process.env.PORT || 4000;
  app.listen(port, ()=> console.log('Server started on', port));
}

start().catch(e=>{
  console.error(e);
  process.exit(1);
});
