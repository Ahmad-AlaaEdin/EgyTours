const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoute = require('./routes/userRoutes');
const tourRoute = require('./routes/tourRoutes');
const app = express();
app.use(express.json());
app.use(morgan('dev'));
//Routes
app.use((req, res, next) => {
  console.log(req.headers);
  next();
});
app.use('/api/v1/users', userRoute);
app.use('/api/v1/tours', tourRoute);

app.all('*', (req, res, next) => {
  /* const err = new Error(`Can not find ${req.originalUrl}`);
  err.statusCode = 404;
  err.status = 'fail';*/
  console.log('here');
  next(new AppError('Can not find ${req.originalUrl}', 404));
});

app.use(globalErrorHandler);

module.exports = app;
