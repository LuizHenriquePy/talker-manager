const validateName = (name) => {
  if (!name) {
    return { message: 'O campo "name" é obrigatório', status: 400 };
  }
  if (name.length < 3) {
    return { message: 'O "name" deve ter pelo menos 3 caracteres', status: 400 };
  }
};

const validateAge = (age) => {
  if (!age) {
    return { message: 'O campo "age" é obrigatório', status: 400 };
  }
  if (age < 18) {
    return { message: 'A pessoa palestrante deve ser maior de idade', status: 400 };
  }
};

const validateWatchedAt = (watchedAt) => {
  if (!watchedAt) {
    return { message: 'O campo "watchedAt" é obrigatório', status: 400 };
  }

  if (watchedAt.length !== 10) {
    return { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"', status: 400 };
  }

  const day = watchedAt.slice(0, 2);
  const month = watchedAt.slice(3, 5);
  const year = watchedAt.slice(6, 10);

  if (!Date.parse(`${month}-${day}-${year}`)) {
    return { message: 'O campo "watchedAt" deve ter uma data válida no formato "dd/mm/aaaa"', status: 400 };
  }
};

const validateRate = (rate) => {
  if (rate === undefined) {
    return { message: 'O campo "rate" é obrigatório', status: 400 };
  }
  if (!Number.isInteger(rate) || (rate < 1 || rate > 5)) {
    return { message: 'O campo "rate" deve ser um inteiro de 1 à 5', status: 400 };
  }
};

const validateTalk = (talk) => {
  if (!talk) {
    return { message: 'O campo "talk" é obrigatório', status: 400 };
  }
  const { watchedAt, rate } = talk;
  const resRate = validateRate(rate);
  if (resRate) return resRate;
  const resWatchedAt = validateWatchedAt(watchedAt);
  if (resWatchedAt) return resWatchedAt;
};

const validateTalkerRegistration = (req, res, next) => {
  const { name, age, talk } = req.body;

  const validations = [
    validateName(name),
    validateAge(age),
    validateTalk(talk),
  ];

  const result = validations.find((e) => e);
  if (result) return res.status(result.status).json({ message: result.message });

  next();
};

module.exports = validateTalkerRegistration;
