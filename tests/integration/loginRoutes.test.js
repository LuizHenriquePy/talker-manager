const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src/app');

const { expect } = chai;
chai.use(chaiHttp);

describe('route login', function() {
  describe('post /login', function() {
    it('returns a token with 16 characters', async function() {
      const response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'test@gmail.com',
          password: '123456'
        });
  
      expect(response.status).to.be.equal(200);
      expect(response.body).to.haveOwnProperty('token');
      expect(typeof response.body.token).to.be.equal('string')
      expect(response.body.token).to.have.lengthOf(16);
    });
  });
});
