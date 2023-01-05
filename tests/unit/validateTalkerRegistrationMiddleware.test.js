const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;

const validateTalkerRegistration = require('../../src/middlewares/validateTalkerRegistration');

const functionJson = {
  json: (_json) => {},
};
const res = {
  status: (_code) => functionJson,
};
const next = sinon.spy();
const statusCode = 400;

describe('middleware validateTalkerRegistration', function () {
  afterEach(function () {
    sinon.restore();
  });
  it('campo name não existe', function () {
    const req = {
      body: {
        age: 21,
        talk: {
          watchedAt: '12/12/2012',
          rate: 4,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O campo "name" é obrigatório' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo name é menor que 3 caractares', function () {
    const req = {
      body: {
        name: 'ab',
        age: 21,
        talk: {
          watchedAt: '12/12/2012',
          rate: 4,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O "name" deve ter pelo menos 3 caracteres' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo age não existe', function () {
    const req = {
      body: {
        name: 'abc',
        talk: {
          watcheAt: '12/12/2012',
          rate: 4,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O campo "age" é obrigatório' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo age é menor de 18', function () {
    const req = {
      body: {
        name: 'abc',
        age: 17,
        talk: {
          watchedAt: '12/12/2012',
          rate: 4,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'A pessoa palestrante deve ser maior de idade' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo watchedAt não existe', function () {
    const req = {
      body: {
        name: 'abc',
        age: 18,
        talk: {
          rate: 4,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O campo "watchedAt" é obrigatório' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo watchedAt tem um formato invalido', function () {
    const req = {
      body: {
        name: 'abc',
        age: 18,
        talk: {
          watchedAt: '12122012',
          rate: 4,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo watchead tem data invalida', function () {
    const req = {
      body: {
        name: 'abc',
        age: 18,
        talk: {
          watchedAt: '12/30/2012',
          rate: 4,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O campo "watchedAt" deve ter uma data válida no formato "dd/mm/aaaa"' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo rate não existe', function () {
    const req = {
      body: {
        name: 'abc',
        age: 18,
        talk: {
          watchedAt: '12/12/2012',
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O campo "rate" é obrigatório' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo rate não é um inteiro', function () {
    const req = {
      body: {
        name: 'abc',
        age: 18,
        talk: {
          watchedAt: '12/12/2012',
          rate: 0.3,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo rate não está entre 1 e 5', function () {
    const req = {
      body: {
        name: 'abc',
        age: 18,
        talk: {
          watchedAt: '12/12/2012',
          rate: 6,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('campo talk não existe', function () {
    const req = {
      body: {
        name: 'abc',
        age: 18,
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledOnceWith(statusCode)).to.be.true;
    expect(spyJson.calledOnceWith({ message: 'O campo "talk" é obrigatório' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('talker registrado com sucesso', function () {
    const req = {
      body: {
        name: 'abc',
        age: 18,
        talk: {
          watchedAt: '12/12/2012',
          rate: 3,
        },
      },
    };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    validateTalkerRegistration(req, res, next);

    expect(spyStatus.notCalled).to.be.true;
    expect(spyJson.notCalled).to.be.true;
    expect(next.calledOnce).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
});
