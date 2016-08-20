/**
 * Created by opa_oz on 05.07.16.
 */
var request = require('supertest');
var should = require('should');
var _ = require('underscore');

request = request.agent('http://127.0.0.1:3000');

describe("Registration and login API", function () {

    describe("Registration", function () {
        it("should create user", function (done) {
            var userEmail = "email" + _.random(1, 1000) + "@example.com";

            request
                .post('/auth/register')
                .send({email: userEmail, password: '12345'})
                .expect(201)
                .end(function (err, res) {
                    res.status.should.equal(201);
                    res.body.data.user.email.should.equal(userEmail);
                    done();
                });
        });

        it("should return error", function (done) {
            var userEmail = "conflict" + _.random(1, 1000) + "@example.com";

            request
                .post('/auth/register')
                .send({email: userEmail, password: '12345'})
                .end(function () {
                    request
                        .post('/auth/register')
                        .send({email: userEmail, password: '12345'})
                        .expect(422)
                        .end(function (err, res) {
                            res.status.should.equal(422);
                            done();
                        });
                });
        })
    });

    describe('Login', function () {
        var email = "logintest@example.com";

        beforeEach(function (done) {
            request
                .post('/auth/register')
                .send({email: email, password: '12345'})
                .end(done);
        });

        it('should login as user', function (done) {
            request
                .post('/auth/login')
                .send({email: email, password: '12345'})
                .expect(200)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.data.token.should.not.empty();
                    res.body.data.user.email.should.equal(email);
                    done();
                });
        });

        it('should login and logout successfully', function (done) {
            request
                .post('/auth/login')
                .send({email: email, password: '12345'})
                .expect(200)
                .end(function (err, res) {
                    request
                        .post('/auth/logout')
                        .set('Authorization', 'Bearer ' + res.body.data.token)
                        .expect(204)
                        .end(function (err, res) {
                            res.status.should.equal(204);
                            res.body.should.empty();
                            done();
                        });
                });
        });

        it('should return unauthorized', function (done) {
            request
                .post('/auth/logout')
                .expect(401)
                .end(function (err, res) {
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should return 404 because user doesn\'t exist', function (done) {
            request
                .post('/auth/login')
                .send({email: 'unexisting@email.com', password: '12345'})
                .expect(404)
                .end(function (err, res) {
                    res.status.should.equal(404);
                    done();
                });
        });
    });
});