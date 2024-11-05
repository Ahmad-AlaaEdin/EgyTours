const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression')
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { xss } = require('express-xss-sanitizer');
const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoute = require('./routes/userRoutes');
const tourRoute = require('./routes/tourRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const viewRoutes = require('./routes/viewRoutes');
const bookingRoute = require('./routes/bookingRoutes');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


//Global Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        'script-src': [
          "'self'",
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
          'https://carto.com/attributions',
          'https://cdn.jsdelivr.net',
          'https://js.stripe.com/v3/',
          //'ws://127.0.0.1:56046',
        ],
        connectSrc: [
          "'self'",
          'http://127.0.0.1:8000',
          'https://api.stripe.com/',
          'ws://localhost:56046',
          'ws://127.0.0.1:56046',
          'ws://127.0.0.1:57232/', 
          'https://*',
        ],
        'frame-src': ['self', 'https://*.stripe.com'],
        'style-src': [
          "'self'",
          'https://*.googleapis.com',
          'https://unpkg.com',
          'https://carto.com/attributions',
          'https://js.stripe.com/v3/',
        ],
        'img-src': [
          "'self'",
          'data:',
          'https://*.openstreetmap.org',
          'https://unpkg.com',
          'https://server.arcgisonline.com',
          'https://carto.com/attributions',
          'https://*.basemaps.cartocdn.com',
          'https://upload.wikimedia.org',
        ],
      },
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(compression());
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
app.use('/', viewRoutes);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/booking', bookingRoute);
app.all('*', (req, res, next) => {
  /* const err = new Error(`Can not find ${req.originalUrl}`);
  err.statusCode = 404;
  err.status = 'fail';*/
  console.log('here');
  next(new AppError(`Can not find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
