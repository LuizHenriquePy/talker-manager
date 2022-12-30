const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const fs = require('fs/promises');

const app = require('../../src/app');

const { expect } = chai;
chai.use(chaiHttp);

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

describe('routes talker', function () {
  beforeEach(function () {
    sinon.stub(fs, 'readFile').resolves(JSON.stringify(mockFile));
    sinon.stub(fs, 'writeFile').resolves();
  });

  afterEach(function () {
    sinon.restore();
  });
  describe('get /talker', function () {
    it('returns an array with talkers', async function () {
      const response = await chai.request(app).get('/talker');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(2);
      expect(response.body).to.deep.equal(mockFile);
    });
  });
  describe('get /talker/search', function () {
    it('returns error when not passing the token', async function () {
      const response = await chai.request(app).get('/talker/search');

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token não encontrado');
    });
    it('returns error when passing invalid token less than 16 characters', async function () {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'asdasd');

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token inválido');
    });
    it('returns error when passing token that is not a string', async function () {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', ['adasdsdad']);

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token inválido');
    });
    it('returns all talkers', async function () {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'loejdoensotuuedh')
        .query({ q: '' });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(2);
      expect(response.body).to.deep.equal(mockFile);
    });
    it('return a talker', async function () {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'loejdoensotuuedh')
        .query({ q: 'Hen' });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(1);
      expect(response.body).to.deep.equal([mockFile[0]]);
    });
    it('return two talker', async function () {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'loejdoensotuuedh')
        .query({ q: 'He' });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(2);
      expect(response.body).to.deep.equal(mockFile);
    });
    it('returns an empty array', async function () {
      const response = await chai
        .request(app)
        .get('/talker/search')
        .set('Authorization', 'loejdoensotuuedh')
        .query({ q: 'test' });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Array);
      expect(response.body).to.have.lengthOf(0);
      expect(response.body).to.deep.equal([]);
    });
  });
  describe('get /talker/:id', function () {
    it('return talker not found', async function () {
      const response = await chai.request(app).get('/talker/34');

      expect(response.status).to.be.equal(404);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Pessoa palestrante não encontrada');
    });
    it('return a talker', async function () {
      const response = await chai.request(app).get('/talker/2');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.instanceOf(Object);
      expect(response.body).to.deep.equal(mockFile[1]);
    });
  });
  describe('post /talker', function () {
    it('returns error when not passing the token', async function () {
      const response = await chai
        .request(app)
        .post('/talker');

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token não encontrado');
    });
    it('returns error when passing invalid token less than 16 characters', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '12345');

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token inválido');
    });
    it('returns error when passing token that is not a string', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', ['adasdsdad']);

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token inválido');
    });
    it('returns error because name field is missing', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          age: 18,
          talk: {
            watchedAt: '01/01/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "name" é obrigatório');
    });
    it('returns error because name field is less than 3 characters', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'ab',
          age: 18,
          talk: {
            watchedAt: '01/01/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O "name" deve ter pelo menos 3 caracteres');
    });
    it('returns error because age field is missing', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          talk: {
            watchedAt: '01/01/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "age" é obrigatório');
    });
    it('returns error because the talker is under 18 years old', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 17,
          talk: {
            watchedAt: '01/01/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('A pessoa palestrante deve ser maior de idade');
    });
    it('returns error because the watchedAt field is missing', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "watchedAt" é obrigatório');
    });
    it('returns error because the watchedAt field needs to be in mm/dd/yyy format', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '0/30/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "watchedAt" deve ter o formato "dd/mm/aaaa"');
    });
    it('returns error because the watchedAt field needs to have a valid date', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '30/30/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message)
        .to.be.equal('O campo "watchedAt" deve ter uma data válida no formato "dd/mm/aaaa"');
    });
    it('returns error because rate field is missing', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '12/12/2012',
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "rate" é obrigatório');
    });
    it('returns error because the rate field must be an integer from 1 to 5', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '12/12/2012',
            rate: 7,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "rate" deve ser um inteiro de 1 à 5');
    });
    it('returns error because the talk field is missing', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "talk" é obrigatório');
    });
    it('returns success when registering a new talker', async function () {
      const response = await chai
        .request(app)
        .post('/talker')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '12/12/2012',
            rate: 5,
          },
        });

      expect(response.status).to.be.equal(201);
      expect(response.body).to.deep.equal({
        name: 'abc',
        age: 18,
        id: 3,
        talk: {
          watchedAt: '12/12/2012',
          rate: 5,
        },
      });
    });
  });
  describe('put /talker/:id', function () {
    it('returns error when not passing the token', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1');

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token não encontrado');
    });
    it('returns error when passing invalid token less than 16 characters', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '12345');

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token inválido');
    });
    it('returns error when passing token that is not a string', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', ['adasdsdad']);

      expect(response.status).to.be.equal(401);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('Token inválido');
    });
    it('returns error because name field is missing', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          age: 18,
          talk: {
            watchedAt: '01/01/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "name" é obrigatório');
    });
    it('returns error because name field is less than 3 characters', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'ab',
          age: 18,
          talk: {
            watchedAt: '01/01/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O "name" deve ter pelo menos 3 caracteres');
    });
    it('returns error because age field is missing', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          talk: {
            watchedAt: '01/01/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "age" é obrigatório');
    });
    it('returns error because the talker is under 18 years old', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 17,
          talk: {
            watchedAt: '01/01/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('A pessoa palestrante deve ser maior de idade');
    });
    it('returns error because the watchedAt field is missing', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "watchedAt" é obrigatório');
    });
    it('returns error because the watchedAt field needs to be in mm/dd/yyy format', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '0/30/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "watchedAt" deve ter o formato "dd/mm/aaaa"');
    });
    it('returns error because the watchedAt field needs to have a valid date', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '30/30/2000',
            rate: 3,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message)
        .to.be.equal('O campo "watchedAt" deve ter uma data válida no formato "dd/mm/aaaa"');
    });
    it('returns error because rate field is missing', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '12/12/2012',
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "rate" é obrigatório');
    });
    it('returns error because the rate field must be an integer from 1 to 5', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '12/12/2012',
            rate: 7,
          },
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "rate" deve ser um inteiro de 1 à 5');
    });
    it('returns error because the talk field is missing', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('O campo "talk" é obrigatório');
    });
    it('returns talker not found when sending non-existing id ', async function () {
      const response = await chai
        .request(app)
        .put('/talker/10')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '12/12/2012',
            rate: 5,
          },
        });

      expect(response.status).to.be.equal(404);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.be.equal('talker not found');
    });
    it('returns success when registering a new talker', async function () {
      const response = await chai
        .request(app)
        .put('/talker/1')
        .set('Authorization', '1234567890123456')
        .send({
          name: 'abc',
          age: 18,
          talk: {
            watchedAt: '12/12/2012',
            rate: 5,
          },
        });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({
        name: 'abc',
        age: 18,
        id: 1,
        talk: {
          watchedAt: '12/12/2012',
          rate: 5,
        },
      });
    });
  });
});
