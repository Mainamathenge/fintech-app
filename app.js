const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const itemRouter = require('./routes/itemRoutes');
const viewController = require('./routes/viewRoutes');
const cartRouter = require('./routes/cartRoutes');
const tokenRouter = require('./routes/tokenRoutes');


const app = express();

// app.set('views', path.join(__dirname, 'views/static'));
// app.set('view engine', 'ejs');
// app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Development logging

// app.get('/',(req, res) => {
//   res.send("hello world ").status(200);
// } )
app.use('/',viewController);
app.use('/users',userRouter);
app.use('/items',itemRouter);
app.use('/cart',cartRouter);
//app.use('/token',tokenRouter);

// app.use(cartRouter)


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
module.exports = app;