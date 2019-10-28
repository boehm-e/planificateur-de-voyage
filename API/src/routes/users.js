import express  from 'express';
import passport from 'passport';
import userCtrl from '../controllers/users';
import authCtrl from '../controllers/auth';

const userRoutes = express.Router();

const notImplemented = (req, res) => res.end('Not Implemented Yet');


userRoutes.route('/')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeAdmin,
        userCtrl.getAll
    )
    .post(userCtrl.create);

userRoutes.route('/:id')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        userCtrl.getById
    )
    .put(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        userCtrl.updateById
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        userCtrl.removeById
    );

userRoutes.route('/:id/groups')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        userCtrl.listGroups
    );

userRoutes.route('/:id/events')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        userCtrl.listEvents
    );

userRoutes.route('/:id/notifications')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        userCtrl.listNotifications
    );

userRoutes.route('/:id/events/:event_id')
    .post(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        userCtrl.setEventVisibility
    );

userRoutes.route('/:id/calendar')
    .get(
        passport.authenticate('jwt', { session: false }),
        userCtrl.calendar
    );

export default userRoutes;
