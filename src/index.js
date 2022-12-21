const express = require('express');

const loginRouter = require('./routes/loginRoutes');
const talkerRouter = require('./routes/talkerRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.use('/login', loginRouter);
app.use('/talker', talkerRouter);

app.use(errorHandler);

app.listen('3000', () => {
  console.log('Online');
});
