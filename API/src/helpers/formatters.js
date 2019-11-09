const user = user => ({
    id: user.id,
    email: user.email,
    role: user.role.authority
});

const event = (event) => {
    return {
        id: event.id,
        type: event.type,
        name: event.name,
        end_date: event.end_date,
        start_date: event.start_date,
        start_location: location(event.start_location),
        end_location: location(event.end_location)
        // user: user(event.user),
    }
};

const group = group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    deleted: !!group.deleted,
    user: user(group.user),
    members: group.members.map(member => ({
        id: member.user.id,
        invitation_id: member.id,
        email: member.user.email,
        role: member.user.role.authority,
        accepted: member.accepted == null ? null : !!member.accepted
    }))
});

const trip = trip => ({
    id: trip.id,
    name: trip.name,
    start_date: trip.start_date,
    end_date: trip.end_date,
    image_preview: trip.image_preview,
    user: user(trip.user),
    events: trip.events.map(_event => event(_event))
});

const location = (location) =>  {
    console.log("LOCATION : ", location);
    if (!location) return null;
    return {
        id: location.id,
        name: trip.name,
        latitude: location.latitude,
        longitude: location.longitude
    }
}

export default {user, event, group, trip, location};
