const validateLoginMiddlewares = (req, res, next) => {
  const { email, password } = req.body;
  const ifs = [
    { message: 'O campo "email" é obrigatório', conditional: !email },
    { message: 'O campo "password" é obrigatório', conditional: !password },
    {
      message: 'O "email" deve ter o formato "email@email.com"',
      conditional: email ? !(email.includes('@gmail.com') || email.includes('@email.com')) : false,
    },
    {
      message: 'O "password" deve ter pelo menos 6 caracteres',
      conditional: (password ? (password.length < 6) : false),
    },
  ];
  const cond = ifs.find(({ conditional }) => conditional);
  if (cond) return res.status(400).json({ message: cond.message });
  next();
};

module.exports = validateLoginMiddlewares;
