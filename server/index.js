const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 5000;

require('dotenv').config();

const userRoutes = require('./routes/UserRoutes');
const fileRoutes = require('./routes/FileRoutes')

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

mongoose.connect('mongodb://localhost:27017/FilesSys', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(() => {
    console.log('Database Connected...')
})
.then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    })
})