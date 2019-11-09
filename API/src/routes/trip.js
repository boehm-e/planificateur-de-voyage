import express  from 'express';
import passport from 'passport';
import tripCtrl from '../controllers/trip';
import authCtrl from '../controllers/auth';

const tripRoutes = express.Router();

const notImplemented = (req, res) => res.end('Not Implemented Yet');


tripRoutes.route('/')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeAdmin,
        tripCtrl.getAll
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        // authCtrl.authorizeSelfAndAdmin,
        tripCtrl.create
    );

tripRoutes.route('/:id')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeSelfAndAdmin,
        tripCtrl.getById
    )
    // .put(
    //     passport.authenticate('jwt', { session: false }),
    //     authCtrl.authorizeSelfAndAdmin,
    //     tripCtrl.updateById
    // )
    .delete(
        passport.authenticate('jwt', { session: false }),
        // authCtrl.authorizeSelfAndAdmin,
        tripCtrl.removeById
    );


export default tripRoutes;
