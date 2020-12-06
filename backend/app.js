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

app.disable('etag');
app.use(cors({credentials: true, origin: process.env.WEBSERVER}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('trust proxy', 1)
app.use(session({
    store: new (require('connect-pg-simple')(session))(),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // add this line
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
    } // 30 days
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);
app.use('/auth',authRouter);
app.use('/api/news', newsRouter);

module.exports = app;
