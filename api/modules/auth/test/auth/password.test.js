/**
 * Created by opa_oz on 06.07.16.
 */
var request = require('supertest');
var should = require('should');

request = request.agent('http://127.0.0.1:3000');

describe('Password recovery', function () {
    this.timeout(15000);
    var email = "password@recovery.com";

    beforeEach(function (done) {
        request
            .post('/auth/register')
            .send({email: email, password: '12345'})
            .end(done);
    });

    it('should reset password and send token', function (done) {
        request
            .delete('/auth/password?email=' + email)
            .expect(202)
            .end(function (err, res) {
                res.body.data.token.should.not.empty();
                res.status.should.equal(202);
                done();
            });
    });

    it('should reset and set new password', function (done) {
        request
            .delete('/auth/password?email=' + email)
            .expect(202)
            .end(function (err, res) {
                request
                    .post('/auth/password')
                    .send({token: res.body.data.token, password: 'somePass'})
                    .end(function (err, res) {
                        res.status.should.equal(202);

                        request
                            .post('/auth/login')
                            .send({email: email, password: 'somePass'})
                            .end(function (err, res) {
                                res.status.should.equal(200);
                                res.body.data.token.should.not.empty();
                                res.body.data.user.email.should.equal(email);
                                done();
                            });
                    });
            });
    });
});