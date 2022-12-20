const express = require('express');

const loginRouter = require('./routes/loginRoutes');
const talkerRouter = require('./routes/talkerRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.use('/login', loginRouter);
app.use('/talker', talkerRouter);

/* ============================= */

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Online');
});
