const createToken = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVXWYZ0123456789';
  let token = '';
  for (let index = 0; index < 16; index += 1) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

module.exports = createToken;