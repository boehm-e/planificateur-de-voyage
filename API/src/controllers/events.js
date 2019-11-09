
import Joi          from '@hapi/joi';
import eventService from '../services/events';
import locationService from '../services/location';
import locationCtrl from './location';

const joiSchema = Joi.object().keys({
    type: Joi.string().min(3).required(),
    name: Joi.string().min(3).required(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso(),
    start_location_id: Joi.number().integer().required(),
    end_location_id: Joi.number().integer(),
    trip_id: Joi.number().integer().required()
});
// const joiSchema = Joi.object().keys({
//     type: Joi.string().min(3).required(),
//     name: Joi.string().min(3).required(),
//     start_date: Joi.date().iso().required(),
//     end_date: Joi.date().iso(),
//     start_location: locationCtrl.joiSchema,
//     end_location: locationCtrl.joiSchema,
//     trip_id: Joi.number().integer().required()
// });

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
    console.log("CONTROLLER CREATE EVENT : ", req.body);
    const startLocationId = (await locationService.create(req.body.start_location)).id;
    console.log("START LOCATION : ", startLocationId);

    const body = {
        type: req.body.type,
        name: req.body.name,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
        start_location_id: startLocationId,
        trip_id: req.body.trip_id,
        user_id: req.user.id,
    };

    if (req.body.end_location != undefined) {
        const endLocationId = (await locationService.create(req.body.end_location)).id;
        body["end_location_id"] = endLocationId;
    }

    try {
        var event = await eventService.create(body);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(event);
};

const getById = async (req, res, next) => {

    const id = req.params.id;
    var event = await eventService.getById(id);

    return res.json(event);
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

export default {getAll, create, getById, inviteUsers, cancel, joiSchema};
