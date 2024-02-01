const express = require('express');
const router = express.Router();
const fileController = require('../controllers/FileController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

// routes
router.post('/uploads', upload.single('file'), fileController.uploadFile);
router.get('/filelist', fileController.getFiles);
router.get('/download/:filename', fileController.downloadFile);
router.delete('/delete/:filename', fileController.deleteFile);

module.exports = router;

