import Bookshelf    from '../config/bookshelf';
import Trip        from '../models/trip';
import User         from '../models/user';
import fmt          from '../helpers/formatters';

const getAll = async () => await Trip.getAll();

const create = async ({name, description, start_date, end_date, user_id}) => await Trip.create({ name, description, start_date, end_date, user_id });

const getById = async (event_id) => await Trip.getById(event_id);


export default {getById, create, getAll};
