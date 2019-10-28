const request      = require('supertest');
const should       = require('should');
const app          = require('../src/app');

const ADMIN_JWT = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJzdGV2ZW4uYm9laG1Ac2VlZC11cC5pbyIsInJvbGUiOiJBRE1JTiJ9.HjOxlkrBcfjF0MJhb0sivSWl3_iz6xuQj910lIAlK_8';

const users = Array(10).fill().map((_, i) => ({
    email: `test_visivility_${i}@mail.net`,
    password: `passw0rd${i}`
}));

const groups = [{
    name: "Famille",
    description: "Groupe correspondant à la famille"
},{
    name: "Potes",
    description: "Groupe avec qui aller boire un coup !"
},{
    name: "Arkose",
    description: "Groupe avec qui faire de l'escalade !"
}];

const events = [{
    name: "Climbing Arkose Montreuil !",
    start: "2019-09-14T01:39:08.000Z",
    end: "2019-09-14T01:39:08.000Z"
},{
    name: "Drink some beer at the TrucMuch bar",
    start: "2019-10-19T21:00:08.000Z",
    end: "2019-10-19T23:30:08.000Z"
},{
    name: "Family dinner",
    start: "2019-11-19T21:00:08.000Z",
    end: "2019-11-19T23:30:08.000Z"
},{
    name: "Date !",
    start: "2019-11-19T11:00:08.000Z",
    end: "2019-11-19T13:30:08.000Z"
},{
    name: "Work stand-up meeting",
    start: "2019-11-20T09:00:08.000Z",
    end: "2019-11-20T09:30:08.000Z"
}, {
    name: "Climbing at noon",
    start: "2019-11-20T11:30:08.000Z",
    end: "2019-11-20T13:30:08.000Z"
}];

const checkEvent = event => {
    event.should.have.properties(['id', 'name', 'start', 'end', 'user', 'atendees', 'canceled']);
    event.id.should.be.above(0);
    event.user.should.have.properties(['id', 'email', 'role']);
    event.atendees.forEach(atendee => atendee.should.have.properties(['id', 'email', 'role', 'accepted', 'invitation_id']));
};


let USERS, GROUPS, EVENTS, C_USER;

const createUsers = usersList => {
    const createUsersP = usersList.map(u => request(app).post('/auth/register').send(u));
    const loginUsersP = usersList.map(u => request(app).post('/auth/login').send(u));

    return Promise.all(createUsersP)
        .then(_ => Promise.all(loginUsersP))
        .then( responses => responses.map(res => res.body));
};

const createGroups = async (groupList, users) => {
    const userGroupInvitations = [];
    const createGroupP = groupList.map((g, i) =>
        request(app)
            .post('/groups')
            .set('Authorization', users[i % (users.length - 1)].token)
            .send(g)
            .then(res => res.body)
    );
    const groups = await Promise.all(createGroupP);
    const invitationsP = groups.map((group, i) => {
        const _users = users
              .filter((u, j) => (j + i) % 2 == 0)
              .map(u => {
                  userGroupInvitations.push({user_id: u.id, group_id: group.id, token: u.token});
                  return u.email;
              });

        return request(app)
            .post(`/groups/${group.id}`)
            .set('Authorization', users[i % (users.length - 1)].token)
            .send(_users)
            .then(res => res.body);
    });
    const invitations = await Promise.all(invitationsP);
    const acceptInvitationsP = userGroupInvitations.map(({user_id, group_id, token}) =>
        request(app)
            .put(`/groups/${group_id}/${user_id}`)
            .set('Authorization', token)
            .send({accept: true})
            .then(res => res.body)
    );
    const acceptedInvitations = await Promise.all(acceptInvitationsP);

    return {users, groups, invitations, acceptedInvitations};
};

const createEvents = async (events, users, groups) => {
    const eventsToCreateP = events.map((e, i) =>
        request(app).post('/events').set('Authorization', users[i % 2].token).send(e).then(res => res.body)
    );
    const createdEvents = await Promise.all(eventsToCreateP);

    // invite Arkose group to "climbing" events
    const acceptInviteClimbingP = [];
    const inviteClimbingP = createdEvents
          .filter(e => e.name.includes('Climb'))
          .map(e => {
              const arkoseGroup = groups.find(g => g.name == 'Arkose');
              const arkoseMembers = arkoseGroup.members.map(m => m.email);

              arkoseGroup.members.forEach(m =>
                  acceptInviteClimbingP.push(
                      request(app)
                          .put(`/events/${e.id}/${m.id}`)
                          .set('Authorization', ADMIN_JWT)
                          .then(res => res.body)

                  )
              );
              return request(app)
                  .post(`/events/${e.id}`)
                  .set('Authorization', ADMIN_JWT)
                  .send(arkoseMembers)
                  .then(res => res.body);
          });

    await Promise.all(inviteClimbingP);
    await Promise.all(acceptInviteClimbingP);

    // invite user 3 ans 4 to Family dinner
    const familyDinner = createdEvents.find(e => e.name.includes('Family'));
    await request(app)
        .post(`/events/${familyDinner.id}`)
        .set('Authorization', ADMIN_JWT)
        .send([users[2].email, users[3].email]);
    await Promise.all(
        [users[2].id, users[3].id].map(user_id =>
            request(app).put(`/events/${familyDinner.id}/${user_id}`).set('Authorization', ADMIN_JWT).then(res => res.body)
        )
    );
};

const deleteUsers = usersList => {
    const deleteUsersP = usersList.map(u => request(app).delete(`/users/${u.id}`).set('Authorization', ADMIN_JWT));

    return Promise.all(deleteUsersP);
};


before(async () => {
    await createUsers(users)
        .then(createdUsers => USERS = createdUsers)
        .then(_ => USERS.forEach(u => u.should.have.properties(['id', 'email', 'role', 'token'])));

    await createGroups(groups, USERS).then(res => {
        GROUPS = res.groups;
    });
    await createEvents(events, USERS, GROUPS);

    EVENTS = await request(app).get(`/events`).set('Authorization', ADMIN_JWT).then(res => res.body);

    console.log(EVENTS);
});



// could be more complete
describe('Event visibility', () => {
    it('should set event visibility', done => {
        const arkoseEvent = EVENTS.find(e => e.name.includes('Arkose'));
        const familyGroup = GROUPS.find(g => g.name.includes('Fami'));

        C_USER = arkoseEvent.user;

        console.log(arkoseEvent);

        request(app)
            .post(`/users/${arkoseEvent.user.id}/events/${arkoseEvent.id}`)
            .set('Authorization', ADMIN_JWT)
            .send({
                groups_ids: [familyGroup.id],
                users_ids: [USERS[4].id]
            })
            .expect(200).expect(res => {
                console.log(res.body);
            }).end(done);
    });
});

// could be more complete
describe('Get calendar', () => {
    it('get user calendar', done => {
        request(app)
            .get(`/users/${C_USER.id}/calendar`)
            .set('Authorization', USERS[0].token)
            .expect(200).expect(res => {
                res.body.forEach(event => checkEvent(event));
            }).end(done);
    });
});

after(async () => {
    return await deleteUsers(USERS)
        .then(usersResponse => usersResponse.map(res => res.body))
        .then(users => users.forEach(u => u.should.have.properties(['id', 'email', 'role'])));
});
