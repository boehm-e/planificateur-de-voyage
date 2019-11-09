import _            from 'lodash';
import User         from './user';
import Location     from './location';
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

    trip() {
        return this.belongsTo('Trip', 'trip_id');
    },

    start_location() {
        return this.belongsTo('Location', 'start_location_id');
    },

    end_location() {
        return this.belongsTo('Location', 'end_location_id');
    },


    async update(body) {
        const realbody = _.pick(body, ['type', 'name', 'date', 'start_date', 'end_date', 'start_location_id', 'end_location_id', 'trip_id']);

        this.set(realbody);
        return await (await this.save()).fetch({withRelated: ['user', 'user.role', 'trip', 'trip.name', 'start_location', 'end_location']});
    },

    async delete() {
        return await this.destroy();
    }
}, {
    async getAll() {
        const eventList = await this.query({}).fetchAll({withRelated: ['user', 'user.role', 'trip', 'trip.name', 'start_location', 'end_location']});

        return eventList
            .map(event => event.toJSON())
            .map(fmt.event);
    },

    async getByUser(user_id) { // there must be a cleaner way to do that
        const rawResult = await Bookshelf.knex.raw(
            `SELECT event.id FROM event WHERE event.user_id = ?`,
            [user_id]
        );
        const eventsIds = rawResult[0].map(o => o.id);
        const events = await this
              .where('id', 'in', eventsIds)
              .fetchAll({withRelated: ['user', 'user.role', 'trip', 'trip.name', 'start_location', 'end_location']});

        return events
            .map(event => event.toJSON())
            .map(fmt.event);

    },

    async getById(id) {
        console.log("GET EVENT BY ID", id);
        // const event =  await this.where({id}).fetch({withRelated: ['user', 'user.role', 'trip', 'trip.name']});
        const event =  await this.where({id}).fetch({withRelated: ['user', 'user.role', 'start_location', 'end_location']});

        if (event == null) {
            throw new errors.EVENT_NOT_FOUND();
            return false;
        }

        return fmt.event(event.toJSON());
    },
    async create(body) {
        console.log("CREATE EVENT", body)
        const realbody = _.pick(body, ['type', 'name', 'start_date', 'end_date', 'start_location_id', 'end_location_id', 'trip_id', 'user_id']);
        console.log("CREATE EVENT 2", realbody)
        const e = (await new this(realbody).save()).toJSON();
        console.log("CREATE EVENT 3")
        const event = await this.where({id: e.id}).fetch({withRelated: ['user', 'user.role', 'trip', 'start_location', 'end_location']});
        console.log("CREATE EVENT 4")
        console.log("EVENT : ", event.toJSON());
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
