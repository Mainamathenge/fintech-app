const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

//console.log(mongoose);

// Connection to a mongodb
//const link = process.env.DB_LINK;
// const DB = process.env.MONGODB_URL;
const DB = 'mongodb+srv://mainamathengej:AF1BqdbgAVACmKwC@cluster0.z7bnuf2.mongodb.net/?retryWrites=true&w=majority';
mongoose.set('strictQuery', false);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});