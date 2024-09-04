const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const cors = require('cors');
const {Connection}=require("./connection")
const userrouter =require('./routes/user');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://localhost/3000',
    credentials: true
  }));
app.use(express.urlencoded({extended: true}));
Connection();

app.use('/user', userrouter);

// app.use('/query', auth , queryrouter);