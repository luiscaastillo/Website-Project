import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, update, remove } from 'firebase/database';

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Config
const firebaseConfig = {
  apiKey: "0ta92JF6DEv4I-9bbOOpo4nqpE5w8WvgEKqITnqGPt4",
  authDomain: "cb-routes.firebaseapp.com",
  databaseURL: "https://cb-routes-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "cb-routes",
  storageBucket: "cb-routes.appspot.com",
  messagingSenderId: "294196440876",
  appId: "TU_APP_ID"
};

// Start Firebase App
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// =====================================
// API PUBLIC (READ)
// =====================================

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
// Middleware simple de Autenticación
const requireAuth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === 'Bearer my-secret-admin-token') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Unauthorized access" });
  }
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});