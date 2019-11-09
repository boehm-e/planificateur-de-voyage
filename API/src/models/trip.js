import _            from 'lodash';
import User         from './user';
import Bookshelf    from '../config/bookshelf';
import errors       from '../helpers/errors';
import fmt          from '../helpers/formatters';

var Trip = Bookshelf.Model.extend({
    tableName: 'trip',
    idAttribute: 'id',
    hidden: [],

    user() {
        return this.belongsTo('User', 'user_id');
    },

    events() {
        return this.hasMany('Event');
    },

    async update(body) {
        const realbody = _.pick(body, ['name', 'description', 'start_date', 'end_date', 'image_preview']);
        this.set(realbody);
        return await (await this.save()).fetch({withRelated: ['user', 'user.role']});
    },

    async delete() {
        return await this.destroy();
    }
}, {
    async getAll() {
        console.log("GETALL TRIPS");
        const tripList = await this.query({}).fetchAll({withRelated: ['user', 'user.role', 'events', 'events.start_location', 'events.end_location']});

        return tripList
        .map(trip => trip.toJSON())
        .map(fmt.trip);
    },

    async getByUser(user_id) { // there must be a cleaner way to do that

        const rawResult = await Bookshelf.knex.raw(
            `SELECT trip.id FROM trip WHERE trip.user_id = ?`,
            [user_id]
        );
        const tripsIds = rawResult[0].map(o => o.id);
        const trips = await this
        .where('id', 'in', tripsIds)
        .fetchAll({withRelated: ['user', 'user.role', 'events', 'events.start_location', 'events.end_location']});
        console.log("TRIPS : ", trips.toJSON()[0]);
        return trips
        .map(trip => trip.toJSON())
        .map(fmt.trip);

    },

    async getById(id) {
        const trip =  await this.where({id}).fetch({withRelated: ['user', 'user.role', 'events', 'events.start_location', 'events.end_location']});
        if (trip == null) {
            throw new errors.TRIP_NOT_FOUND();
            return false;
        }

        return fmt.trip(trip.toJSON());
    },

    async create(body) {
        const realbody = _.pick(body, ['name', 'description', 'start_date', 'end_date', 'image_preview', 'user_id']);
        const e = (await new this(realbody).save()).toJSON();
        const trip = await this.where({id: e.id}).fetch({withRelated: ['user', 'user.role', 'events', 'events.start_location', 'events.end_location']});

        return fmt.trip(trip.toJSON());
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

module.exports = Bookshelf.model('Trip', Trip);
