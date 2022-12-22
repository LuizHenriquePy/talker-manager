const path = require('path');
const { read } = require('./functionsFS');

const filePath = path.resolve('src', 'talker.json');

const idGenerator = async () => {
  try {
    const talkers = await read(filePath);
    const arrayIds = talkers.map((e) => e.id);
    return Math.max(...arrayIds) + 1;
  } catch (error) {
    console.log('error when trying to generate id');
    console.log(error.message);
    return false;
  }
};

module.exports = idGenerator;
