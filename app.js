const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mustacheExpress = require('mustache-express');

const router = require('./routes/router');
const api_router = require('./routes/api');

const app = express();

app.engine('mustache', mustacheExpress());

app.set('views', './views');
app.set('view engine', 'mustache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
app.use('/api', api_router);

module.exports = app;
