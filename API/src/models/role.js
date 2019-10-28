import _         from 'lodash';
import User      from './user';
import Bookshelf from '../config/bookshelf';
import errors    from '../helpers/errors';

var Role = Bookshelf.Model.extend({
    tableName: 'role',
    hidden: [],

    async update(body) {
        const realbody = _.pick(body, ['authority']);

        this.set(realbody);
        return await (await this.save()).fetch();
    },
    async delete() {
        return await this.destroy();
    }
}, {
    async getAll() {
        return await this.query({}).fetchAll();
    },
    async getById(id) {
        const role =  await this.query({where: {id}}).fetch();

        if (role == null) {
            throw new errors.ROLE_NOT_FOUND();
            return false;
        }

        return role.toJSON();
    },
    async create(body) {
        const realbody = _.pick(body, ['authority']);
        const role = await (await new this(realbody).save()).fetch();

        return role.toJSON();
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

module.exports = Bookshelf.model('Role', Role);
