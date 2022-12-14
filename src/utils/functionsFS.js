const fs = require('fs/promises');

async function read(path) {
  try {
    const data = await fs.readFile(path, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

async function write(newData, path) {
  try {
    await fs.writeFile(path, JSON.stringify(newData, null, 2));
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

module.exports = { read, write };