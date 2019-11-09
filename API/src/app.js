import path         from 'path';
import http         from 'http';
import pino         from 'pino';
import pinoExpress  from 'express-pino-logger';
import swaggerUi    from 'swagger-ui-express';
import YAML         from 'yamljs';

import app          from './config/express-app';
import usersRoutes  from './routes/users';
import rolesRoutes  from './routes/roles';
import authRoutes   from './routes/auth';
import tripRoutes   from './routes/trip';
import eventsRoutes from './routes/events';
import locationRoutes from './routes/location';

const port   	= process.env.PORT || 3000;
const server	= http.createServer(app);

// setup pino logger
const logger  = pino();
app.use(pinoExpress());

// api documentation
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'doc.yml'));
app.use(['/documentation', '/doc'], swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/trip', tripRoutes);
app.use('/location', locationRoutes);


app.get('/health-check', (_req, res) => {
    res.json({success: true});
});

if (!module.parent){ // http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
    server.listen(port, _ => logger.info(`server listening on port ${port}`));
}
module.exports = app;
