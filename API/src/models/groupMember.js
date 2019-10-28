import _         from 'lodash';
import User      from './user';
import Group     from './group';
import Bookshelf from '../config/bookshelf';
import errors    from '../helpers/errors';
import fmt       from '../helpers/formatters';

var GroupMember = Bookshelf.Model.extend({
    tableName: 'group_members',
    idAttribute: 'id',
    hidden: [],

    user() {
        return this.belongsTo('User', 'user_id');
    },

    group() {
        return this.belongsTo('Group', 'group_id');
    },

    async delete() {
        return await this.destroy();
    }
}, {
    async create(body) {
        const realbody = _.pick(body, ['group_id', 'user_id', 'accepted']);
        const e = (await new this(realbody).save()).toJSON();
        const invitation = await this.where({id: e.id}).fetch({withRelated: ['user', 'user.role']});

        return invitation.toJSON();
    },

    async getPendingByUser(user_id) {
        const invitations = await this
              .where({user_id, accepted: null})
        //    .fetchAll({withRealted: ['group']});
              .fetchAll() // BUG : withRelated is not fetching groups, need to do it manually
              .then(async invits => {
                  await Promise.all(invits.map(invit => invit.related('group').fetch()));
                  return invits;
              });

        return invitations.toJSON();
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

module.exports = Bookshelf.model('GroupMember', GroupMember);
