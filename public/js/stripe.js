import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51Q3jh4052H3vHucoEZEINE61uhbigQwOzz3jtBSK0PYROeJ1cRz7SZoOLX9eCDNiYxdBKwQ5iv4VeQeaPbIaogOK00NYOsphUy'
);

export const bookTour = async (tourId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`,
    });

    await stripe.redirectToCheckout({
      sessionId: res.data.session.id,
    });
  } catch (err) {
    showAlert(err);
    console.log(err);
  }
};
