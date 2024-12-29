const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

const db = process.env.DATABASE;
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

mongoose.connect(db).then((con) => {
  console.log('Connect success');
});

const port = 3000;
const server = app.listen(port, () => {
  console.log('app running');
});
