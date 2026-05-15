const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database (for simplicity)
const urlDatabase = {};

// Helper to validate URL
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
  urlDatabase[shortId] = originalUrl;

  const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
  res.status(201).json({ originalUrl, shortUrl, shortId });
});

// API: Redirect from short ID to original URL
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const originalUrl = urlDatabase[shortId];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

// Start the server only if run directly (not imported for tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Jest testing
module.exports = app;
