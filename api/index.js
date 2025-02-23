const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Store in memory

app.post('/api/uri', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
    }

    try {
        const imageBuffer = req.file.buffer;
        const metadata = await sharp(imageBuffer).metadata();
        const format = metadata.format.toLowerCase();

        const base64Image = imageBuffer.toString('base64');
        const dataURI = `data:image/${format};base64,${base64Image}`;

        res.json({ base64_uri: dataURI });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Image processing failed' });
    }
});

// Vercel expects an app.listen in development, but will handle it in production.
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
}

module.exports = app;
