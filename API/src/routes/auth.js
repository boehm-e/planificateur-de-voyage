import express   from 'express';
import passport   from 'passport';
import utils     from '../helpers/utils';
import authCtrl  from '../controllers/auth';
import usersCtrl from '../controllers/users';

const authRoutes = express.Router();

authRoutes.route('/')
    .all(
        passport.authenticate('jwt', { session: false }),
        authCtrl.auth
    );

authRoutes.route('/register')
    .post(
        utils.validateReqBody(usersCtrl.joiSchema),
        usersCtrl.create
    );

authRoutes.route('/login')
    .post(
        utils.validateReqBody(usersCtrl.joiSchema),
        authCtrl.login
    );



export default authRoutes;
