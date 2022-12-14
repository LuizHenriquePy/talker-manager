const express = require('express');
const path = require('path');
const { read } = require('./utils/functionsFS');

const filePath = path.resolve('src', 'talker.json');

const app = express();
app.use(express.json());

app.get('/talker', async (req, res) => {
  const data = await read(filePath);
  if (!data) return res.status(500).send('Erro na leitura do banco de dados');
  return res.status(200).json(data);
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
