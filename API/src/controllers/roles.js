import Joi  from '@hapi/joi';
import Role from '../models/role';

const joiSchema = Joi.object().keys({
    authority: Joi.string().alphanum().min(3).required()
});

const getAll = async (req, res, next) => {
    try {
        var roles = await Role.getAll();
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(roles);
};

const create = async (req, res, next) => {
    try {
        var role = await Role.create(req.body);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(role);
};

const getById = async (req, res, next) => {
    const id = req.params.id;

    try {
        var role = await Role.getById(id);
    } catch (err) {
        /* istanbul ignore else  */
        if (err.name == 'ROLE_NOT_FOUND') {
            const error = {
                code: 404,
                message: `[Not Found]\nRole with id ${id} not found.`
            };

            req.log.warn(error);
            return res.status(404).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    return res.json(role);
};


const removeById = async (req, res, next) => {
    const id = req.params.id;

    try {
        var role = await Role.getById(id);
        await Role.delete(id);
    } catch (err) {
        /* istanbul ignore else  */
        if (err.name == 'ROLE_NOT_FOUND') {
            const error = {
                code: 404,
                message: `[Not Found]\nRole with id ${id} not found.`
            };

            req.log.warn(error);
            return res.status(404).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    return res.json(role);
};

export default {getAll, joiSchema, create, getById, removeById};
