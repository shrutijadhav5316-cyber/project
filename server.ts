import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_MESSES } from './src/data/initialMesses.ts';
import { Mess, Inquiry, Review } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  messes: Mess[];
  inquiries: Inquiry[];
}

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      messes: INITIAL_MESSES,
      inquiries: [
        {
          id: 'inq-1',
          messId: 'annapurna-mess',
          messName: 'Annapurna Mess',
          studentName: 'Saurabh More',
          phone: '+91 91587 34211',
          email: 'saurabh.m@gmail.com',
          preferredPlan: 'Trial Meal',
          preferredDate: '2026-10-30',
          status: 'Pending',
          createdAt: new Date().toISOString(),
          notes: 'Looking for dinner trial meal around 8:00 PM with Jowar Bhakri.',
        },
        {
          id: 'inq-2',
          messId: 'randive-mess',
          messName: 'Randive Mess',
          studentName: 'Akash Salunkhe',
          phone: '+91 98224 88719',
          email: 'akash.sal@gmail.com',
          preferredPlan: 'Monthly Mess',
          preferredDate: '2026-11-01',
          status: 'Contacted',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Interested in Non-Veg Wednesday/Sunday package.',
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse db.json, resetting to initial', err);
    const initialDb: DatabaseSchema = {
      messes: INITIAL_MESSES,
      inquiries: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json', err);
  }
}

let db = loadDatabase();

app.use(express.json());

// API: Get all messes with optional filtering
app.get('/api/messes', (req, res) => {
  const { search, maxBudget, cuisine, seatsOnly, sort } = req.query;
  let results = [...db.messes];

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.speciality.some((s) => s.toLowerCase().includes(q)) ||
        m.tags.some((t) => t.toLowerCase().includes(q)) ||
        m.cuisine.toLowerCase().includes(q)
    );
  }

  if (maxBudget) {
    const budget = Number(maxBudget);
    if (!isNaN(budget)) {
      results = results.filter((m) => m.monthlyPrice <= budget);
    }
  }

  if (cuisine && typeof cuisine === 'string' && cuisine !== 'All') {
    results = results.filter((m) => m.cuisine.toLowerCase() === cuisine.toLowerCase());
  }

  if (seatsOnly === 'true') {
    results = results.filter((m) => m.availableSeats > 0);
  }

  if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'price') {
    results.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
  } else if (sort === 'distance') {
    // Sort nearest to farthest. Put listings with null/unavailable distance at the end
    results.sort((a, b) => {
      if (a.distanceMeters === null) return 1;
      if (b.distanceMeters === null) return -1;
      return a.distanceMeters - b.distanceMeters;
    });
  }

  res.json({
    total: results.length,
    messes: results,
  });
});

// API: Get single mess
app.get('/api/messes/:id', (req, res) => {
  const mess = db.messes.find((m) => m.id === req.params.id);
  if (!mess) {
    res.status(404).json({ error: 'Mess not found' });
    return;
  }
  res.json(mess);
});

// API: Update seats (Owner live updater)
app.patch('/api/messes/:id/seats', (req, res) => {
  const { availableSeats } = req.body;
  const mess = db.messes.find((m) => m.id === req.params.id);
  if (!mess) {
    res.status(404).json({ error: 'Mess not found' });
    return;
  }

  const seats = Math.max(0, Math.min(mess.totalSeats || 50, Number(availableSeats)));
  mess.availableSeats = seats;
  saveDatabase(db);
  res.json({ success: true, mess });
});

// API: Update mess full profile / menu / notices
app.patch('/api/messes/:id', (req, res) => {
  const messIndex = db.messes.findIndex((m) => m.id === req.params.id);
  if (messIndex === -1) {
    res.status(404).json({ error: 'Mess not found' });
    return;
  }

  const updates = req.body;
  db.messes[messIndex] = {
    ...db.messes[messIndex],
    ...updates,
    id: db.messes[messIndex].id, // preserve ID
  };
  saveDatabase(db);
  res.json({ success: true, mess: db.messes[messIndex] });
});

// API: Student reviews
app.post('/api/messes/:id/reviews', (req, res) => {
  const { studentName, college, rating, comment } = req.body;
  const mess = db.messes.find((m) => m.id === req.params.id);
  if (!mess) {
    res.status(404).json({ error: 'Mess not found' });
    return;
  }

  if (!studentName || !comment || !rating) {
    res.status(400).json({ error: 'Student name, rating, and comment are required.' });
    return;
  }

  const numRating = Math.max(1, Math.min(5, Number(rating)));
  const newReview: Review = {
    id: 'rev-' + Date.now(),
    studentName: studentName.trim(),
    college: (college || 'College Student').trim(),
    rating: numRating,
    comment: comment.trim(),
    date: new Date().toISOString().split('T')[0],
  };

  mess.reviews.unshift(newReview);
  mess.reviewsCount = (mess.reviewsCount || 0) + 1;

  // Recalculate average rating
  const totalSum = mess.reviews.reduce((acc, r) => acc + r.rating, 0);
  mess.rating = Number((totalSum / mess.reviews.length).toFixed(1));

  saveDatabase(db);
  res.status(201).json({ success: true, review: newReview, mess });
});

// API: Owner reply to review
app.post('/api/messes/:id/reviews/:reviewId/reply', (req, res) => {
  const { reply } = req.body;
  const mess = db.messes.find((m) => m.id === req.params.id);
  if (!mess) {
    res.status(404).json({ error: 'Mess not found' });
    return;
  }

  const review = mess.reviews.find((r) => r.id === req.params.reviewId);
  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  review.ownerReply = reply ? reply.trim() : undefined;
  saveDatabase(db);
  res.json({ success: true, review });
});

// API: Student Inquiries / Trial bookings
app.post('/api/inquiries', (req, res) => {
  const { messId, studentName, phone, email, preferredPlan, preferredDate, notes } = req.body;
  if (!messId || !studentName || !phone) {
    res.status(400).json({ error: 'Mess, student name, and phone are required.' });
    return;
  }

  const mess = db.messes.find((m) => m.id === messId);
  const newInquiry: Inquiry = {
    id: 'inq-' + Date.now(),
    messId,
    messName: mess ? mess.name : 'Unknown Mess',
    studentName: studentName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : undefined,
    preferredPlan: preferredPlan || 'Trial Meal',
    preferredDate: preferredDate || new Date().toISOString().split('T')[0],
    status: 'Pending',
    createdAt: new Date().toISOString(),
    notes: notes ? notes.trim() : '',
  };

  db.inquiries.unshift(newInquiry);
  saveDatabase(db);
  res.status(201).json({ success: true, inquiry: newInquiry });
});

// API: Owner view inquiries
app.get('/api/inquiries', (req, res) => {
  const { messId } = req.query;
  if (messId && typeof messId === 'string') {
    const filtered = db.inquiries.filter((inq) => inq.messId === messId);
    res.json(filtered);
    return;
  }
  res.json(db.inquiries);
});

// API: Update inquiry status
app.patch('/api/inquiries/:id/status', (req, res) => {
  const { status } = req.body;
  const inquiry = db.inquiries.find((inq) => inq.id === req.params.id);
  if (!inquiry) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }

  if (['Pending', 'Contacted', 'Admitted'].includes(status)) {
    inquiry.status = status;
    saveDatabase(db);
    res.json({ success: true, inquiry });
    return;
  }
  res.status(400).json({ error: 'Invalid status' });
});

// API: Reset DB to default (convenience for demo testing)
app.post('/api/reset-data', (_req, res) => {
  db = {
    messes: JSON.parse(JSON.stringify(INITIAL_MESSES)),
    inquiries: [],
  };
  saveDatabase(db);
  res.json({ success: true, message: 'Data reset to initial 10 messes.' });
});

// API: Owner Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, messId } = req.body;

  // Find by messId or email
  let mess = db.messes.find((m) => m.id === messId || m.ownerEmail.toLowerCase() === (email || '').toLowerCase());

  if (!mess) {
    // If user provided a mess ID from demo selector, select that
    mess = db.messes[0];
  }

  const user = {
    id: 'user-' + mess.id,
    email: mess.ownerEmail,
    messId: mess.id,
    name: mess.ownerName,
    messName: mess.name,
    token: 'token-' + mess.id + '-' + Date.now(),
  };

  res.json({ success: true, user });
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
