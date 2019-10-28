const request      = require('supertest');
const should       = require('should');
const app          = require('../src/app');

const erwanUser = {
    email: 'erwan.boehm@gmail.com',
    password: 'passErwan'
};

const stevenUser = {
    email: 'steven.boehm@gmail.com',
    password: 'passSteven'
};

let ERWAN, STEVEN = null;

const ADMIN_JWT = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJzdGV2ZW4uYm9laG1Ac2VlZC11cC5pbyIsInJvbGUiOiJBRE1JTiJ9.HjOxlkrBcfjF0MJhb0sivSWl3_iz6xuQj910lIAlK_8';

before(async () => {
    const usersP = [erwanUser, stevenUser]
          .map(u => request(app).post('/auth/login').send(u));

    return await Promise.all(usersP)
        .then(responses => responses.map(r => r.body))
        .then(users => {
            console.log(users);
            [ERWAN, STEVEN] = users;
        });
});


describe("Notifications", () => {
    it('Should fail to get user notifs because we are not authenticated', done => {
        request(app)
            .get(`/users/${ERWAN.id}/notifications`)
            .expect(401).end(done);
    });

    it('Should fail to get erwan notifs because we are not erwan, nor are we Admin', done => {
        request(app)
            .get(`/users/${ERWAN.id}/notifications`)
            .set('Authorization', STEVEN.token)
            .expect(403).end(done);
    });

    it('Should get erwan notifs ', done => {
        request(app)
            .get(`/users/${ERWAN.id}/notifications`)
            .set('Authorization', ERWAN.token)
            .expect(200).expect(res => {
                console.log(res.body);
                res.body.should.be.an.Array();
                res.body.forEach(notif => {
                    notif.should.have.properties(['user_id', 'nature', 'name', 'object_id']);
                });
            }).end(done);
    });

});
