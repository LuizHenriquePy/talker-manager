const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs/promises');
const path = require('path');
const { read, write } = require('../../src/utils/functionsFS');

const filePath = path.resolve('src', 'talker.json');
const { expect } = chai;

const mockFile = [
  {
    name: 'Henrique Albuquerque',
    age: 62,
    id: 1,
    talk: {
      watchedAt: '23/10/2020',
      rate: 5,
    },
  },
  {
    name: 'Heloísa Albuquerque',
    age: 67,
    id: 2,
    talk: {
      watchedAt: '23/10/2020',
      rate: 5,
    },
  },
];

describe('function functionsFS', function () {
  beforeEach(function () {
    sinon.stub(console, 'log');
  });

  afterEach(function () {
    sinon.restore();
  });
  describe('function read', function () {
    it('error reading file', async function () {
      const stubReadFile = sinon.stub(fs, 'readFile').rejects();

      const result = await read(filePath);

      expect(result).to.be.false;
      expect(stubReadFile.calledOnce).to.be.true;
      expect(stubReadFile.calledWith(filePath, 'utf8')).to.be.true;
    });
    it('success in reading the file', async function () {
      const stubReadFile = sinon.stub(fs, 'readFile').resolves(JSON.stringify(mockFile));

      const result = await read(filePath);

      expect(result).to.deep.equal(mockFile);
      expect(stubReadFile.calledOnce).to.be.true;
      expect(stubReadFile.calledWith(filePath, 'utf8')).to.be.true;
    });
  });
  describe('function write', function () {
    it('error writing file', async function () {
      const stubWriteFile = sinon.stub(fs, 'writeFile').rejects();

      const result = await write(mockFile, filePath);

      expect(result).to.be.false;
      expect(stubWriteFile.calledOnce).to.be.true;
      expect(stubWriteFile.calledWith(filePath, JSON.stringify(mockFile, null, 2))).to.be.true;
    });
    it('file write success', async function () {
      const stubWriteFile = sinon.stub(fs, 'writeFile').resolves();

      const result = await write(mockFile, filePath);

      expect(result).to.be.true;
      expect(stubWriteFile.calledOnce).to.be.true;
      expect(stubWriteFile.calledWith(filePath, JSON.stringify(mockFile, null, 2))).to.be.true;
    });
  });
});
