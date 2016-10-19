const should = require('should')
const supertest = require('supertest')
const server = supertest.agent('http://localhost:3000')

describe('File upload test cases', function () {
  it('should upload file', function (done) {
    server
      .post('/api/photo')
      .field('filename', 'test file')
      .attach('file', 'test/test.png')
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200)
        done()
      })
  })
})
