import Bookshelf    from '../config/bookshelf';
import Event        from '../models/event';
import User         from '../models/user';
import fmt          from '../helpers/formatters';

const getAll = async () => await Event.getAll();

const create = async ({type, name, start_date, end_date, start_location_id, end_location_id, trip_id, user_id}) => await Event.create({ type, name, start_date, end_date, start_location_id, end_location_id, trip_id, user_id });

const getById = async (event_id) => await Event.getById(event_id);


export default {getById, create, getAll};
