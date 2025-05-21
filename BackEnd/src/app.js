const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const aiRoutes = require('./routes/ai.routes');
const aiCompiler = require('./routes/ai.compiler');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files'); // ✅ NEW

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/ai', aiRoutes);
app.use('/ai/compiler', aiCompiler);
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes); // ✅ ADD THIS

module.exports = app;
