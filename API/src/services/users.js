import Bookshelf    from '../config/bookshelf';
import EventAtendee from '../models/eventAtendee';
import GroupMember  from '../models/groupMember';

const getNotifications = async (user_id) => {
    // could be done in parallell
    const pendingGroupInvitations = await GroupMember.getPendingByUser(user_id);
    const pendingEventInvitations = await EventAtendee.getPendingByUser(user_id);

    const groupNotifications = pendingGroupInvitations.map(gInvit => ({
        user_id,
        nature: 'groups',
        name: gInvit.group.name,
        object_id: gInvit.group.id
    }));

    const eventNotifications = pendingEventInvitations.map(eInvit => ({
        user_id,
        nature: 'events',
        name: eInvit.event.name,
        object_id: eInvit.event.id
    }));

    const notifications = [
        ...groupNotifications,
        ...eventNotifications
    ];

    return notifications;
};

export default {getNotifications};
