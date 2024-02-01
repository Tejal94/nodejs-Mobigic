const File = require('../models/File');
const path = require('path');
const fs = require('fs');

const codeGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

const uploadFile = async (req, res) => {
  try {
    const { size, filename } = req.file;
    const accessCode = codeGenerator();
    const filePath = path.join(__dirname, '../uploads', filename);

    const newFile = new File({
      filename,
      size,
      filePath,
      accessCode
    });

    await newFile.save();

    res.json({ msg: 'File uploaded successfully', file: newFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getFiles = async (req, res) => {
    try {
        const uploadPath = path.join(__dirname, '../uploads');
    
        fs.readdir(uploadPath, (err, files) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
    
          const fileList = files.map((filename) => ({ filename }));
    
          res.json({ files: fileList });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const downloadFile = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
  
    //validatoion
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) {
        console.error(err);
        return res.status(404).json({ error: 'File not found' });
      }
  
      //headers
      res.setHeader('Content-disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-type', 'application/octet-stream');
  
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  };

  const deleteFile = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(err);
        return res.status(404).json({ error: 'File not found' });
      }
  
      fs.unlink(filePath, (unlinkError) => {
        if (unlinkError) {
          console.error(unlinkError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json({ msg: 'File deleted successfully' });
      });
    });
  };

module.exports = {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile
};
