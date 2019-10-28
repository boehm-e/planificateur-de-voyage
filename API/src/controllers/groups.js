import Joi          from '@hapi/joi';
import groupService from '../services/groups';

const joiSchema = Joi.object().keys({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required()
});

const getAll = async (req, res, next) => {
    try {
        var events = await groupService.getAll();
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(events);
};

const create = async (req, res, next) => {
    const body = {
        name: req.body.name,
        description: req.body.description,
        user_id: req.user.id
    };

    try {
        var group = await groupService.create(body);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(group);
};

const addGroupToReq = async (req, res, next) => {
    const id = req.params.id;

    try {
        var group = await groupService.getById(id);
    } catch (err) {
        /* istanbul ignore else  */
        if (err.name == 'GROUP_NOT_FOUND') {
            const error = {
                code: 404,
                message: `[Not Found]\nGroup with id ${id} not found.`
            };

            req.log.warn(error);
            return res.status(404).json(error);
        } else {
            req.log.error(err);
            return next(err);
        }
    }

    req.group = group;

    return next();
};

const getById = async (req, res, next) => {
    if (!req.group) {
        await addGroupToReq(req, res, _ => getById(req, res));
    }

    return res.json(req.group);
};

const inviteUsers = async (req, res, next) => {
    const usersEmails = req.body;
    const group_id = req.params.id;

    try {
        await Promise.all(
            usersEmails.map(user_email => groupService.inviteUserByEmail(group_id, user_email))
        );

        var group = await groupService.getById(group_id);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(group);
};

const respondToInvitation  = async (req, res, next) => {
    const group_id = parseInt(req.params.id);
    const user_id = parseInt(req.params.user_id);
    const accept = req.body.accept;

    try {
        var group = await groupService.getById(group_id);

        if (!group.members.map(u => u.id).includes(user_id)) {
            return res.status(404).end(`No invitation to group number ${group.id} for user ${user_id}`);
        }

        const { invitation_id } = group.members.find(u => u.id == user_id);
        await groupService.respondToInvitation(invitation_id, accept);

        group = await groupService.getById(group_id);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(group);
};

const deleteGroup  = async (req, res, next) => {
    const group_id = req.params.id;

    try {
        await groupService.deleteGroup(group_id);
        var group = await groupService.getById(group_id);
    } catch (err) {
        req.log.error(err);
        return next(err);
    }

    return res.json(group);
};

export default {getAll, create, addGroupToReq, getById, inviteUsers, respondToInvitation, deleteGroup, joiSchema};
