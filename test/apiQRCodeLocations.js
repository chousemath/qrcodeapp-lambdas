const chai = require('chai');
const chaiHttp = require('chai-http');
const { assert } = require('chai')
const faker = require('faker');
const { config } = require('../config');

const fakeQRCodeLocation = () => {
  return {
    category: Math.round(Math.random()) + 1,
    name: faker.company.companyName(),
  };
};

const updateQRCodeLocation = fakeQRCodeLocation();

let row;
const root = `${config.rootURLDev}/qrcodelocations`;
let rowCount;

chai.use(chaiHttp);
describe('QRCodeLocations', () => {
  describe('/qrcodelocations - GET', () => {
    it('it should GET all the qr code locations', (done) => {
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
  describe('/qrcodelocations - POST', () => {
    it('it should create a new qr code location', (done) => {
      chai.request(root)
        .post('/')
        .send(fakeQRCodeLocation())
        .end((err, res) => {
          assert.equal(res.status, 200);
          res = res.body;
          assert.equal(res.statusCode, 200);
          assert.isTrue(res.body.ok);
          done();
        });
    });
  });
  describe('/qrcodelocations - GET after POST', () => {
    it('it should GET all the qr code locations (including the new one)', (done) => {
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
  describe('/qrcodelocations/:id - GET', () => {
    it('it should GET a single qr code location', (done) => {
      chai.request(root)
        .get(`/${row.id}?timestamp=${row.timestamp}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          res = res.body;
          assert.equal(res.statusCode, 200);
          assert.isTrue(res.body.ok);
          assert.equal(res.body.data.id, row.id);
          assert.equal(res.body.data.category, row.category);
          assert.equal(res.body.data.name, row.name);
          done();
        });
    });
  });
  describe('/qrcodelocations/:id - PUT', () => {
    it('it should update an qr code location', (done) => {
      chai.request(root)
        .put(`/${row.id}?timestamp=${row.timestamp}`)
        .send(updateQRCodeLocation)
        .end((err, res) => {
          assert.equal(res.status, 200);
          res = res.body;
          assert.equal(res.statusCode, 200);
          assert.isTrue(res.body.ok);
          done();
        });
    });
  });
  describe('/qrcodelocations/:id - GET (after PUT request)', () => {
    it('it should GET a single qr code location (after it has been updated)', (done) => {
      chai.request(root)
        .get(`/${row.id}?timestamp=${row.timestamp}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          res = res.body;
          assert.equal(res.statusCode, 200);
          assert.isTrue(res.body.ok);
          assert.equal(res.body.data.category, updateQRCodeLocation.category);
          assert.equal(res.body.data.name, updateQRCodeLocation.name);
          assert.isTrue(res.body.data.createdAt === row.createdAt);
          done();
        });
    });
  });
  describe('/qrcodelocations/:id - DELETE', () => {
    it('it should DELETE a single qr code location', (done) => {
      chai.request(root)
        .delete(`/${row.id}?timestamp=${row.timestamp}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          res = res.body;
          assert.equal(res.statusCode, 200);
          assert.isTrue(res.body.ok);
          done();
        });
    });
  });
});
