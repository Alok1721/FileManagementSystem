const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    // Renaming to include timestamps
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// // Set view engine
// app.set('view engine', 'ejs'); --> for using simple views folder instead of frontend

// Set the views folder to 'frontend'
app.set('views', path.join(__dirname, 'frontend'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Home page route 
app.get('/', (req, res) => {
  // List files
  fs.readdir('public/uploads', (err, files) => {
    if (err) {
      return res.send('Error reading directory');
    }
    res.render('index', { files: files });
  });
});

// File upload Route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: 'No file uploaded.' });
      }
      res.json({ success: true, message: 'File uploaded successfully!', filename: req.file.filename });
    });

// Fiel Del handle Route
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

// File Downlaod Route
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('public/uploads', filename);
  
  res.download(filePath, filename, (err) => {
    if (err) {
      return res.send('Error downloading file');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
