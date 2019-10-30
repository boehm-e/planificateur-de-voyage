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

userRoutes.route('/:id/trips')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        userCtrl.listTrips
    );

userRoutes.route('/:id/events')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        userCtrl.listEvents
    );

export default userRoutes;
