import jwt            from 'jwt-simple';
import securityConfig from '../config/security';
import User           from '../models/user';

const login = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        var user = await User.find(email, password);
        var token = jwt.encode(user, securityConfig.jwtSecret);
    } catch (err) {
        /* istanbul ignore else  */
        if (err.name == "INVALID_PASSWORD"
            || err.name == "WRONG_PASSWORD_OR_EMAIL") {
            const error = {
                code: 401,
                message: `[Unauthorized]\nLogin failed. Wrong email / password combination.`
            };

            req.log.warn(error);
            return res.status(401).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    return res.json({...user, token: `JWT ${token}`});
};

const auth = (req, res, next) => {
    res.setHeader("X-Forwarded-User", JSON.stringify(req.user));

    return res.status(200).end('OK');
};

const authorizeFnList = (fnList, {code, message} = {code: 401, message: "Unauthorized !"}) => async (req, res, next) => {
    for (let fn of fnList) {
        if (await fn(req)) {
            return next();
        }
    }

    const error = {
        code,
        message
    };

    req.log.warn(error);
    return res.status(code).json(error);
};

const authorizeAdmin  = authorizeFnList([
    req => req.user.role == "ADMIN"
], {code: 403, message: `[Forbidden]\nOnly admin can use this route.`});

const authorizeSelfAndAdmin = authorizeFnList([
    req => req.user.role == "ADMIN",
    req => req.user.id === parseInt(req.params.id)
], {code: 403, message: `[Forbidden]\nOnly admin or self can use this route.`});



export default {login, auth, authorizeFnList, authorizeSelfAndAdmin, authorizeAdmin};
