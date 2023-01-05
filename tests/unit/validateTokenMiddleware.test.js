const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;

const validateToken = require('../../src/middlewares/validateToken');

const functionJson = {
  json: (_json) => {},
};
const res = {
  status: (_code) => functionJson,
};
const next = sinon.spy();
const statusCode = 401;

describe('middleware validateToken', function () {
  it('token does not exist', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');
    const req = {
      headers: {},
    };

    validateToken(req, res, next);

    expect(spyJson.calledOnce).to.be.true;
    expect(spyStatus.calledOnce).to.be.true;
    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledWith(statusCode)).to.be.true;
    expect(spyJson.calledWith({ message: 'Token não encontrado' })).to.be.true;
    expect(next.notCalled).to.be.true;

    functionJson.json.restore();
    res.status.restore();
  });
  it('token is not a string', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');
    const req = {
      headers: {
        authorization: 123,
      },
    };

    validateToken(req, res, next);

    expect(spyJson.calledOnce).to.be.true;
    expect(spyStatus.calledOnce).to.be.true;
    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledWith(statusCode)).to.be.true;
    expect(spyJson.calledWith({ message: 'Token inválido' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('token is less than 16 characters', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');
    const req = {
      headers: {
        authorization: '1234567890',
      },
    };

    validateToken(req, res, next);

    expect(spyJson.calledOnce).to.be.true;
    expect(spyStatus.calledOnce).to.be.true;
    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledWith(statusCode)).to.be.true;
    expect(spyJson.calledWith({ message: 'Token inválido' })).to.be.true;
    expect(next.notCalled).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('token is valid', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');
    const req = {
      headers: {
        authorization: '1234567890123456',
      },
    };

    validateToken(req, res, next);

    expect(spyJson.notCalled).to.be.true;
    expect(spyStatus.notCalled).to.be.true;
    expect(next.calledOnce).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
});
