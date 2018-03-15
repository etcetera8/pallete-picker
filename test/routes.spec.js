const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
    .get('/', (req, res) => {
      response.should.have.status(200)
    })
  })

  it('should return 404 for page that does not exist', () => {
    return chai.request(server)
    .get('/banana')
    .then(response => {
      response.should.have.status(404)
    })
    .catch(err => {
      throw err;
    })
  })
});

describe('API Routes', () => {

});