const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

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

  beforeEach(function (done) {
    database.migrate.rollback()
      .then(function () {
        database.migrate.latest()
          .then(function () {
            return database.seed.run()
              .then(function () {
                done();
              });
          });
      });
  });
  
  describe('GET /api/v1/projects', () => {
    
    it('should return all of the projects', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then( response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('project_name');
        response.body[0].project_name.should.equal('Project 1');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1)
      })
    })
  })

    describe('POST /api/v1/projects', () => {
      it('should create a new project', () => {
        return chai.request(server)
        .post('/api/v1/projects')
        .send({
          project_name: 'Project 2'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(2);
        })
      })
      
      it('should give an error if no project name is given', () => {
        return chai.request(server)
        .post('/api/v1/projects')
        .send({})
        .then(response => {
          response.should.have.status(422);
          response.body.should.have.property('error')
          response.body.error.should.equal('Expected format: {project_name: <String>}. You\'re missing a "project_name" property.')
        })
      })
    })

    describe('GET /api/v1/palettes', () => {
      it('should get all of the palettes', () => {
        return chai.request(server)
        .get('/api/v1/palettes')
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('palette_name');
          response.body[0].palette_name.should.equal('a nice palette');
          response.body[0].should.have.property('colors');
          response.body[0].colors.should.be.a('array');
          response.body[0].colors.length.should.equal(5);
          response.body[0].colors[0].should.be.a('string');
        })
      })
    })

    describe('GET /api/v1/projects/:id/palettes', () => {
      it('should get a specific palette for one project', () => {
        return chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.be.a('object');
          response.body[0].should.have.property('palette_name');
          response.body[0].palette_name.should.equal('a nice palette');
        })
      })

      it('should give an error if that project does not exist', () => {
        return chai.request(server)
        .get('/api/v1/projects/500/palettes')
        .then(response => {
          response.should.have.status(404);
          response.body.should.have.property('error');
          response.body.error.should.equal('Could not find project with id 500');
        })
      })
    })
});