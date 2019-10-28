import Bookshelf    from '../config/bookshelf';
import Event        from '../models/event';
import Group        from '../models/group';
import User         from '../models/user';
import EventAtendee from '../models/eventAtendee';
import fmt          from '../helpers/formatters';

const getAll = async () => await Event.getAll();

const create = async ({name, start, end, user_id}) => await Event.create({ name, start, end, user_id });

const getById = async (event_id) => await Event.getById(event_id);

const inviteUserById = async (event_id, user_id) => await EventAtendee.create({event_id, user_id});

const inviteUserByEmail = async (event_id, user_email) => {
    const user = await User.getByEmail(user_email);
    return await inviteUserById(event_id, user.id);
};

const respondToInvitation = async (id, accepted) => await new EventAtendee({id}).save({accepted}, {patch: true});

const cancel = async (id) => await new Event({id}).save({canceled: true}, {patch: true});

const buildCalendar = async (user_id, viewer_id) => {
    const rawResult = await Bookshelf.knex.raw(`
SELECT event.*, user_event_visibility.visible_to_user_id, user_event_visibility.visible_to_group_id
FROM event
LEFT JOIN event_atendees ON event_atendees.event_id = event.id
LEFT JOIN user_event_visibility ON user_event_visibility.event_id = event.id
WHERE event.canceled = 0
  AND (event.user_id = ? OR event_atendees.user_id = ?)
  AND (user_event_visibility.user_id = ? OR user_event_visibility.user_id IS NULL)
`, [user_id, user_id, user_id]);

    /*
     * on récupère tous les événements dont l'utilisateur fait parti et
     * on liste les personnes ou les groupes qui ont le droit de voir que
     * l'utilisateur participe à cet événement
     */

    const eventsVisibility = [];
    for (let event of rawResult[0]) { // can be done using reduce
        const event_id = event.id;
        let allowed_user = null;
        let allowed_group = null;

        if (event.visible_to_group_id) {
            allowed_group = event.visible_to_group_id;
        } else if (event.visible_to_user_id) {
            allowed_user = event.visible_to_user_id;
        }

        const index = eventsVisibility.findIndex(o => o.event_id == event_id);

        if (index < 0) {
            eventsVisibility.push({
                event_id,
                allowed_users: allowed_user ? [allowed_user] : [],
                allowed_groups: allowed_group ? [allowed_group] : []
            });
        } else {
            if (allowed_user) eventsVisibility[index].allowed_users.push(allowed_user);
            if (allowed_group) eventsVisibility[index].allowed_groups.push(allowed_group);
        }
    }

    const userEventsIds = eventsVisibility.map(o => o.event_id);
    let userEvents = await Event
          .where('id', 'in', userEventsIds)
        .fetchAll({withRelated: ['user', 'user.role', 'atendees', 'atendees.user', 'atendees.user.role']});

    userEvents = userEvents
        .map(event => event.toJSON())
        .map(fmt.event);

    /*
     * On filtre les événements auxquels l'utilisateur n'a pas confirmé
     * sa participation ou alors a refusé de participer
     */

    userEvents = userEvents
        .filter(event => event.user.id == user_id
                ? true
                : event.atendees.find(u => u.id == user_id).accepted == true);


    const viewer = await User.getById(viewer_id);
    const _viewerGroups = await Group.getByUser(viewer_id);
    const viewerGroups = _viewerGroups.filter(group => group.user.id == viewer_id
                                              ? true
                                              : group.members.find(u => u.id == viewer_id).accepted == true);
    const viewerGroupsIds = viewerGroups.map(group => group.id);

    const calendar = userEvents.filter(event => {
        const vr = eventsVisibility.find(visibility => visibility.event_id == event.id);
        /* We've found a visibility rule (set by the user)*/
        if (vr) {
            if (vr.allowed_users && vr.allowed_users.includes(viewer_id)) {
                /* viewer is allowed to see the event*/
                return true;
            } else if (vr.allowed_groups && vr.allowed_groups.some(gr_id => viewerGroupsIds.includes(gr_id))) {
                /* viewer is in a group that is allowed to see the event*/
                return true;
            }
        }

        /* viewer is invited to the event or the creator of the event */
        if (event.user.id == viewer_id || event.atendees.map(u => u.id).includes(viewer_id)) {
            return true;
        } else {
            return false;
        }

    });

    return calendar;
};

export default {getById, create, getAll, inviteUserById, inviteUserByEmail, respondToInvitation, cancel, buildCalendar};
