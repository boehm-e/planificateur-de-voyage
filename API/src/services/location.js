import Bookshelf    from '../config/bookshelf';
import Location        from '../models/location';
import User         from '../models/user';
import fmt          from '../helpers/formatters';

const getAll = async () => await Location.getAll();

const create = async ({name, latitude, longitude}) => await Location.create({ name, latitude, longitude });

const getById = async (location_id) => await Location.getById(location_id);


export default {getById, create, getAll};
