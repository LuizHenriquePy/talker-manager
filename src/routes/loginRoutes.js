const express = require('express');

const loginRouter = express.Router();

const createToken = require('../utils/createToken');
const validateLogin = require('../middlewares/validateLogin');

loginRouter.post('/', validateLogin, (req, res) => {
  const token = createToken();
  return res.status(200).json({ token });
});

module.exports = loginRouter;
