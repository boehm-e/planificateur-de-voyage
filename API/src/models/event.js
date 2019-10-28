import _            from 'lodash';
import User         from './user';
import EventAtendee from './eventAtendee';
import Bookshelf    from '../config/bookshelf';
import errors       from '../helpers/errors';
import fmt          from '../helpers/formatters';

var Event = Bookshelf.Model.extend({
    tableName: 'event',
    idAttribute: 'id',
    hidden: [],

    user() {
        return this.belongsTo('User', 'user_id');
    },

    atendees() {
        return this.hasMany('EventAtendee');
    },

    async update(body) {
        const realbody = _.pick(body, ['name', 'start', 'end', 'user_id', 'canceled']);

        this.set(realbody);
        return await (await this.save()).fetch({withRelated: ['user', 'user.role', 'atendees', 'atendees.user']});
    },

    async delete() {
        return await this.destroy();
    }
}, {
    async getAll() {
        const eventList = await this.query({}).fetchAll({withRelated: ['user', 'user.role', 'atendees', 'atendees.user', 'atendees.user.role']});

        return eventList
            .map(event => event.toJSON())
            .map(fmt.event);
    },

    async getByUser(user_id) { // there must be a cleaner way to do that
        const rawResult = await Bookshelf.knex.raw(
            `SELECT event.id FROM event LEFT JOIN event_atendees ON event_atendees.event_id = event.id  WHERE event.user_id = ? OR event_atendees.user_id = ?`,
            [user_id, user_id]
        );
        const userEventsIds = rawResult[0].map(o => o.id);
        const events = await this
              .where('id', 'in', userEventsIds)
              .fetchAll({withRelated: ['user', 'user.role', 'atendees', 'atendees.user', 'atendees.user.role']});

        return events
            .map(event => event.toJSON())
            .map(fmt.event);

    },

    async getById(id) {
        const event =  await this.where({id}).fetch({withRelated: ['user', 'user.role', 'atendees', 'atendees.user', 'atendees.user.role']});

        if (event == null) {
            throw new errors.EVENT_NOT_FOUND();
            return false;
        }

        return fmt.event(event.toJSON());
    },
    async create(body) {
        const realbody = _.pick(body, ['name', 'start', 'end', 'user_id', 'canceled']);
        const e = (await new this(realbody).save()).toJSON();
        const event = await this.where({id: e.id}).fetch({withRelated: ['user', 'user.role', 'atendees', 'atendees.user']});

        return fmt.event(event.toJSON());
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

module.exports = Bookshelf.model('Event', Event);
