import _           from 'lodash';
import User        from './user';
import GroupMember from './groupMember';
import Bookshelf   from '../config/bookshelf';
import errors      from '../helpers/errors';
import fmt         from '../helpers/formatters';

var Group = Bookshelf.Model.extend({
    tableName: 'groups',
    idAttribute: 'id',
    hidden: [],

    user() {
        return this.belongsTo('User', 'user_id');
    },

    members() {
        return this.hasMany('GroupMember', 'group_id');
    },

    async update(body) {
        const realbody = _.pick(body, ['name', 'description', 'deleted', 'user_id']);

        this.set(realbody);
        return await (await this.save()).fetch({withRelated: ['user', 'user.role', 'members', 'members.user', 'members.user.role']});
    },

    async delete() {
        return await this.destroy();
    }
}, {
    async getAll() {
        const groupList = await this.query({}).fetchAll({withRelated: ['user', 'user.role', 'members', 'members.user', 'members.user.role']});

        return groupList
            .map(group => group.toJSON())
            .map(fmt.group);
    },

    async getByUser(user_id) { // there must be a cleaner way to do that
        const rawResult = await Bookshelf.knex.raw(
            `SELECT groups.id FROM groups LEFT JOIN group_members ON group_members.group_id = groups.id  WHERE groups.user_id = ? OR group_members.user_id = ?`,
            [user_id, user_id]
        );
        const userGroupsIds = rawResult[0].map(o => o.id);
        const groups = await this
              .where('id', 'in', userGroupsIds)
              .fetchAll({withRelated: ['user', 'user.role', 'members', 'members.user', 'members.user.role']});

        return groups
            .map(group => group.toJSON())
            .map(fmt.group);

    },

    async getById(id) {
        const group =  await this.where({id}).fetch({withRelated: ['user', 'user.role', 'members', 'members.user', 'members.user.role']});

        if (group == null) {
            throw new errors.GROUP_NOT_FOUND();
            return false;
        }

        return fmt.group(group.toJSON());
    },
    async create(body) {
        const realbody = _.pick(body, ['name', 'description', 'user_id']);
        const e = (await new this(realbody).save()).toJSON();
        const group = await this.where({id: e.id}).fetch({withRelated: ['user', 'user.role', 'members', 'members.user', 'members.user.role']});

        return fmt.group(group.toJSON());
    },
    async delete(id) {
        try {
            var destroy = await new this({id}).destroy({require: true});
        } catch (e) {
            return false;
        }
        return true;
    }
});

module.exports = Bookshelf.model('Group', Group);
