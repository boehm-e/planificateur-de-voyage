import _            from 'lodash';
import User         from './user';
import Bookshelf    from '../config/bookshelf';
import errors       from '../helpers/errors';
import fmt          from '../helpers/formatters';

var Location = Bookshelf.Model.extend({
    tableName: 'location',
    idAttribute: 'id',
    hidden: [],

    async update(body) {
        const realbody = _.pick(body, ['name', 'latitude', 'longitude']);
        this.set(realbody);
        return await (await this.save()).fetch();
    },

    async delete() {
        return await this.destroy();
    }
}, {
    async getAll() {
        const locationList = await this.query({}).fetchAll();

        return locationList
            .map(location => location.toJSON())
            .map(fmt.location);
    },

    async getById(id) {
        const location =  await this.where({id}).fetch();

        if (location == null) {
            throw new errors.EVENT_NOT_FOUND();
            return false;
        }

        return fmt.location(location.toJSON());
    },
    async create(body) {
        console.log("CREATE LOCATION", body);
        const realbody = _.pick(body, ['name', 'latitude', 'longitude']);
        const e = (await new this(realbody).save()).toJSON();
        console.log("CREATE LOCATION 2");
        const location = await this.where({id: e.id}).fetch();
        console.log("CREATE LOCATION 3", location);

        return fmt.location(location.toJSON());
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

module.exports = Bookshelf.model('Location', Location);
