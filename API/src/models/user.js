import _            from 'lodash';
import bcrypt       from 'bcrypt';
import Role         from './role';
import Bookshelf    from '../config/bookshelf';
import errors       from '../helpers/errors';
import fmt          from '../helpers/formatters';

const SALT_ROUNDS = 10;

var User = Bookshelf.Model.extend({
    tableName: 'user',
    idAttribute: 'id',
    hidden: ['password'],

    role() {
        return this.belongsTo('Role', 'role_id');
    },

    async update(body) {
        const realbody = _.pick(body, ['email', 'password']);

        if (realbody.password) {
            realbody.password = await bcrypt.hash(realbody.password, SALT_ROUNDS);
        }

        if (body.role) {
            realbody.role_id = body.role;
        }

        const _user = await this.save(realbody, {patch: true});
        const updatedUser = await _user.fetch({withRelated: ['role']});

        return fmt.user(updatedUser.toJSON());
    },
    async delete() {
        return await this.destroy();
    }
}, {
    async getAll() {
        const usersList = await this.query({}).fetchAll({withRelated: ['role']});

        return usersList
              .map(user => user.toJSON())
              .map(fmt.user);
    },
    async getById(id) {
        const user =  await this.where({id}).fetch({withRelated: ['role']});

        if (user == null) {
            throw new errors.USER_NOT_FOUND();
            return false;
        }

        return fmt.user(user.toJSON());
    },
    async getByEmail(email) {
        const user =  await this.where({email}).fetch({withRelated: ['role']});

        if (user == null) {
            throw new errors.USER_NOT_FOUND();
            return false;
        }

        return fmt.user(user.toJSON());
    },
    async getRefById(id) {
        const user =  await this.where({id}).fetch();

        if (user == null || Object.keys(user.toJSON()).length == 0) {
            throw new errors.USER_NOT_FOUND();
            return false;
        }

        return user;
    },
    async find(email, password) {
        if (!email || !password) {
            throw new errors.EMAIL_PASSWORD_REQUIRED();
            return false;
        }

        const user = await new this({ email }).fetch({withRelated: ['role']});

	      if (user == null) {
	          throw new errors.WRONG_PASSWORD_OR_EMAIL();
	      }

        const passwordMatch = await bcrypt.compare(password, user.get('password'));

        if (!passwordMatch) {
            throw new errors.INVALID_PASSWORD();
        } else {
            return fmt.user(user.toJSON());
        }
    },
    async create(body) {
        const realbody = _.pick(body, ['email', 'password']);

        realbody.password = await bcrypt.hash(realbody.password, SALT_ROUNDS);

        const user = await (await new this(realbody).save()).fetch({withRelated: ['role']});

        return fmt.user(user.toJSON());
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

module.exports = Bookshelf.model('User', User);
