import Joi          from '@hapi/joi';
import tripService from '../services/trip';
import Trip                from '../models/trip';


const joiSchema = Joi.object().keys({
	name: Joi.string().min(3).required(),
	start_date: Joi.date().iso().required(),
	end_date: Joi.date().iso().required()
});

const getAll = async (req, res, next) => {
	try {
		var trips = await tripService.getAll();
	} catch (err) {
		req.log.error(err);
		return next(err);
	}
	return res.json(trips);
};

const create = async (req, res, next) => {
	const body = {
		name: req.body.name,
		description: req.body.description,
		start_date: new Date(req.body.start_date),
		end_date: new Date(req.body.end_date),
		user_id: req.user.id,
	};

	try {
		var trip = await tripService.create(body);
	} catch (err) {
		req.log.error(err);
		return next(err);
	}

	return res.json(trip);
};


const getById = async (req, res, next) => {
	console.log("DEBUG TRIP CONTROLLER ", req.body);
	const id = req.params.id;
	var trip = await tripService.getById(id);
	return res.json(trip);
};


const removeById = async (req, res, next) => {
    const id = req.params.id;

    try {
        var trip = await Trip.getById(id);
				if (trip.user.id == req.user.id) {
					await Trip.delete(id);
				} else {
					console.log("Not allowed to remove this trip!");
				}
    } catch (err) {
        /* istanbul ignore else  */
        if (err.name == 'TRIP_NOT_FOUND') {
            const error = {
                code: 404,
                message: `[Not Found]\Trip with id ${id} not found.`
            };

            req.log.warn(error);
            return res.status(404).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    return res.json(trip);
};


export default {getAll, create, getById, removeById, joiSchema};
