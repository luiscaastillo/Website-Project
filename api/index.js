import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, update, remove } from 'firebase/database';

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || '*';
const corsAllowList = corsOrigin === '*'
  ? true
  : corsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(cors({ origin: corsAllowList }));
app.use(express.json({ limit: '1mb' }));

if (!process.env.VERCEL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicDir = path.join(__dirname, '..', 'public');
  app.use(express.static(publicDir));
}

const requiredEnv = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = missingEnv.length > 0 ? null : initializeApp(firebaseConfig);
const db = firebaseApp ? getDatabase(firebaseApp) : null;

// =====================================
// API PUBLIC (READ)
// =====================================

app.use('/api', (req, res, next) => {
  if (!db) {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error. Missing Firebase environment variables.'
    });
  }
  next();
});

app.get('/api/data/:collection', async (req, res) => {
  const { collection } = req.params;
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, collection));
    
    if (snapshot.exists()) {
      res.json({ success: true, data: snapshot.val() });
    } else {
      res.status(404).json({ success: false, message: "No data found." });
    }
  } catch (error) {
    console.error("Error reading db:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================
// API PRIVATE (CREATE, UPDATE, DELETE)
// =====================================

const adminToken = process.env.ADMIN_TOKEN || '';

const requireAuth = (req, res, next) => {
  if (!adminToken) {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error. Missing ADMIN_TOKEN.'
    });
  }

  const token = req.headers.authorization || '';
  if (token === `Bearer ${adminToken}`) {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Unauthorized access' });
};

// 1. CREATE / OVERWRITE
app.post('/api/data/:collection/:id', requireAuth, async (req, res) => {
  const { collection, id } = req.params;
  const newData = req.body;
  
  try {
    await set(ref(db, `${collection}/${id}`), newData);
    res.status(201).json({ success: true, message: "Data saved successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. UPDATE (Partial) 
app.put('/api/data/:collection/:id', requireAuth, async (req, res) => {
  const { collection, id } = req.params;
  const updateData = req.body;
  const updates = {};
  updates[`${collection}/${id}`] = updateData;

  try {
    await update(ref(db), updates);
    res.json({ success: true, message: "Data updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. DELETE
app.delete('/api/data/:collection/:id', requireAuth, async (req, res) => {
  const { collection, id } = req.params;
  try {
    await remove(ref(db, `${collection}/${id}`));
    res.json({ success: true, message: "Data deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

export default app;