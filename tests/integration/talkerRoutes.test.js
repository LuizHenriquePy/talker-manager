const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const fs = require('fs/promises');

const app = require('../../src/app');

const { expect } = chai;
chai.use(chaiHttp);

const mockFile = [
  {
    name: "Henrique Albuquerque",
    age: 62,
    id: 1,
    talk: {
      watchedAt: "23/10/2020",
      rate: 5
    }
  },
  {
    name: "Heloísa Albuquerque",
    age: 67,
    id: 2,
    talk: {
      watchedAt: "23/10/2020",
      rate: 5
    }
  }
];

describe('routes talker', function() {
  beforeEach(function() {
    sinon.stub(fs, 'readFile').resolves(JSON.stringify(mockFile));
  })

  afterEach(function() {
    sinon.restore();
  })
  describe('get /talker', function() {
    it('returns an array with talkers', async function() {
      const response = await chai.request(app).get('/talker');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(2);
      expect(response.body).to.deep.equal(mockFile);
    });
  });
  describe('get /talker/search', function() {
    it('returns error when not passing the token', async function() {
      const response = await chai.request(app).get('/talker/search');

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token não encontrado');
    });
    it('returns error when passing invalid token less than 16 characters', async function() {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'asdasd');
      
      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token inválido');
    });
    it('returns error when passing token that is not a string', async function(){
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', ['adasdsdad']);

        expect(response.status).to.be.equal(401);
        expect(response.body).to.haveOwnProperty('message');
        expect(response.body.message).to.be.equal('Token inválido');
    });
    it('returns all talkers', async function() {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'loejdoensotuuedh')
        .query({q:''});

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(2);
      expect(response.body).to.deep.equal(mockFile);
    });
    it('return a talker', async function() {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'loejdoensotuuedh')
        .query({q:'Hen'});

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(1);
      expect(response.body).to.deep.equal([mockFile[0]]);
    });
    it('return two talker', async function() {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'loejdoensotuuedh')
        .query({q:'He'});

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(2);
      expect(response.body).to.deep.equal(mockFile);
    });
    it('returns an empty array', async function() {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'loejdoensotuuedh')
        .query({q:'test'});

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(0);
      expect(response.body).to.deep.equal([]);
    });
  });
  describe('get /talker/:id', function() {
    it('return talker not found', async function() {
      const response = await chai.request(app).get('/talker/34');

      expect(response.status).to.be.equal(404);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Pessoa palestrante não encontrada');
    });
    it('return a talker', async function() {
      const response = await chai.request(app).get('/talker/2');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Object);
      expect(response.body).to.deep.equal(mockFile[1]);
    });
  });
});