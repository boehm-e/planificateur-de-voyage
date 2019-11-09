import express  from 'express';
import passport from 'passport';
import locationCtrl from '../controllers/location';
import authCtrl from '../controllers/auth';

const locationRoutes = express.Router();

const notImplemented = (req, res) => res.end('Not Implemented Yet');


locationRoutes.route('/')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeAdmin,
        locationCtrl.getAll
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        // authCtrl.authorizeSelfAndAdmin,
        locationCtrl.create
    );

locationRoutes.route('/:id')
    .get(
        passport.authenticate('jwt', { session: false }),
        // authCtrl.authorizeSelfAndAdmin,
        locationCtrl.getById
    )
    // .put(
    //     passport.authenticate('jwt', { session: false }),
    //     authCtrl.authorizeSelfAndAdmin,
    //     locationCtrl.updateById
    // )
    // .delete(
    //     passport.authenticate('jwt', { session: false }),
    //     authCtrl.authorizeSelfAndAdmin,
    //     locationCtrl.removeById
    // );


export default locationRoutes;
