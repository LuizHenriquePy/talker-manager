const chai = require('chai');
const { afterEach } = require('mocha');
const sinon = require('sinon');

const { expect } = chai;

const errorHandler = require('../../src/middlewares/errorHandler');

const functionJson = {
  json: (_json) => {},
};
const req = {};
const res = {
  status: (_code) => functionJson,
};
const next = {};

describe('middleware errorHandler', function () {
  beforeEach(function () {
    sinon.stub(console, 'log');
  });
  afterEach(function () {
    sinon.restore();
  });
  it('use modified arguments', function () {
    const error = { message: 'test test', status: 303 };
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    errorHandler(error, req, res, next);

    expect(spyJson.calledOnce).to.be.true;
    expect(spyStatus.calledOnce).to.be.true;
    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledWith(error.status)).to.be.true;
    expect(spyJson.calledWith({ message: error.message })).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
  it('use default arguments', function () {
    const spyStatus = sinon.spy(res, 'status');
    const spyJson = sinon.spy(functionJson, 'json');

    errorHandler({}, req, res, next);

    expect(spyJson.calledOnce).to.be.true;
    expect(spyStatus.calledOnce).to.be.true;
    expect(spyStatus.calledBefore(spyJson)).to.be.true;
    expect(spyStatus.calledWith(500)).to.be.true;
    expect(spyJson.calledWith({ message: 'Something went wrong' })).to.be.true;
    functionJson.json.restore();
    res.status.restore();
  });
});
