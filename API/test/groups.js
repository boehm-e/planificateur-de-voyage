const request      = require('supertest');
const should       = require('should');
const app          = require('../src/app');

const ADMIN_JWT = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJzdGV2ZW4uYm9laG1Ac2VlZC11cC5pbyIsInJvbGUiOiJBRE1JTiJ9.HjOxlkrBcfjF0MJhb0sivSWl3_iz6xuQj910lIAlK_8';

const usersToCreate = Array(5).fill().map((_, i) => ({
    email: `test_user_group_${i + Math.random()}@mail.net`,
    password: `passw0rd${i}`
}));

let USERS;

const group1 = {
    name: "Famille",
    description: "Groupe correspondant à la famille"
};

const group2 = {
    name: "Potes",
    description: "Groupe avec qui aller boire un coup !"
};

let GROUP1, GROUP2;

const badGroups = [
    {
        name: "Plop"
    },
    {
        description: "Groupe avec qui aller boire un coup mais qui n'a pas de nom !"
    }
];

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



const checkGroup = group => {
    group.should.have.properties(['id', 'name', 'description', 'user', 'deleted']);
    group.id.should.be.above(0);
    group.user.should.have.properties(['id', 'email', 'role']);
    group.members.forEach(member => member.should.have.properties(['id', 'email', 'role', 'accepted', 'invitation_id']));
};



before(async () => {
    return await createUsers(usersToCreate)
        .then(createdUsers => USERS = createdUsers)
        .then(_ => USERS.forEach(u => u.should.have.properties(['id', 'email', 'role', 'token'])));
});


describe('Create groups', () => {
    it('Should fail to create an group because we are not authenticated', done => {
        request(app)
            .post('/groups')
            .send(group1)
            .expect(401).end(done);
    });


    it('Should fail to create groups because of bad inputs', done => {
        request(app)
            .post('/groups')
            .set('Authorization', USERS[0].token)
            .send(badGroups[0])
            .expect(400).then(
                request(app)
                    .post('/groups')
                    .set('Authorization', USERS[0].token)
                    .send(badGroups[1])
                    .expect(400).end(done)
            );
    });


    it('Should create new groups', done => {
        request(app)
            .post('/groups')
            .set('Authorization', USERS[0].token)
            .send(group1)
            .expect(200).expect(res => {
                checkGroup(res.body);

                res.body.name.should.equal(group1.name);
                res.body.description.should.equal(group1.description);
                res.body.user.id.should.equal(USERS[0].id);
                res.body.user.email.should.equal(USERS[0].email);
                res.body.user.role.should.equal(USERS[0].role);

                GROUP1 = res.body;
            }).then(_ => {
                request(app)
                    .post('/groups')
                    .set('Authorization', USERS[1].token)
                    .send(group2)
                    .expect(200).end(done);
            });
    });
});

describe('Get groups', () => {
    it('should fail to get an group because we are not authenticated', done => {
        request(app)
            .get(`/groups/${GROUP1.id}`)
            .expect(401).end(done);
    });

    it('should fail to get the newly created group because I am not the creator nor have I been invited ', done => {
        request(app)
            .get(`/groups/${GROUP1.id}`)
            .set('Authorization', USERS[3].token)
            .expect(401).end(done);
    });

    it('should get the newly created group', done => {
        request(app)
            .get(`/groups/${GROUP1.id}`)
            .set('Authorization', USERS[0].token)
            .expect(200).expect(res => {
                res.body.should.deepEqual(GROUP1);
            }).end(done);
    });

    it('should fail to get an unexisting group', done => {
        request(app)
            .get(`/groups/5454`)
            .set('Authorization', USERS[0].token)
            .expect(404).end(done);
    });

    it('Should fail to get all groups because we are not admin', done => {
        request(app)
            .get(`/groups`)
            .set('Authorization', USERS[0].token)
            .expect(403).end(done);
    });

    it('Should get all groups (because we are admin)', done => {
        request(app)
            .get(`/groups`)
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.be.an.Array();
                res.body.forEach(group => {
                  checkGroup(group);
                });
            })
            .end(done);
    });

});


describe('Invite users to group', () => {
    it('should fail to invite users because we are not the one who created the group', done => {
        request(app)
            .post(`/groups/${GROUP1.id}`)
            .set('Authorization', USERS[1].token)
            .send([USERS[1].email, USERS[2].email])
            .expect(401).end(done);
    });

    it('should invite user 2 and 3 to the group', done => {
        request(app)
            .post(`/groups/${GROUP1.id}`)
            .set('Authorization', USERS[0].token)
            .send([USERS[1].email, USERS[2].email])
            .expect(200).expect(res => {
                checkGroup(res.body);
                // check that attendees are users
                res.body.members.length.should.equal(2);
                [1,2].forEach(n => {
                    const member = res.body.members.find(u => u.id == USERS[n].id);

                    member.should.have.properties(['id', 'email', 'role', 'accepted']);
                    member.id.should.equal(USERS[n].id);
                    member.email.should.equal(USERS[n].email);
                    member.role.should.equal(USERS[n].role);
                });
            }).end(done);
    });

    it('should get the group because I am invited', done => {
        request(app)
            .get(`/groups/${GROUP1.id}`)
            .set('Authorization', USERS[1].token)
            .expect(200).expect(res => {
            }).end(done);
    });


    it('should fail to accept the invitation because I am not the user in question', done => {
        request(app)
            .put(`/groups/${GROUP1.id}/${USERS[1].id}`)
            .set('Authorization', USERS[2].token)
            .send({accept: true})
            .expect(401).end(done);
    });


    it('should make user 2 accept the invitation', done => {
        request(app)
            .put(`/groups/${GROUP1.id}/${USERS[1].id}`)
            .set('Authorization', USERS[1].token)
            .send({accept: true})
            .expect(200).expect(res => {
                checkGroup(res.body);
                res.body.members.find(u => u.id == USERS[1].id).accepted.should.be.true();
                should(res.body.members.find(u => u.id == USERS[2].id).accepted).be.exactly(null);
            }).end(done);
    });

    it('should make user 3 decline the invitation', done => {
        request(app)
            .put(`/groups/${GROUP1.id}/${USERS[2].id}`)
            .set('Authorization', USERS[2].token)
            .send({accept: false})
            .expect(200).expect(res => {
                checkGroup(res.body);
                res.body.members.find(u => u.id == USERS[1].id).accepted.should.be.true();
                res.body.members.find(u => u.id == USERS[2].id).accepted.should.be.false();
            }).end(done);
    });

    it('should fail to decline an unexisting invitation', done => {
        request(app)
            .put(`/groups/${GROUP1.id}/${USERS[3].id}`)
            .set('Authorization', USERS[3].token)
            .send({accept: false})
            .expect(404).end(done);
    });

});



describe('Delete groups', () => {
    it('should fail to cancel the group because I am not the creator', done => {
        request(app)
            .delete(`/groups/${GROUP1.id}`)
            .set('Authorization', USERS[1].token)
            .expect(401).end(done);
    });

    it('should delete the group', done => {
        request(app)
            .delete(`/groups/${GROUP1.id}`)
            .set('Authorization', USERS[0].token)
            .expect(200).expect(res => {
                console.log(res.body);
                checkGroup(res.body);
                res.body.deleted.should.be.true();
            }).end(done);
    });
});


describe('List user groups', () => {
    it('should fail to list user 2 group because I am not user 2', done => {
        request(app)
            .get(`/users/${USERS[1].id}/groups`)
            .set('Authorization', USERS[2].token)
            .expect(403).end(done);
    });

    it('should list user 2 groups', done => {
        request(app)
            .get(`/users/${USERS[1].id}/groups`)
            .set('Authorization', USERS[1].token)
            .expect(200).expect(res => {
                console.log(res.body);
                res.body.forEach(group => {
                    checkGroup(group);
                    [group.user.id, ...group.members.map(u => u.id)].includes(USERS[1].id);
                });

            }).end(done);
    });

    it('should list user 2 group because I am ADMIN', done => {
        request(app)
            .get(`/users/${USERS[1].id}/groups`)
            .set('Authorization', ADMIN_JWT)
            .expect(200).end(done);
    });
});


after(async () => {
    return await deleteUsers(USERS)
        .then(usersResponse => usersResponse.map(res => res.body))
        .then(users => users.forEach(u => u.should.have.properties(['id', 'email', 'role'])));
});
