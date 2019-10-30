import Joi          from '@hapi/joi';
import tripService from '../services/trip';

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

export default {getAll, create, getById, joiSchema};
