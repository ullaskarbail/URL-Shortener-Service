const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database (for simplicity)
// Structure: { [shortId]: { originalUrl, clicks, createdAt } }
const urlDatabase = {};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

// API: Shorten URL
app.post('/api/shorten', (req, res) => {
  const { originalUrl } = req.body;

  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL. Make sure it includes http:// or https://' });
  }

  // Generate a random 6-character hex string
  const shortId = crypto.randomBytes(3).toString('hex');
  urlDatabase[shortId] = {
    originalUrl,
    clicks: 0,
    createdAt: new Date().toISOString()
  };

  const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
  res.status(201).json({ originalUrl, shortUrl, shortId });
});

// API: Get Analytics/Stats
app.get('/api/stats', (req, res) => {
  // Return all shortened URLs with stats, sorted by newest first
  const stats = Object.entries(urlDatabase).map(([shortId, data]) => ({
    shortId,
    originalUrl: data.originalUrl,
    clicks: data.clicks,
    shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`,
    createdAt: data.createdAt
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(stats);
});

// API: Redirect from short ID to original URL
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const entry = urlDatabase[shortId];

  if (entry) {
    entry.clicks += 1; // Increment click counter
    res.redirect(entry.originalUrl);
  } else {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

// Start the server only if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Jest testing
module.exports = app;
