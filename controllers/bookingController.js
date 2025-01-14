const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controllers/handlerFactory');
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const Stripe = require('stripe');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const stripe = await Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    mode: 'payment',
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100, // Price in cents
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    message: 'success',
    session,
  });
});

exports.createBookingCheckoout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getBooking = factory.getOne(Booking)
exports.getAllBooking = factory.getAll(Booking)
exports.updateBooking = factory.updateOne(Booking)
exports.createBooking = factory.createOne(Booking)
exports.deleteBooking = factory.deleteOne(Booking)