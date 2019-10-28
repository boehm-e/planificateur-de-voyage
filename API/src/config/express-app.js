import express        from 'express';
import passport       from 'passport';
import passportJWT    from 'passport-jwt';
import bodyParser     from 'body-parser';
import logger         from 'morgan';
import cookieParser   from 'cookie-parser';
import path           from 'path';
import securityConfig from './security';
import User           from '../models/user';

const app	 = express();


// Extract JWT from header OR cookie
const AUTH_HEADER = 'authorization';

const customJWTExtractor = req => {
    let token = null;

    if (req.headers[AUTH_HEADER]) {
        token = req.headers[AUTH_HEADER].match(/(\S+)\s+(\S+)/)[2]; // remove 'JWT' prefix
    } else if (req.cookies) {
        token = req.cookies['jwt'];
    }

    return token;
};




const JwtStrategy = passportJWT.Strategy;
const opts = {
    // jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    jwtFromRequest: customJWTExtractor,
    secretOrKey: securityConfig.jwtSecret
};


app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

// init passport
app.use(passport.initialize());
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.getById(jwt_payload.id);
        done(null, user);
    } catch (err) {
        done(null, false, { message: 'this JWT is not valid anymore' });
    }
}));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  next();
});


export default app;
