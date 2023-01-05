const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;

const validateLoginMiddlewares = require('../../src/middlewares/validateLogin');

const functionJson = {
  json: (_json) => {},
};
const res = {
  status: (_code) => functionJson,
};
const next = sinon.spy();
const statusCode = 400;

describe('middleware validateToken', function () {
  it('email field does not exist', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');
    const req = {
      body: {
        password: '123456',
      },
    };

    validateLoginMiddlewares(req, res, next);

    expect(spyJson.calledOnce).to.be.true;
    expect(spyStatus.calledOnce).to.be.true;
    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledWith(statusCode)).to.be.true;
    expect(spyJson.calledWith({ message: 'O campo "email" é obrigatório' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('password field does not exist', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');
    const req = {
      body: {
        email: 'test@gmail.com',
      },
    };

    validateLoginMiddlewares(req, res, next);

    expect(spyJson.calledOnce).to.be.true;
    expect(spyStatus.calledOnce).to.be.true;
    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledWith(statusCode)).to.be.true;
    expect(spyJson.calledWith({ message: 'O campo "password" é obrigatório' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('email field with invalid format', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');
    const req = {
      body: {
        email: 'gmail.test@com',
        password: '123456',
      },
    };

    validateLoginMiddlewares(req, res, next);

    expect(spyJson.calledOnce).to.be.true;
    expect(spyStatus.calledOnce).to.be.true;
    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledWith(statusCode)).to.be.true;
    expect(spyJson.calledWith({ message: 'O "email" deve ter o formato "email@email.com"' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('password field with invalid format', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');
    const req = {
      body: {
        email: 'test@gmail.com',
        password: '1234',
      },
    };

    validateLoginMiddlewares(req, res, next);

    expect(spyJson.calledOnce).to.be.true;
    expect(spyStatus.calledOnce).to.be.true;
    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledWith(statusCode)).to.be.true;
    expect(spyJson.calledWith({ message: 'O "password" deve ter pelo menos 6 caracteres' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('email and password fields are valid', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');
    const req = {
      body: {
        email: 'test@gmail.com',
        password: '123456',
      },
    };

    validateLoginMiddlewares(req, res, next);

    expect(spyJson.notCalled).to.be.true;
    expect(spyStatus.notCalled).to.be.true;
    expect(next.calledOnce).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
});
