const request      = require('supertest');
const should       = require('should');
const app          = require('../src/app');

const ADMIN_JWT = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJzdGV2ZW4uYm9laG1Ac2VlZC11cC5pbyIsInJvbGUiOiJBRE1JTiJ9.HjOxlkrBcfjF0MJhb0sivSWl3_iz6xuQj910lIAlK_8';

const usersToCreate = Array(5).fill().map((_, i) => ({
    email: `test_user_event_${i + Math.random()}@mail.net`,
    password: `passw0rd${i}`
}));

let USERS;

const event1 = {
    name: "Climbing Arkose Montreuil !",
    start: "2019-09-14T01:39:08.000Z",
    end: "2019-09-14T01:39:08.000Z"
};

const event2 = {
    name: "Drink some beer at the TrucMuch bar",
    start: "2019-10-19T21:00:08.000Z",
    end: "2019-10-19T23:30:08.000Z"
};

let EVENT1, EVENT2;

const badEvents = [
    {
        start: "2019-09-14T01:39:08.000Z",
        end: "2019-09-14T01:39:08.000Z"
    },
    {
        name: "Climbing Arkose Montreuil",
        start: "201-09-14",
        end: "2019-09-14T01:39:08.000Z"
    }
];

const createUsers = usersList => {
    const createUsersP = usersList.map(u => request(app).post('/auth/register').send(u));
    const loginUsersP = usersList.map(u => request(app).post('/auth/login').send(u));

    return Promise.all(createUsersP)
        .then(_ => Promise.all(loginUsersP))
        .then( responses => responses.map(res => res.body));
};

const deleteUsers = usersList => Promise.all(
    usersList.map(u =>
        request(app)
            .delete(`/users/${u.id}`)
            .set('Authorization', ADMIN_JWT)
    )
);


const checkEvent = event => {
    event.should.have.properties(['id', 'name', 'start', 'end', 'user', 'atendees', 'canceled']);
    event.id.should.be.above(0);
    event.user.should.have.properties(['id', 'email', 'role']);
    event.atendees.forEach(atendee => atendee.should.have.properties(['id', 'email', 'role', 'accepted', 'invitation_id']));
};


before(async () => {
    return await createUsers(usersToCreate)
        .then(createdUsers => USERS = createdUsers)
        .then(_ => USERS.forEach(u => u.should.have.properties(['id', 'email', 'role', 'token'])));
});

describe('Create events', () => {
    it('Should fail to create an event because we are not authenticated', done => {
        request(app)
            .post('/events')
            .send(event1)
            .expect(401).end(done);
    });


    it('Should fail to create events because of bad inputs', done => {
        request(app)
            .post('/events')
            .set('Authorization', USERS[0].token)
            .send(badEvents[0])
            .expect(400).then(
                request(app)
                    .post('/events')
                    .set('Authorization', USERS[0].token)
                    .send(badEvents[1])
                    .expect(400).end(done)
            );
    });


    it('Should create new events', done => {
        request(app)
            .post('/events')
            .set('Authorization', USERS[0].token)
            .send(event1)
            .expect(200).expect(res => {
                checkEvent(res.body);

                res.body.name.should.equal(event1.name);
                res.body.start.should.equal(event1.start);
                res.body.end.should.equal(event1.end);
                res.body.canceled.should.be.false();
                res.body.user.id.should.equal(USERS[0].id);
                res.body.user.email.should.equal(USERS[0].email);
                res.body.user.role.should.equal(USERS[0].role);

                EVENT1 = res.body;
            }).then(_ => {
                request(app)
                    .post('/events')
                    .set('Authorization', USERS[1].token)
                    .send(event2)
                    .expect(200).end(done);
            });
    });

});

describe('Get events', () => {
    it('should fail to get an event because we are not authenticated', done => {
        request(app)
            .get(`/events/${EVENT1.id}`)
            .expect(401).end(done);
    });

    it('should fail to get the newly created event because I am not the creator nor have I been invited ', done => {
        request(app)
            .get(`/events/${EVENT1.id}`)
            .set('Authorization', USERS[3].token)
            .expect(401).end(done);
    });

    it('should get the newly created event', done => {
        request(app)
            .get(`/events/${EVENT1.id}`)
            .set('Authorization', USERS[0].token)
            .expect(200).expect(res => {
                res.body.should.deepEqual(EVENT1);
            }).end(done);
    });

    it('should fail to get an unexisting event', done => {
        request(app)
            .get(`/events/5454`)
            .set('Authorization', USERS[0].token)
            .expect(404).end(done);
    });

    it('Should fail to get all events because we are not admin', done => {
        request(app)
            .get(`/events`)
            .set('Authorization', USERS[0].token)
            .expect(403).end(done);
    });

    it('Should get all events (because we are admin)', done => {
        request(app)
            .get(`/events`)
            .set('Authorization', ADMIN_JWT)
            .expect(200).expect(res => {
                res.body.should.be.an.Array();
                res.body.forEach(event => {
                  checkEvent(event);
                });
            })
            .end(done);
    });

});


describe('Invite users to event', () => {
    it('should fail to invite users because we are not the one who created the event', done => {
        request(app)
            .post(`/events/${EVENT1.id}`)
            .set('Authorization', USERS[1].token)
            .send([USERS[1].email, USERS[2].email])
            .expect(401).end(done);
    });

    it('should invite user 2 and 3 to the event', done => {
        request(app)
            .post(`/events/${EVENT1.id}`)
            .set('Authorization', USERS[0].token)
            .send([USERS[1].email, USERS[2].email])
            .expect(200).expect(res => {
                checkEvent(res.body);
                // check that attendees are users
                res.body.atendees.length.should.equal(2);
                [1,2].forEach(n => {
                    const atendee = res.body.atendees.find(u => u.id == USERS[n].id);

                    atendee.should.have.properties(['id', 'email', 'role', 'accepted']);
                    atendee.id.should.equal(USERS[n].id);
                    atendee.email.should.equal(USERS[n].email);
                    atendee.role.should.equal(USERS[n].role);
                });
            }).end(done);
    });

    it('should get the event because I am invited', done => {
        request(app)
            .get(`/events/${EVENT1.id}`)
            .set('Authorization', USERS[1].token)
            .expect(200).expect(res => {
            }).end(done);
    });


    it('should fail to accept the invitation because I am not the user in question', done => {
        request(app)
            .put(`/events/${EVENT1.id}/${USERS[1].id}`)
            .set('Authorization', USERS[2].token)
            .send({accept: true})
            .expect(401).end(done);
    });


    it('should make user 2 accept the invitation', done => {
        request(app)
            .put(`/events/${EVENT1.id}/${USERS[1].id}`)
            .set('Authorization', USERS[1].token)
            .send({accept: true})
            .expect(200).expect(res => {
                checkEvent(res.body);
                res.body.atendees.find(u => u.id == USERS[1].id).accepted.should.be.true();
                should(res.body.atendees.find(u => u.id == USERS[2].id).accepted).be.exactly(null);
            }).end(done);
    });

    it('should make user 3 decline the invitation', done => {
        request(app)
            .put(`/events/${EVENT1.id}/${USERS[2].id}`)
            .set('Authorization', USERS[2].token)
            .send({accept: false})
            .expect(200).expect(res => {
                checkEvent(res.body);
                res.body.atendees.find(u => u.id == USERS[1].id).accepted.should.be.true();
                res.body.atendees.find(u => u.id == USERS[2].id).accepted.should.be.false();
            }).end(done);
    });

    it('should fail to decline an unexisting invitation', done => {
        request(app)
            .put(`/events/${EVENT1.id}/${USERS[3].id}`)
            .set('Authorization', USERS[3].token)
            .send({accept: false})
            .expect(404).end(done);
    });
});



describe('Cancel events', () => {
    it('should fail to cancel the event because I am not the creator', done => {

        request(app)
            .delete(`/events/${EVENT1.id}`)
            .set('Authorization', USERS[1].token)
            .expect(401).end(done);
    });

    it('should cancel the event', done => {
        request(app)
            .delete(`/events/${EVENT1.id}`)
            .set('Authorization', USERS[0].token)
            .expect(200).expect(res => {
                checkEvent(res.body);
                res.body.canceled.should.be.true();
            }).end(done);
    });
});


describe('List user events', () => {
    it('should fail to list user 2 event because I am not user 2', done => {
        request(app)
            .get(`/users/${USERS[1].id}/events`)
            .set('Authorization', USERS[2].token)
            .expect(403).end(done);
    });

    it('should list user 2 events', done => {
        request(app)
            .get(`/users/${USERS[1].id}/events`)
            .set('Authorization', USERS[1].token)
            .expect(200).expect(res => {
                res.body.forEach(event => {
                    checkEvent(event);
                    [event.user.id, ...event.atendees.map(u => u.id)].includes(USERS[1].id);
                });

            }).end(done);
    });

    it('should list user 2 event because I am ADMIN', done => {
        request(app)
            .get(`/users/${USERS[1].id}/events`)
            .set('Authorization', ADMIN_JWT)
            .expect(200).end(done);
    });

});


after(async () => {
    return await deleteUsers(USERS)
        .then(usersResponse => usersResponse.map(res => res.body))
        .then(users => users.forEach(u => u.should.have.properties(['id', 'email', 'role'])));
});
