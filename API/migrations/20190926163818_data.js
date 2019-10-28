// const moment = require('moment');
// const bcrypt = require('bcrypt');
//
// const USERS_TABLE = 'user';
// const GROUPS_TABLE = 'groups';
// const GROUPS_MEMBERS_TABLE = 'group_members';
// const EVENTS_TABLE = 'event';
// const EVENT_ATENDEES_TABLE = 'event_atendees';
//
// const H = passwd => bcrypt.hashSync(passwd, 10);
//
// const _users = [
//     // Famille Dupont
//     {email: 'bob.dupont@gmail.com',      password: H('passBob')},      // Papa
//     {email: 'alice.dupont@gmail.com',    password: H('passAlice')},    // Maman
//     {email: 'bryan.dupont@gmail.com',    password: H('passBryan')},    // Enfant
//     {email: 'eleanor.dupont@gmail.com',  password: H('passEleanor')},  // Enfant
//     {email: 'guy.dupont@gmail.com',      password: H('passGuy')},      // Papi
//     {email: 'paulette.dupont@gmail.com', password: H('passPaulette')}, // Mamie
//     {email: 'emilie.dupont@gmail.com',   password: H('passEmilie')},   // Nourrice
//
//     // Famille Martin
//     {email: 'romain.martin@gmail.com',  password: H('passRomain')},  // Papa
//     {email: 'aurore.martin@gmail.com',  password: H('passAurore')},  // Maman
//     {email: 'emy.martin@gmail.com',     password: H('passEmy')},     // Enfant
//     {email: 'karl.martin@gmail.com',    password: H('passKarl')},    // Enfant
//     {email: 'theo.martin@gmail.com',    password: H('passTheo')},    // Enfant
//     {email: 'patrice.martin@gmail.com', password: H('passPatrice')}, // Papi
//     {email: 'colette.martin@gmail.com', password: H('passColette')}, // Mamie
//
//     // Famille Robert
//     {email: 'eric.robert@gmail.com',     password: H('passEric')},     // Papa
//     {email: 'anna.robert@gmail.com',     password: H('passAnna')},     // Maman
//     {email: 'nicolas.robert@gmail.com',  password: H('passNicolas')},  // Enfant
//     {email: 'julie.robert@gmail.com',    password: H('passJulie')},    // Enfant
//     {email: 'henri.robert@gmail.com',    password: H('passHenri')},    // Papi
//     {email: 'juliette.robert@gmail.com', password: H('passJuliette')}, // Mamie
//
//     // Cercle amis adultes
//     {email: 'steven.boehm@gmail.com',    password: H('passSteven')}, // arkose, drink, famille
//     {email: 'erwan.boehm@gmail.com',     password: H('passErwan')},  // arkose, drink, famille
//     {email: 'eric.delanghe@gmail.com',   password: H('passEric')},   // arkose, drink, judo
//     {email: 'anna.gomez@gmail.com',      password: H('passAnna')},   // drink, vtt
//     {email: 'jean.jouzel@gmail.com',     password: H('passJean')},   // vtt, arkose
//     {email: 'marine.tiger@gmail.com',    password: H('passMarine')}, // famille, arkose
//     {email: 'oceane.galfano@gmail.com',  password: H('passOceane')}, // famille, drink
//     {email: 'george.marchais@gmail.com', password: H('passGeorge')}, // vtt, famille, judo
//     {email: 'yann.jadot@gmail.com',      password: H('passYann')},   // vtt, arkose
//
//     // Cercle armis enfants
//     {email: 'gabriel.durand@gmail.com', password: H('passGabriel')}, // judo, ecole
//     {email: 'leo.jouzel@gmail.com',     password: H('passLeo')},     // vtt, ecole
//     {email: 'emma.jouzel@gmail.com',    password: H('passEmma')},    // judo, ecole
//     {email: 'louis.durand@gmail.com',   password: H('passLouis')},   // arkose, ecole
//     {email: 'lucas.flis@gmail.com',     password: H('passLucas')},   // vtt, arkose
//     {email: 'jade.flis@gmail.com',      password: H('passJade')},    // ecole, judo
//     {email: 'louise.arnault@gmail.com', password: H('passLouise')},  // judo, arkose, ecole
//     {email: 'adam.arnault@gmail.com',   password: H('passAdam')},    // vtt, ecole
//     {email: 'alice.arnault@gmail.com',  password: H('passAlice')},   // ecole
// ];
//
//
// const d = dateString => moment(new Date(dateString)).format("YYYY-MM-DD HH:mm:ss");
//
// exports.up = async function(knex) {
//     /*
//      * Create users
//      */
//     await knex(USERS_TABLE).insert(_users);
//     const users = await knex.select().table(USERS_TABLE);
//
//     console.log(users);
//
//     const uid = email => users.find(u => u.email == email).id;
//
//     /*
//      * Create groups
//      */
//     const _groups = [
//         {name: 'Arkose', description: 'Groupe de gens qui grimpent !',  user_id: uid('bob.dupont@gmail.com')},
//         {name: 'Drink',  description: 'Groupe de gens qui boivent !',   user_id: uid('aurore.martin@gmail.com')},
//         {name: 'FamilyD',description: 'Groupe de la famille Dupont',    user_id: uid('anna.robert@gmail.com')},
//         {name: 'VTT',    description: 'Groupe Vélo Tout Terrain',       user_id: uid('jean.jouzel@gmail.com')},
//         {name: 'Judo',   description: 'Groupe de gens qui judottent !', user_id: uid('eric.delanghe@gmail.com')},
//         {name: 'Ecole',  description: 'Groupe de jeune gens !',         user_id: uid('eric.robert@gmail.com')},
//     ];
//
//     await knex(GROUPS_TABLE).insert(_groups);
//     const groups = await knex.select().table(GROUPS_TABLE);
//
//     const gid = name => groups.find(g => g.name == name).id;
//
//     /*
//      * Add members to groups
//      */
//     const _groupMembers = [
//         {user_id: uid('erwan.boehm@gmail.com'),    group_id: gid('Arkose'), accepted: null},
//         {user_id: uid('eric.delanghe@gmail.com'),  group_id: gid('Arkose'), accepted: true},
//         {user_id: uid('jean.jouzel@gmail.com'),    group_id: gid('Arkose'), accepted: true},
//         {user_id: uid('marine.tiger@gmail.com'),   group_id: gid('Arkose'), accepted: true},
//         {user_id: uid('yann.jadot@gmail.com'),     group_id: gid('Arkose'), accepted: true},
//         {user_id: uid('louis.durand@gmail.com'),   group_id: gid('Arkose'), accepted: true},
//         {user_id: uid('lucas.flis@gmail.com'),     group_id: gid('Arkose'), accepted: true},
//         {user_id: uid('louise.arnault@gmail.com'), group_id: gid('Arkose'), accepted: true},
//         {user_id: uid('steven.boehm@gmail.com'),   group_id: gid('Arkose'), accepted: true},
//
//         {user_id: uid('erwan.boehm@gmail.com'),    group_id: gid('Drink'), accepted: true},
//         {user_id: uid('eric.delanghe@gmail.com'),  group_id: gid('Drink'), accepted: true},
//         {user_id: uid('anna.gomez@gmail.com'),     group_id: gid('Drink'), accepted: true},
//         {user_id: uid('oceane.galfano@gmail.com'), group_id: gid('Drink'), accepted: true},
//         {user_id: uid('steven.boehm@gmail.com'),   group_id: gid('Drink'), accepted: true},
//
//         {user_id: uid('jean.jouzel@gmail.com'),     group_id: gid('VTT'), accepted: true},
//         {user_id: uid('george.marchais@gmail.com'), group_id: gid('VTT'), accepted: true},
//         {user_id: uid('yann.jadot@gmail.com'),      group_id: gid('VTT'), accepted: true},
//         {user_id: uid('leo.jouzel@gmail.com'),      group_id: gid('VTT'), accepted: true},
//         {user_id: uid('lucas.flis@gmail.com'),      group_id: gid('VTT'), accepted: true},
//         {user_id: uid('adam.arnault@gmail.com'),    group_id: gid('VTT'), accepted: true},
//         {user_id: uid('anna.gomez@gmail.com'),      group_id: gid('VTT'), accepted: true},
//
//         {user_id: uid('erwan.boehm@gmail.com'),     group_id: gid('Judo'), accepted: null},
//         {user_id: uid('george.marchais@gmail.com'), group_id: gid('Judo'), accepted: true},
//         {user_id: uid('gabriel.durand@gmail.com'),  group_id: gid('Judo'), accepted: true},
//         {user_id: uid('emma.jouzel@gmail.com'),     group_id: gid('Judo'), accepted: true},
//         {user_id: uid('jade.flis@gmail.com'),       group_id: gid('Judo'), accepted: true},
//         {user_id: uid('louise.arnault@gmail.com'),  group_id: gid('Judo'), accepted: true},
//         {user_id: uid('eric.delanghe@gmail.com'),   group_id: gid('Judo'), accepted: true},
//
//         {user_id: uid('paulette.dupont@gmail.com'), group_id: gid('FamilyD'), accepted: true},
//         {user_id: uid('guy.dupont@gmail.com'),      group_id: gid('FamilyD'), accepted: true},
//         {user_id: uid('eleanor.dupont@gmail.com'),  group_id: gid('FamilyD'), accepted: true},
//         {user_id: uid('bryan.dupont@gmail.com'),    group_id: gid('FamilyD'), accepted: true},
//         {user_id: uid('alice.dupont@gmail.com'),    group_id: gid('FamilyD'), accepted: true},
//         {user_id: uid('bob.dupont@gmail.com'),      group_id: gid('FamilyD'), accepted: true},
//         {user_id: uid('emilie.dupont@gmail.com'),   group_id: gid('FamilyD'), accepted: true},
//
//     ];
//
//     await knex(GROUPS_MEMBERS_TABLE).insert(_groupMembers);
//     const groupMembers = await knex.select().table(GROUPS_MEMBERS_TABLE);
//
//     /*
//      * Create events
//      */
//
//     const _events = [
//         {name: 'Competition Judo',              user_id: uid('george.marchais@gmail.com'), start: d('2019-11-01T11:30:00.000Z'), end: d('2019-11-01T15:00:00.000Z')},
//         {name: 'Rando VTT',                     user_id: uid('george.marchais@gmail.com'), start: d('2019-11-02T13:30:00.000Z'), end: d('2019-11-02T16:00:00.000Z')},
//         {name: 'Boire un coup au TrucMush',     user_id: uid('eric.delanghe@gmail.com'),   start: d('2019-11-03T20:30:00.000Z'), end: d('2019-11-03T22:00:00.000Z')},
//         {name: 'Boire un coup Orange Meca',     user_id: uid('eric.delanghe@gmail.com'),   start: d('2019-11-05T20:30:00.000Z'), end: d('2019-11-05T22:00:00.000Z')},
//         {name: 'Boire un coup Dellys',          user_id: uid('erwan.boehm@gmail.com'),     start: d('2019-11-09T20:30:00.000Z'), end: d('2019-11-09T22:00:00.000Z')},
//         {name: 'Dinner avec les grand parents', user_id: uid('alice.dupont@gmail.com'),    start: d('2019-11-10T20:30:00.000Z'), end: d('2019-11-10T22:00:00.000Z')},
//         {name: 'Entrainnement de Judo 1',       user_id: uid('emma.jouzel@gmail.com'),     start: d('2019-11-10T18:30:00.000Z'), end: d('2019-11-10T20:00:00.000Z')},
//         {name: 'Entrainnement de Judo 2',       user_id: uid('emma.jouzel@gmail.com'),     start: d('2019-11-12T18:30:00.000Z'), end: d('2019-11-12T20:00:00.000Z')},
//         {name: 'Entrainnement de Judo 3',       user_id: uid('emma.jouzel@gmail.com'),     start: d('2019-11-14T18:30:00.000Z'), end: d('2019-11-14T20:00:00.000Z')},
//     ];
//
//     await knex(EVENTS_TABLE).insert(_events);
//     const events = await knex.select().table(EVENTS_TABLE);
//
//     const eid = (name, user_id) => events.find(e => e.name == name && e.user_id == user_id).id;
//
//     /*
//      * Add users to events
//      */
//     // n for people who do not respond to the invitation ==> null
//     const inviteUsers = (event_id, users_emails, proba = 1, nil = 0) => {
//         return users_emails.map(user_email => {
//             const random = Math.random();
//             const accepted = nil == 0
//                   ? random < proba
//                   : random > (proba + nil) ? random < proba : null;
//
//             return {event_id, user_id: uid(user_email), accepted};
//         });
//     };
//
//     const _usersInvites = [
//         ...inviteUsers(
//             eid('Competition Judo', uid('george.marchais@gmail.com')),
//             ['gabriel.durand@gmail.com','emma.jouzel@gmail.com','jade.flis@gmail.com','eric.delanghe@gmail.com'],
//             0.7, 0.1
//         ),
//         ...inviteUsers(
//             eid('Rando VTT', uid('george.marchais@gmail.com')),
//             ['jean.jouzel@gmail.com','adam.arnault@gmail.com','lucas.flis@gmail.com','leo.jouzel@gmail.com','yann.jadot@gmail.com','anna.gomez@gmail.com'],
//             0.7, 0.2
//         ),
//         ...inviteUsers(
//             eid('Boire un coup au TrucMush', uid('eric.delanghe@gmail.com')),
//             ['erwan.boehm@gmail.com','oceane.galfano@gmail.com','anna.gomez@gmail.com','steven.boehm@gmail.com']
//         ),
//         ...inviteUsers(
//             eid('Boire un coup Orange Meca', uid('eric.delanghe@gmail.com')),
//             ['erwan.boehm@gmail.com','oceane.galfano@gmail.com','anna.gomez@gmail.com','steven.boehm@gmail.com'],
//             0.2, 0.7
//         ),
//         ...inviteUsers(
//             eid('Boire un coup Dellys', uid('erwan.boehm@gmail.com')),
//             ['eric.delanghe@gmail.com','oceane.galfano@gmail.com','anna.gomez@gmail.com','steven.boehm@gmail.com']
//         ),
//         ...inviteUsers(
//             eid('Dinner avec les grand parents', uid('alice.dupont@gmail.com')),
//             ['guy.dupont@gmail.com','eleanor.dupont@gmail.com','bryan.dupont@gmail.com','bob.dupont@gmail.com','paulette.dupont@gmail.com', 'erwan.boehm@gmail.com'],
//             0.5, 0.3
//         ),
//         ...inviteUsers(
//             eid('Entrainnement de Judo 1', uid('emma.jouzel@gmail.com')),
//             ['gabriel.durand@gmail.com','george.marchais@gmail.com','jade.flis@gmail.com','eric.delanghe@gmail.com', 'erwan.boehm@gmail.com'],
//             0.2, 0.7
//         ),
//         ...inviteUsers(
//             eid('Entrainnement de Judo 2', uid('emma.jouzel@gmail.com')),
//             ['gabriel.durand@gmail.com','george.marchais@gmail.com','jade.flis@gmail.com','eric.delanghe@gmail.com', 'erwan.boehm@gmail.com'],
//             0.2, 0.5
//         )
//     ];
//
//     await knex(EVENT_ATENDEES_TABLE).insert(_usersInvites);
//     const usersInvites = await knex.select().table(EVENT_ATENDEES_TABLE);
//
//     console.log({users,groups,groupMembers,events,usersInvites});
// };
//
// exports.down = async function(knex) {
//     await knex(USERS_TABLE).del();
//     await knex(GROUPS_TABLE).del();
//     await knex(GROUPS_MEMBERS_TABLE).del();
//     await knex(EVENTS_TABLE).del();
//     await knex(EVENT_ATENDEES_TABLE).del();
// };
