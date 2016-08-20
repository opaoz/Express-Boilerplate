/**
 * Created by opa_oz on 05.07.16.
 */
var request = require('supertest');
var should = require('should');

request = request.agent('http://127.0.0.1:3000');

describe("Echo API", function () {

    describe('Unauthorized requests', function () {
        it('should return unauthorized', function (done) {
            request
                .get('/auth/echo')
                .expect(401)
                .end(function (err, res) {
                    res.status.should.equal(401);
                    done();
                });
        });
    });

    describe('Authorized requests', function () {
        var token = "";
        beforeEach(function (done) {
            var email = 'echoemail@example.com';

            request
                .post('/auth/register')
                .send({email: email, password: '12345'})
                .end(function () {
                    request
                        .post('/auth/login')
                        .send({email: email, password: '12345'})
                        .end(function (err, res) {
                            token = res.body.data.token;
                            done();
                        });
                });
        });

        it('should return success', function (done) {
            request
                .get('/auth/echo')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should return error', function (done) {
            request
                .get('/auth/echo?error=true')
                .set('Authorization', 'Bearer ' + token)
                .expect(500)
                .end(function (err, res) {
                    res.status.should.equal(500);
                    done();
                });
        });
    });

});