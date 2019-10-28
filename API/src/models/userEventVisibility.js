import _         from 'lodash';
import User      from './user';
import Event     from './event';
import Group     from './group';
import Bookshelf from '../config/bookshelf';
import errors    from '../helpers/errors';
import fmt       from '../helpers/formatters';

var UserEventVisibility = Bookshelf.Model.extend({
    tableName: 'user_event_visibility',
    hidden: [],

    user() {
        return this.belongsTo('User', 'user_id');
    },

    event() {
        return this.belongsTo('Event', 'event_id');
    },

    visible_users() {
        return this.belongsToMany('User', 'visible_to_user_id');
    },

    visible_groups() {
        return this.belongsToMany('Group', 'visible_to_group_id');
    },

    async delete() {
        return await this.destroy();
    }
}, {

    async delete(id) {
        try {
            var destroy = await new this({id}).destroy({require: true});
        } catch (e) {
            return false;
        }
        return true;
    }
});

module.exports = Bookshelf.model('UserEventVisibility', UserEventVisibility);
