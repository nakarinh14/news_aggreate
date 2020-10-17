require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const logger = require('morgan');
const passport = require('passport')
const session = require('express-session');
require('./passport-config')(passport);

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const newsRouter = require('./routes/news');
const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);
app.use('/auth',authRouter);
app.use('/api/news', newsRouter);

module.exports = app;
