const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const idGenerator = require('../../src/utils/idGenerator');
const functionsFS = require('../../src/utils/functionsFS');

const { expect } = chai;
const filePath = path.resolve('src', 'talker.json');
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

describe('function idGenerator', function () {
  beforeEach(function () {
    sinon.stub(console, 'log');
  });

  afterEach(function () {
    sinon.restore();
  });
  it('Error generating id', async function () {
    const stubRead = sinon.stub(functionsFS, 'read').rejects();

    const result = await idGenerator();

    expect(result).to.be.false;
    expect(stubRead.calledOnceWith(filePath)).to.be.true;
  });
  it('successfully generate id', async function () {
    const stubRead = sinon.stub(functionsFS, 'read').resolves(mockFile);

    const result = await idGenerator();

    expect(result).to.be.equal(3);
    expect(stubRead.calledOnceWith(filePath)).to.be.true;
  });
});
