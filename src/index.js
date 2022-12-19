const express = require('express');
const path = require('path');
const { read, write } = require('./utils/functionsFS');
const createToken = require('./utils/createToken');
const validateLogin = require('./middlewares/validateLogin');
const validateTalkerRegistration = require('./middlewares/validateTalkerRegistration');
const validateToken = require('./middlewares/validateToken');
const idGenerator = require('./utils/idGenerator');

const filePath = path.resolve('src', 'talker.json');

const app = express();
app.use(express.json());

app.get('/talker', async (req, res) => {
  const data = await read(filePath);
  if (!data) return res.status(500).send('Erro na leitura do banco de dados');
  return res.status(200).json(data);
});

app.get('/talker/search', validateToken, async (req, res) => {
  const { q } = req.query;
  const talkers = await read(filePath);
  if (q === undefined || q === '') {
    return res.status(200).json(talkers);
  }
  const researchedTalkers = talkers.filter((talker) => talker.name.includes(q));
  return res.status(200).json(researchedTalkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await read(filePath);
  if (!data) return res.status(500).send('Erro na leitura do banco de dados');

  const person = data.find((p) => p.id === Number(id));
  if (!person) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(person);
});

app.post('/talker', validateToken, validateTalkerRegistration, async (req, res) => {
  const newTalker = { ...req.body };
  const talkers = await read(filePath);
  newTalker.id = await idGenerator();
  talkers.push(newTalker);
  await write(talkers, filePath);
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', validateToken, validateTalkerRegistration, async (req, res) => {
  let { id } = req.params;
  id = Number(id);
  const talkers = await read(filePath);
  const newTalker = { ...req.body, id };
  const newTalkers = talkers.map((talker) => {
    if (talker.id === id) {
      return newTalker;
    }
    return talker;
  });
  await write(newTalkers, filePath);
  return res.status(200).json(newTalker);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await read(filePath);
  const newTalkers = talkers.filter((talker) => talker.id !== Number(id));
  await write(newTalkers, filePath);
  return res.status(204).send();
});

app.post('/login', validateLogin, (req, res) => {
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
