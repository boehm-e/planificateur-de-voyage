import express  from 'express';
import passport from 'passport';
import utils    from '../helpers/utils';
import roleCtrl from '../controllers/roles';
import authCtrl from '../controllers/auth';

const roleRoutes = express.Router();

roleRoutes.route('/')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeAdmin,
        roleCtrl.getAll
    )
    .post(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeAdmin,
        utils.validateReqBody(roleCtrl.joiSchema),
        roleCtrl.create
    );

roleRoutes.route('/:id')
    .get(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeAdmin,
        roleCtrl.getById
    )
    .delete(
        passport.authenticate('jwt', { session: false }),
        authCtrl.authorizeAdmin,
        roleCtrl.removeById
    );

export default roleRoutes;
