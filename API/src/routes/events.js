import express       from 'express';
import passport      from 'passport';
import utils         from '../helpers/utils';
import authCtrl      from '../controllers/auth';
import eventsCtrl    from '../controllers/events';
import eventsService from '../services/events';

const eventsRoutes = express.Router();

const notImplemented = (req, res) => res.end('Not Implemented Yet');


eventsRoutes.route('/')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeAdmin,
        eventsCtrl.getAll
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        // utils.validateReqBody(eventsCtrl.joiSchema),
        eventsCtrl.create
    );

eventsRoutes.route('/:id')
    .get(
        passport.authenticate('jwt', { session: false }),
        // authCtrl.authorizeSelfAndAdmin,
        eventsCtrl.getById
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeFnList([
            req => req.event.user.id == req.user.id
        ]),
        eventsCtrl.inviteUsers
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeFnList([
            req => req.event.user.id == req.user.id
        ]),
        eventsCtrl.cancel
    );

// eventsRoutes.route('/:id/:user_id')
//     .put(
//         passport.authenticate('jwt', { session: false }),
//         authCtrl.authorizeFnList([
//             req => req.params.user_id == req.user.id
//         ]),
//         eventsCtrl.respondToInvitation
//     )
//     .delete(
//         passport.authenticate('jwt', { session: false }),
//         notImplemented
//     );

export default eventsRoutes;
