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

const updateQRCodeScan = fakeQRCodeScan();

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
  //describe('/attachments/:id - GET', () => {
  //  it('it should GET a single attachment', (done) => {
  //    chai.request(root)
  //      .get(`/${row.id}`)
  //      .end((err, res) => {
  //        assert.equal(res.status, 200);
  //        res = res.body;
  //        assert.equal(res.statusCode, 200);
  //        assert.isTrue(res.body.ok);
  //        assert.equal(res.body.data.id, row.id);
  //        assert.equal(res.body.data.tableID, row.tableID);
  //        assert.equal(res.body.data.tableType, row.tableType);
  //        assert.equal(res.body.data.category, row.category);
  //        assert.equal(res.body.data.url, row.url);
  //        assert.equal(res.body.data.ext, row.ext);
  //        assert.equal(res.body.data.createdAt, row.createdAt);
  //        assert.equal(res.body.data.updatedAt, row.updatedAt);
  //        done();
  //      });
  //  });
  //});
  //describe('/attachments/:id - PUT', () => {
  //  it('it should update an attachment', (done) => {
  //    chai.request(root)
  //      .put(`/${row.id}`)
  //      .send(updateAttachment)
  //      .end((err, res) => {
  //        assert.equal(res.status, 200);
  //        res = res.body;
  //        assert.equal(res.statusCode, 200);
  //        assert.isTrue(res.body.ok);
  //        done();
  //      });
  //  });
  //});
  //describe('/attachments/:id - GET (after PUT request)', () => {
  //  it('it should GET a single attachment (after it has been updated)', (done) => {
  //    chai.request(root)
  //      .get(`/${row.id}`)
  //      .end((err, res) => {
  //        assert.equal(res.status, 200);
  //        res = res.body;
  //        assert.equal(res.statusCode, 200);
  //        assert.isTrue(res.body.ok);
  //        assert.equal(res.body.data.tableID, updateAttachment.tableID);
  //        assert.equal(res.body.data.tableType, updateAttachment.tableType);
  //        assert.equal(res.body.data.category, updateAttachment.category);
  //        assert.equal(res.body.data.url, updateAttachment.url);
  //        assert.equal(res.body.data.ext, updateAttachment.ext);
  //        assert.isTrue(res.body.data.createdAt === row.createdAt);
  //        done();
  //      });
  //  });
  //});
  //describe('/attachments/:id - DELETE', () => {
  //  it('it should DELETE a single attachment', (done) => {
  //    chai.request(root)
  //      .delete(`/${row.id}`)
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
