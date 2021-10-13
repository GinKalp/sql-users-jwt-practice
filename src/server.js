const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2/promise');
const {dbConfig, port, jwtSecret} = require('./config');
const usersRoute = require('../API/v1/users')
const postsRoute = require('../API/v1/posts')

const PORT = port || 3000;

const app = express();

// middleware
app.use(morgan('common'));
app.use(cors());
app.use(express.json());
app.use('/users', usersRoute)
app.use('/posts', postsRoute)

app.get('/', (req, res) => {
  res.send('Hello express');
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
