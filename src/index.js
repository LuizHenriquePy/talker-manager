const express = require('express');
const path = require('path');
const { read } = require('./utils/functionsFS');
const createToken = require('./utils/createToken');
const validateLoginMiddlewares = require('./middlewares/validateLogin');

const filePath = path.resolve('src', 'talker.json');

const app = express();
app.use(express.json());

app.get('/talker', async (req, res) => {
  const data = await read(filePath);
  if (!data) return res.status(500).send('Erro na leitura do banco de dados');
  return res.status(200).json(data);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await read(filePath);
  if (!data) return res.status(500).send('Erro na leitura do banco de dados');

  const person = data.find((p) => p.id === Number(id));
  if (!person) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(person);
});

app.post('/login', validateLoginMiddlewares, (req, res) => {
  const token = createToken();
  return res.status(200).json({ token });
});

/* ============================= */

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
