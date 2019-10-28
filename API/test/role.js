const request      = require('supertest');
const should       = require('should');
const app          = require('../src/app');

const ADMIN_JWT = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJzdGV2ZW4uYm9laG1Ac2VlZC11cC5pbyIsInJvbGUiOiJBRE1JTiJ9.HjOxlkrBcfjF0MJhb0sivSWl3_iz6xuQj910lIAlK_8';

const users = Array(2).fill().map((_, i) => ({
    email: `test_user_role_${i}@mail.net`,
    password: `passw0rd${i}`
}));

let USERS;

const new_role = {
    authority: "DEV"
};

let NEW_ROLE;

const bad_role = {
    auth: "DEV_OOPS"
};

const createUsers = usersList => {
    const createUsersP = usersList.map(u => request(app).post('/auth/register').send(u));
    const loginUsersP = usersList.map(u => request(app).post('/auth/login').send(u));

    return Promise.all(createUsersP)
        .then(_ => Promise.all(loginUsersP))
        .then( responses => responses.map(res => res.body));
};

const deleteUsers = usersList => {
    const deleteUsersP = usersList.map(u => request(app).delete(`/users/${u.id}`).set('Authorization', ADMIN_JWT));

    return Promise.all(deleteUsersP);
};


before(async () => {
    return await createUsers(users)
        .then(createdUsers => USERS = createdUsers)
        .then(_ => USERS.forEach(u => u.should.have.properties(['id', 'email', 'role', 'token'])));
});

describe('List Roles', () => {
    it('Should fail to list all roles because we are not authenticated', done => {
        request(app)
            .get('/roles')
            .expect(401).end(done);
    });

    it('Should fail to list all roles because we are not admin', done => {
        request(app)
            .get('/roles')
            .set('Authorization', USERS[0].token)
            .expect(403).end(done);
    });

    it('Should list all roles', done => {
        request(app)
            .get('/roles')
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.be.an.Array();
                res.body.forEach(role => {
                    role.should.have.properties(['id', 'authority']);
                    role.id.should.be.above(0);
                });
            }).end(done);
    });
});

describe('Create Roles', () => {
    it('Should fail to create a new role because we are not authenticated', done => {
        request(app)
            .post('/roles')
            .send(new_role)
            .expect(401).end(done);
    });

    it('Should fail to list all users because we are not admin', done => {
        request(app)
            .post('/roles')
            .send(new_role)
            .set('Authorization', USERS[0].token)
            .expect(403).end(done);
    });

    it('Should fail to create a new role because POST body is wrong', done => {
        request(app)
            .post('/roles')
            .send(bad_role)
            .set('Authorization', ADMIN_JWT)
            .expect(400).end(done);
    });

    it('Should create a new role', done => {
        request(app)
            .post('/roles')
            .send(new_role)
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'authority']);
                res.body.id.should.be.above(0);
                res.body.authority.should.equal(new_role.authority);

                NEW_ROLE = res.body;
            }).end(done);
    });

});

describe('Get Role by ID', () => {
    it('Should fail to get role because we are not authenticated', done => {
        request(app)
            .get(`/roles/${NEW_ROLE.id}`)
            .expect(401).end(done);
    });

    it('Should fail to get role because we are not admin', done => {
        request(app)
            .get(`/roles/${NEW_ROLE.id}`)
            .set('Authorization', USERS[0].token)
            .expect(403).end(done);
    });

    it('Should get the new role', done => {
        request(app)
            .get(`/roles/${NEW_ROLE.id}`)
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'authority']);
                res.body.id.should.equal(NEW_ROLE.id);
                res.body.authority.should.equal(NEW_ROLE.authority);
            }).end(done);
    });

    it('Should fail to get an inexisting role', done => {
        request(app)
            .get(`/roles/99548`)
            .set('Authorization', ADMIN_JWT)
            .expect(404).end(done);
    });

});


describe('Delete Role', () => {
    it('Should fail to delete role because we are not authenticated', done => {
        request(app)
            .delete(`/roles/${NEW_ROLE.id}`)
            .expect(401).end(done);
    });

    it('Should fail to delete role because we are not admin', done => {
        request(app)
            .delete(`/roles/${NEW_ROLE.id}`)
            .set('Authorization', USERS[0].token)
            .expect(403).end(done);
    });

    it('Should delete the new role', done => {
        request(app)
            .delete(`/roles/${NEW_ROLE.id}`)
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.have.properties(['id', 'authority']);
                res.body.id.should.equal(NEW_ROLE.id);
                res.body.authority.should.equal(NEW_ROLE.authority);
            }).end(done);
    });

    it('Should fail to delete the previous role because it has been deleted', done => {
        request(app)
            .delete(`/roles/${NEW_ROLE.id}`)
            .set('Authorization', ADMIN_JWT)
            .expect(404).end(done);
    });

});

after(async () => {
    return await deleteUsers(USERS)
        .then(usersResponse => usersResponse.map(res => res.body))
        .then(users => users.forEach(u => u.should.have.properties(['id', 'email', 'role'])));
});
