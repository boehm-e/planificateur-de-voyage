import Joi                 from '@hapi/joi';
import Bookshelf           from '../config/bookshelf';
import User                from '../models/user';
import Role                from '../models/role';
import Event               from '../models/event';
import eventService        from '../services/events';
import userService         from '../services/users';
import Group               from '../models/group';
import UserEventVisibility from '../models/userEventVisibility';

const joiSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(3).required()
});


const getAll = async (req, res, next) => {
    try {
        var users = await User.getAll();
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(users);
};

const create = async (req, res, next) => {
    try {
        var user = await User.create(req.body);
    } catch (err) {
        /* istanbul ignore else  */
        if (err.code == 'ER_DUP_ENTRY') {
            const error = {
                code: 409,
                message: `[Conflict]\nEmail ${req.body.email} already taken.`
            };
            req.log.warn(err);
            return res.status(error.code).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    return res.json(user);
};

const getById = async (req, res, next) => {
    const id = req.params.id;

    try {
        var user = await User.getById(id);
    } catch (err) {
        /* istanbul ignore else  */
        if (err.name == 'USER_NOT_FOUND') {
            const error = {
                code: 404,
                message: `[Not Found]\nUser with id ${id} not found.`
            };

            req.log.warn(error);
            return res.status(error.code).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    return res.json(user);
};

const updateById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const update = req.body;

    if (update.role && req.user.role !== "ADMIN") { /* only admin can modify role */
        const error = {
            code: 401,
            message: `[Unauthorized]\nOnly admin can change a user's role.`
        };

        req.log.warn(error);
        return res.status(401).json(error);
    }

    try {
        var user = await User.getRefById(id);
        var newUser = await user.update(update);
    } catch (err) {
        /* istanbul ignore else  */
        if (err.name == 'USER_NOT_FOUND') {
            const error = {
                code: 404,
                message: `[Not Found]\nUser with id ${id} not found.`
            };

            req.log.warn(error);
            return res.status(404).json(error);
        } else if (err.code == 'ER_NO_REFERENCED_ROW_2') {
            const error = {
                code: 400,
                message: `[Bad Request]\nCannot update user's role because role with id ${update.role} does not exists.`
            };

            req.log.warn(error);
            return res.status(400).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    return res.json(newUser);
};


const removeById = async (req, res, next) => {
    const id = req.params.id;

    try {
        var user = await User.getById(id);
        await User.delete(id);
    } catch (err) {
        /* istanbul ignore else  */
        if (err.name == 'USER_NOT_FOUND') {
            const error = {
                code: 404,
                message: `[Not Found]\nUser with id ${id} not found.`
            };

            req.log.warn(error);
            return res.status(404).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    return res.json(user);
};

const listEvents = async (req, res, next) => {
    const user_id = req.params.id;

    try {
        var eventList = await Event.getByUser(user_id);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(eventList);
};

const listGroups = async (req, res, next) => {
    const user_id = req.params.id;

    try {
        var groupList = await Group.getByUser(user_id);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(groupList);
};

const listNotifications = async (req, res, next) => {
    const user_id = req.params.id;
    try {
        var notifications = await userService.getNotifications(user_id);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(notifications);
};

const setEventVisibility = async (req, res, next) => {
    const user_id   = req.params.id;
    const event_id  = req.params.event_id;
    const group_ids = req.body.groups_ids;
    const user_ids  = req.body.users_ids;

    const groupVisibilities = group_ids.map(group_id => ({
        event_id,
        user_id,
        visible_to_group_id: group_id
    }));

    const userVisibilities = user_ids.map(visible_to_user_id => ({
        event_id,
        user_id,
        visible_to_user_id
    }));

    const objectsToInsert = [...groupVisibilities, ...userVisibilities];
    // should be moved in a service
    const visibilities = await Bookshelf.knex('user_event_visibility').insert(objectsToInsert);
    const event = await eventService.getById(event_id);

    return res.json(event);
};

const calendar = async (req, res, next) => {
    const user_id = parseInt(req.params.id);
    const viewer_id = req.user.id;

    const eventList = await eventService.buildCalendar(user_id, viewer_id);

    return res.json(eventList);
};

export default {
    getAll,
    joiSchema,
    create,
    getById,
    updateById,
    removeById,
    listEvents,
    listGroups,
    listNotifications,
    setEventVisibility,
    calendar
};
