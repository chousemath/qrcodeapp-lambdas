const chai = require('chai');
const chaiHttp = require('chai-http');
const { assert } = require('chai')
const faker = require('faker');
const { config } = require('../config');

const fakeQRCodeScan = () => {
  return {
    category: Math.round(Math.random()) + 1,
    code: faker.lorem.paragraph(),
    longitude: faker.address.longitude(),
    latitude: faker.address.latitude(),
    location: faker.company.companyName(),
  };
};

let row;
const root = `${config.rootURLDev}/qrcodescans`;
let rowCount;

chai.use(chaiHttp);
describe('QRCodeScans', () => {
  describe('/qrcodescans - GET', () => {
    it('it should GET all the qr code scans', (done) => {
      chai.request(root)
        .get('/')
        .end((err, res) => {
          assert.equal(res.status, 200);
          res = res.body;
          assert.equal(res.statusCode, 200);
          assert.isTrue(res.body.ok);
          assert.isArray(res.body.data);
          assert.isTrue(res.body.data.length > 0);
          row = res.body.data[Math.floor(Math.random() * res.body.data.length)];
          rowCount = res.body.data.length;
          assert.ok(row.id);
          done();
        });
    });
  });
  describe('/qrcodescans - POST', () => {
    it('it should create a new qr code scan', (done) => {
      chai.request(root)
        .post('/')
        .send(fakeQRCodeScan())
        .end((err, res) => {
          assert.equal(res.status, 200);
          res = res.body;
          assert.equal(res.statusCode, 200);
          assert.isTrue(res.body.ok);
          done();
        });
    });
  });
  describe('/qrcodescans - GET after POST', () => {
    it('it should GET all the qr code scans (including the new one)', (done) => {
      chai.request(root)
        .get('/')
        .end((err, res) => {
          assert.equal(res.status, 200);
          res = res.body;
          assert.equal(res.statusCode, 200);
          assert.isTrue(res.body.ok);
          assert.isArray(res.body.data);
          assert.isTrue(res.body.data.length > 0);
          row = res.body.data[Math.floor(Math.random() * res.body.data.length)];
          assert.equal(res.body.data.length, rowCount + 1);
          rowCount = res.body.data.length;
          assert.ok(row.id);
          done();
        });
    });
  });
  describe('/qrcodescans/:id - GET', () => {
    it('it should GET a single qr code scan', (done) => {
      chai.request(root)
        .get(`/${row.id}?timestamp=${row.timestamp}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          res = res.body;
          assert.equal(res.statusCode, 200);
          assert.isTrue(res.body.ok);
          assert.equal(res.body.data.id, row.id);
          assert.equal(res.body.data.latitude, row.latitude);
          assert.equal(res.body.data.longitude, row.longitude);
          assert.equal(res.body.data.category, row.category);
          assert.equal(res.body.data.location, row.location);
          assert.equal(res.body.data.code, row.code);
          done();
        });
    });
  });
  //describe('/qrcodescans/:id - DELETE', () => {
  //  it('it should DELETE a single qr code scan', (done) => {
  //    chai.request(root)
  //      .delete(`/${row.id}?timestamp=${row.timestamp}`)
  //      .end((err, res) => {
  //        assert.equal(res.status, 200);
  //        res = res.body;
  //        assert.equal(res.statusCode, 200);
  //        assert.isTrue(res.body.ok);
  //        done();
  //      });
  //  });
  //});
});
