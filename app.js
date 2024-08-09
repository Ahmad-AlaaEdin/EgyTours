const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const { xss } = require('express-xss-sanitizer');
const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoute = require('./routes/userRoutes');
const tourRoute = require('./routes/tourRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const viewRoute = require('./routes/viewRoutes');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Global Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use(limiter);

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
    ],
  })
);

//Routes
app.use('/', viewRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/reviews', reviewRoute);
app.all('*', (req, res, next) => {
  /* const err = new Error(`Can not find ${req.originalUrl}`);
  err.statusCode = 404;
  err.status = 'fail';*/
  console.log('here');
  next(new AppError(`Can not find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
