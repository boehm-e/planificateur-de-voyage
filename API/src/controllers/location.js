import Joi          from '@hapi/joi';
import locationService from '../services/location';

const joiSchema = Joi.object().keys({
    name: Joi.string().min(3).required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
});

const getAll = async (req, res, next) => {
    try {
        var locations = await locationService.getAll();
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(locations);
};

const create = async (req, res, next) => {
    const body = {
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    };

    try {
        var location = await locationService.create(body);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(location);
};


const getById = async (req, res, next) => {
    if (!req.location) {
        await addEventToReq(req, res, _ => getById(req, res));
    }

    return res.json(req.location);
};

export default {getAll, create, getById, joiSchema};
