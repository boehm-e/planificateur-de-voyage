const request      = require('supertest');
const should       = require('should');
const randomstring = require('randomstring');
const app          = require('../src/app');


const RoleEnum = {
    USER: 'USER',
    ADMIN: 'ADMIN'
};

const r1 = randomstring.generate(4);
const user1 = {
    email: `user${r1}@mail.net`,
    password: `passw0rd${r1}`
};

const user1_ = {
    email: `user${r1}@mail.net`,
    password: `passw0rd`
};

const r2 = randomstring.generate(4);
const user2 = {
    email: `user${r2}@mail.net`,
    password: `passw0rd${r2}`
};

let USER1 = null;
let USER2 = null;


const ADMIN_JWT = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJzdGV2ZW4uYm9laG1Ac2VlZC11cC5pbyIsInJvbGUiOiJBRE1JTiJ9.HjOxlkrBcfjF0MJhb0sivSWl3_iz6xuQj910lIAlK_8';
const ADMIN_ROLE_ID = 2;

const badUser = {
    email: 'plop@mail.net'
};


describe('Register', () => {
    it('should register a new user', done => {
        request(app)
            .post('/auth/register')
            .send(user1)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'email', 'role']);
                res.body.id.should.be.above(0);
                res.body.email.should.equal(user1.email);
                res.body.role.should.equal(RoleEnum.USER);
            }).end(_ =>
                request(app)
                    .post('/auth/register')
                    .send(user2)
                    .expect(200)
                    .end(done)
            );

    });

    it('should fail to register a user because email is already taken', done => {
        request(app)
            .post('/auth/register')
            .send(user1_)
            .expect(409)
            .end(done);
    });

    it('should fail to register a badly formed user', done => {
        request(app)
            .post('/auth/register')
            .send(badUser)
            .expect(400)
            .end(done);
    });
});

describe('Login', () => {
    it('should login the previously created user', done => {
        request(app)
            .post('/auth/login')
            .send(user1)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'email', 'role', 'token']);
                res.body.email.should.equal(user1.email);
                res.body.role.should.equal(RoleEnum.USER);
                res.body.token.includes('JWT').should.be.true();
                res.body.token.split('.').length.should.be.equal(3);

                USER1 = res.body;
            }).end(_ =>
                request(app)
                    .post('/auth/login')
                    .send(user2)
                    .expect(200).expect(res => {
                        USER2 = res.body;
                    }).end(done)
            );
    });

    it('should fail to login a incomplete user', done => {
        request(app)
            .post('/auth/login')
            .send(badUser)
            .expect(400)
            .end(done);
    });

    it('should not authenticate a user with a wrong password', done => {
        request(app)
            .post('/auth/login')
            .send({
                email: user1.email,
                password: 'wrongPassword'
            })
            .expect(401).end(done);
    });

    it('should not authenticate a user with a wrong email', done => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'ksjdhf@mail.net',
                password: 'wrongPassword'
            })
            .expect(401).expect(res => {
                console.log(res.body);
            }).end(done);
    });


});

describe('Auth (for forward auth)', () => {
    it('Should fail to authenticate because no JWT is provided', done => {
        request(app)
            .get('/auth')
            .expect(401).end(done);
    });

    const checkForwardedUser = res => {
        const strUser = res.headers['x-forwarded-user'];
        const user = JSON.parse(strUser);

        user.should.have.properties(['id', 'email', 'role']);
    };

    it('Should authenticate (GET)', done => {
        request(app)
            .get('/auth')
            .set('Authorization', ADMIN_JWT)
            .expect(200)
            .expect(checkForwardedUser)
            .end(done);
    });

    it('Should authenticate (POST)', done => {
        request(app)
            .post('/auth')
            .send({random: true})
            .set('Authorization', USER1.token)
            .expect(200)
            .expect(checkForwardedUser)
            .end(done);
    });

    it('Should authenticate (PUT)', done => {
        request(app)
            .put('/auth')
            .send({plop: 'OK'})
            .set('Authorization', ADMIN_JWT)
            .expect(200)
            .expect(checkForwardedUser)
            .end(done);
    });

    it('Should authenticate (DELETE)', done => {
        request(app)
            .delete('/auth')
            .set('Authorization', ADMIN_JWT)
            .expect(200)
            .expect(checkForwardedUser)
            .end(done);
    });
});

describe('List users', () => {
    it('Should fail to list all users because we are not authenticated', done => {
        request(app)
            .get('/users')
            .expect(401).end(done);
    });

    it('Should fail to list all users because we are not admin', done => {
        request(app)
            .get('/users')
            .set('Authorization', USER1.token)
            .expect(403).end(done);
    });

    it('Should list all users', done => {
        request(app)
            .get('/users')
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.be.an.Array();
                res.body.forEach(user => {
                    user.should.have.properties(['id', 'email', 'role']);
                    user.id.should.be.above(0);
                    user.email.should.match(/[^@]+@[^\.]+\..+/);
                    Object.values(RoleEnum).includes(user.role).should.be.true();
                });
            }).end(done);
    });
});

describe('Get user by ID', () => {
    it('Should fail to get user because we are not authenticated', done => {
        request(app)
            .get(`/users/${USER1.id}`)
            .expect(401).end(done);
    });

    it('Should fail to get another user than me', done => {
        request(app)
            .get(`/users/${USER1.id}`)
            .set('Authorization', USER2.token)
            .expect(403).end(done);
    });

    it('Should get user that is me', done => {
        request(app)
            .get(`/users/${USER1.id}`)
            .set('Authorization', USER1.token)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'email', 'role']);
                res.body.id.should.equal(USER1.id);
                res.body.email.should.equal(USER1.email);
                res.body.role.should.equal(USER1.role);
            }).end(done);
    });

    it('Should get user that is not me because i am ADMIN', done => {
        request(app)
            .get(`/users/${USER1.id}`)
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'email', 'role']);
                res.body.id.should.equal(USER1.id);
                res.body.email.should.equal(USER1.email);
                res.body.role.should.equal(USER1.role);
            }).end(done);
    });

    it('Should fail to get an inexisting user', done => {
        request(app)
            .get(`/users/9564`)
            .set('Authorization', ADMIN_JWT)
            .expect(404).expect(res => {
                console.log(res.body);
            }).end(done);
    });
});


describe('Update user by ID', () => {

    it('Should fail to update user because we are not authenticated', done => {
        request(app)
            .put(`/users/${USER1.id}`)
            .send({email: 'new_user1_mail@plop.net'})
            .expect(401).end(done);
    });

    it('Should fail to update another user than me', done => {
        request(app)
            .put(`/users/${USER1.id}`)
            .send({email: 'new_user1_mail@plop.net'})
            .set('Authorization', USER2.token)
            .expect(403).end(done);
    });

    it('Should fail to update my role', done => {
        request(app)
            .put(`/users/${USER1.id}`)
            .send({
                email: 'new_user1_mail@plop.net',
                role: 2
            })
            .set('Authorization', USER1.token)
            .expect(401).end(done);
    });

    it('Should update my email', done => {
        request(app)
            .put(`/users/${USER1.id}`)
            .send({
                email: 'new_user1_mail@plop.net'
            })
            .set('Authorization', USER1.token)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'email', 'role']);
                res.body.id.should.equal(USER1.id);
                res.body.email.should.equal('new_user1_mail@plop.net');
                res.body.role.should.equal(USER1.role);

                USER1.email = 'new_user1_mail@plop.net';
            }).end(done);
    });

    it('Should turn user 1 into an admin', done => {
        request(app)
            .put(`/users/${USER1.id}`)
            .send({
                role: ADMIN_ROLE_ID
            })
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'email', 'role']);
                res.body.id.should.equal(USER1.id);
                res.body.email.should.equal(USER1.email);
                res.body.role.should.equal('ADMIN');

                USER1.role = 'ADMIN';

                console.log(res.body);
            }).end(done);
    });

    it('Should fail to update my role because new role does not exists', done => {
        request(app)
            .put(`/users/${USER1.id}`)
            .send({
                role: 666
            })
            .set('Authorization', ADMIN_JWT)
            .expect(400).end(done);
    });

});

describe('Delete user', () => {
    it('Should fail to delete user because we are not authenticated', done => {
        request(app)
            .delete(`/users/${USER1.id}`)
            .expect(401).end(done);
    });

    it('Should fail to delete another user than me', done => {
        request(app)
            .delete(`/users/${USER1.id}`)
            .set('Authorization', USER2.token)
            .expect(403).end(done);
    });

    it('Should delete me', done => {
        request(app)
            .delete(`/users/${USER1.id}`)
            .set('Authorization', USER1.token)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'email', 'role']);
                res.body.id.should.equal(USER1.id);
                res.body.email.should.equal(USER1.email);
                res.body.role.should.equal(USER1.role);
            }).end(done);
    });

    it('Should not find the deleted user', done => {
        request(app)
            .get(`/users/${USER1.id}`)
            .set('Authorization', ADMIN_JWT)
            .expect(404).end(done);
    });

    it('Should delete another user than me because i am ADMIN', done => {
        request(app)
            .delete(`/users/${USER2.id}`)
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'email', 'role']);
                res.body.id.should.equal(USER2.id);
                res.body.email.should.equal(USER2.email);
                res.body.role.should.equal(USER2.role);
            }).end(done);
    });

    it('Should not find the user to delete (because it has already been deleted)', done => {
        request(app)
            .delete(`/users/${USER2.id}`)
            .set('Authorization', ADMIN_JWT)
            .expect(404).end(done);
    });
});

describe("Other user tests ... ", () => {
    it('Should fail to get user because JWT user does not exists anymore', done => {
        request(app)
            .get(`/users/${USER1.id}`)
            .set('Authorization', USER1.token)
            .expect(401).end(done);
    });
});
