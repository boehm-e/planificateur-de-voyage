import express    from 'express';
import passport   from 'passport';
import utils      from '../helpers/utils';
import authCtrl   from '../controllers/auth';
import groupsCtrl from '../controllers/groups';

const groupsRoutes = express.Router();

const notImplemented = (req, res) => res.end('Not Implemented Yet');

groupsRoutes.route('/')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeAdmin,
        groupsCtrl.getAll
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        utils.validateReqBody(groupsCtrl.joiSchema),
        groupsCtrl.create
    );

groupsRoutes.route('/:id')
    .get(
        passport.authenticate('jwt', { session: false }),
        groupsCtrl.addGroupToReq,
        authCtrl.authorizeFnList([
            req => [req.group.user.id, ...req.group.members.map(u => u.id)].includes(req.user.id)
        ]),
        groupsCtrl.getById
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        groupsCtrl.addGroupToReq,
        authCtrl.authorizeFnList([
            req => req.group.user.id == req.user.id
        ]),
        groupsCtrl.inviteUsers
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        groupsCtrl.addGroupToReq,
        authCtrl.authorizeFnList([
            req => req.group.user.id == req.user.id
        ]),
        groupsCtrl.deleteGroup
    );

groupsRoutes.route('/:id/:user_id')
    .put(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeFnList([
            req => req.params.user_id == req.user.id
        ]),
        groupsCtrl.respondToInvitation
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        notImplemented
    );

export default groupsRoutes;
