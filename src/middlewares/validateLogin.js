const validar = (email, password, res) => {
  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < 6) { 
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' }); 
  }
};

const validateLoginMiddlewares = (req, res, next) => {
  const { email, password } = req.body;
  validar(email, password, res);
  if (!email.includes('@gmail.com') || !email.includes('@email.com')) {
    return res
      .status(400)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' }); 
  }
  next();
};

module.exports = validateLoginMiddlewares;