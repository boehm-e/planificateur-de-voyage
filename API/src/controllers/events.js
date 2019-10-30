import Joi          from '@hapi/joi';
import eventService from '../services/events';

const joiSchema = Joi.object().keys({
    type: Joi.string().min(3).required(),
    name: Joi.string().min(3).required(),
    date: Joi.date().iso().required(),
    location_id: Joi.number().integer().required(),
    trip_id: Joi.number().integer().required()
});

const getAll = async (req, res, next) => {
    try {
        var events = await eventService.getAll();
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(events);
};

const create = async (req, res, next) => {
    const body = {
        type: req.body.type,
        name: req.body.name,
        date: new Date(req.body.date),
        location_id: req.body.location_id,
        trip_id: req.body.trip_id,
        user_id: req.user.id,
    };

    console.log("CREATE EVENT CONTROLLER : ", body);

    try {
        var event = await eventService.create(body);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(event);
};

const addEventToReq = async (req, res, next) => {
    const id = req.params.id;

    try {
        var event = await eventService.getById(id);
    } catch (err) {
        /* istanbul ignore else  */
        if (err.name == 'EVENT_NOT_FOUND') {
            const error = {
                code: 404,
                message: `[Not Found]\nEvent with id ${id} not found.`
            };

            req.log.warn(error);
            return res.status(404).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    req.event = event;

    return next();
};

const getById = async (req, res, next) => {
    if (!req.event) {
        await addEventToReq(req, res, _ => getById(req, res));
    }

    return res.json(req.event);
};

const inviteUsers = async (req, res, next) => {
    const atendeesEmails = req.body;
    const event_id = req.params.id;

    try {
        await Promise.all(
            atendeesEmails.map(user_email => eventService.inviteUserByEmail(event_id, user_email))
        );

        var event = await eventService.getById(event_id);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(event);
};

const respondToInvitation  = async (req, res, next) => {
    const event_id = parseInt(req.params.id);
    const user_id = parseInt(req.params.user_id);
    const accept = req.body.accept;

    try {
        var event = await eventService.getById(event_id);

        if (!event.atendees.map(u => u.id).includes(user_id)) {
            return res.status(404).end(`No invitation to event number ${event.id} for user ${user_id}`);
        }

        const { invitation_id } = event.atendees.find(u => u.id == user_id);
        await eventService.respondToInvitation(invitation_id, accept);

        event = await eventService.getById(event_id);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(event);
};

const cancel = async (req, res, next) => {
    const event_id = req.params.id;

    try {
        await eventService.cancel(event_id);
        var event = await eventService.getById(event_id);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(event);
};

export default {getAll, create, addEventToReq, getById, inviteUsers, respondToInvitation, cancel, joiSchema};
