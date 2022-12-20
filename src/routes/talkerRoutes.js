const express = require('express');
const path = require('path');

const talkerRouter = express.Router();

const { read, write } = require('../utils/functionsFS');
const validateToken = require('../middlewares/validateToken');
const validateTalkerRegistration = require('../middlewares/validateTalkerRegistration');
const idGenerator = require('../utils/idGenerator');

const filePath = path.resolve('src', 'talker.json');

talkerRouter.get('/', async (req, res) => {
  const data = await read(filePath);
  if (!data) return res.status(500).send('Erro na leitura do banco de dados');
  return res.status(200).json(data);
});

talkerRouter.get('/search', validateToken, async (req, res) => {
  const { q } = req.query;
  const talkers = await read(filePath);
  if (q === undefined || q === '') {
    return res.status(200).json(talkers);
  }
  const researchedTalkers = talkers.filter((talker) => talker.name.includes(q));
  return res.status(200).json(researchedTalkers);
});

talkerRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await read(filePath);
  if (!data) return res.status(500).send('Erro na leitura do banco de dados');

  const person = data.find((p) => p.id === Number(id));
  if (!person) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(person);
});

talkerRouter.post('/', validateToken, validateTalkerRegistration, async (req, res) => {
  const newTalker = { ...req.body };
  const talkers = await read(filePath);
  newTalker.id = await idGenerator();
  talkers.push(newTalker);
  await write(talkers, filePath);
  return res.status(201).json(newTalker);
});

talkerRouter.put('/:id', validateToken, validateTalkerRegistration, async (req, res) => {
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

talkerRouter.delete('/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await read(filePath);
  const newTalkers = talkers.filter((talker) => talker.id !== Number(id));
  await write(newTalkers, filePath);
  return res.status(204).send();
});

module.exports = talkerRouter;