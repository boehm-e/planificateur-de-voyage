import errorEx from 'error-ex';

const errors = {
    EMAIL_PASSWORD_REQUIRED: `At least one of the following fields is missing : ['email', 'password']`,
    WRONG_PASSWORD_OR_EMAIL: `Wrong email / password combination !`,
    INVALID_PASSWORD: `Invalid password !`,
    GROUP_NOT_FOUND: 'Group not found !',
    USER_NOT_FOUND: 'User not found !',
    EVENT_NOT_FOUND: 'Event not found !',
    TRIP_NOT_FOUND: 'Trip not found !',
    ROLE_NOT_FOUND: 'Role not found !'
};

const errorsFn = Object.entries(errors).reduce((acc, [k, v]) => ({
    ...acc,
    [k]: errorEx(k, {'': {message: _ => v}})
}), {});

export default errorsFn;
