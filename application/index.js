const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store files in the 'public/uploads' directory
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    // Rename file to ensure uniqueness (with timestamp)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// // Set view engine
// app.set('view engine', 'ejs'); --> for using simple views folder instead of frontend

// Set the views folder to 'frontend'
app.set('views', path.join(__dirname, 'frontend'));
app.set('view engine', 'ejs');


// Serve static files from 'public' folder (uploads)
app.use(express.static('public'));

// Home route with file upload form and file list
app.get('/', (req, res) => {
  // List all files in 'uploads' folder
  fs.readdir('public/uploads', (err, files) => {
    if (err) {
      return res.send('Error reading directory');
    }
    res.render('index', { files: files });
  });
});

// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.send('No file uploaded.');
  }
  res.render('success', { filename: req.file.filename });
});

// Route to handle file deletion
app.get('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('public/uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.send('Error deleting file');
    }
    res.redirect('/');
  });
});

// Route to handle file download
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('public/uploads', filename);
  
  res.download(filePath, filename, (err) => {
    if (err) {
      return res.send('Error downloading file');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
