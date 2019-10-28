const user = user => ({
    id: user.id,
    email: user.email,
    role: user.role.authority
});

const event = event => ({
    id: event.id,
    name: event.name,
    start: event.start,
    end: event.end,
    canceled: !!event.canceled,
    user: user(event.user),
    atendees: event.atendees.map(atendee => ({
        id: atendee.user.id,
        invitation_id: atendee.id,
        email: atendee.user.email,
        role: atendee.user.role.authority,
        accepted: atendee.accepted == null ? null : !!atendee.accepted
    }))
});

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

export default {user, event, group};
