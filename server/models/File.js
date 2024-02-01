const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      filePath: {
        type: String,
        required: true,
      },
      accessCode: {
        type: String,
        required: true,
        unique: true,
      },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;