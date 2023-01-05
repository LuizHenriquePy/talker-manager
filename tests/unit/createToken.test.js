const { expect } = require('chai');
const createToken = require('../../src/utils/createToken');

describe('Function createToken', function () {
  it('returns a token with 16 characters', function () {
    const token = createToken();
    expect(token).to.be.a('string');
    expect(token).to.have.lengthOf(16);
  });
});
