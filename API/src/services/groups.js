import Group        from '../models/group';
import User         from '../models/user';
import GroupMember  from '../models/groupMember';

const getAll = async () => await Group.getAll();

const create = async ({name, description, user_id}) => await Group.create({ name, description, user_id });

const getById = async (group_id) => await Group.getById(group_id);

const inviteUserById = async (group_id, user_id) => await GroupMember.create({group_id, user_id});

const inviteUserByEmail = async (group_id, user_email) => {
    const user = await User.getByEmail(user_email);
    return await inviteUserById(group_id, user.id);
};

const respondToInvitation = async (id, accepted) => await new GroupMember({id}).save({accepted}, {patch: true});

const deleteGroup = async (id) => await new Group({id}).save({deleted: true}, {patch: true});

export default {getById, create, getAll, inviteUserById, inviteUserByEmail, respondToInvitation, deleteGroup};
