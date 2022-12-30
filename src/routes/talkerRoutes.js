const express = require('express');
const path = require('path');

const talkerRouter = express.Router();
const filePath = path.resolve('src', 'talker.json');

const { read, write } = require('../utils/functionsFS');
const validateToken = require('../middlewares/validateToken');
const validateTalkerRegistration = require('../middlewares/validateTalkerRegistration');
const idGenerator = require('../utils/idGenerator');

const ERROR_MESSAGE_READ = 'Erro na leitura do banco de dados';

talkerRouter.get('/', async (req, res, next) => {
  try {
    const data = await read(filePath);
    if (!data) throw new Error(ERROR_MESSAGE_READ);
    return res.status(200).json(data);
  } catch (error) {
    next({ message: error.message });
  }
});

talkerRouter.get('/search', validateToken, async (req, res, next) => {
  try {
    const { q } = req.query;
    const talkers = await read(filePath);
    if (!talkers) throw new Error(ERROR_MESSAGE_READ);
    if (q === undefined || q === '') {
      return res.status(200).json(talkers);
    }
    const researchedTalkers = talkers.filter((talker) => talker.name.includes(q));
    return res.status(200).json(researchedTalkers);
  } catch (error) {
    next({ message: error.message });
  }
});

talkerRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await read(filePath);
    if (!data) throw new Error(ERROR_MESSAGE_READ);
    const person = data.find((p) => p.id === Number(id));
    if (!person) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    return res.status(200).json(person);
  } catch (error) {
    next({ message: error.message });
  }
});

talkerRouter.post('/', validateToken, validateTalkerRegistration, async (req, res, next) => {
  try {
    const newTalker = { ...req.body };
    const talkers = await read(filePath);
    if (!talkers) throw new Error(ERROR_MESSAGE_READ);
    newTalker.id = await idGenerator();
    if (!newTalker.id) throw new Error('Erro ao gerar id');
    talkers.push(newTalker);
    const result = await write(talkers, filePath);
    if (!result) throw new Error('Erro na escrita do banco de dados');
    return res.status(201).json(newTalker);
  } catch (error) {
    next({ message: error.message });
  }
});

talkerRouter.put('/:id', validateToken, validateTalkerRegistration, async (req, res, next) => {
  try {
    let { id } = req.params;
    id = Number(id);
    const talkers = await read(filePath);
    if (!talkers) throw new Error(ERROR_MESSAGE_READ);
    const isAnExistingId = talkers.some((talker) => talker.id === id);
    if (!isAnExistingId) return res.status(404).json({ message: 'talker not found' });
    const newTalker = { ...req.body, id };
    const newTalkers = talkers.map((talker) => {
      if (talker.id === id) {
        return newTalker;
      }
      return talker;
    });
    const result = await write(newTalkers, filePath);
    if (!result) throw new Error('Erro na escrita do banco de dados');
    return res.status(200).json(newTalker);
  } catch (error) {
    next({ message: error.message });
  }
});

talkerRouter.delete('/:id', validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const talkers = await read(filePath);
    if (!talkers) throw new Error(ERROR_MESSAGE_READ);
    const newTalkers = talkers.filter((talker) => talker.id !== Number(id));
    const result = await write(newTalkers, filePath);
    if (!result) throw new Error('Erro na escrita do banco de dados');
    return res.status(204).send();
  } catch (error) {
    next({ message: error.message });
  }
});

module.exports = talkerRouter;
