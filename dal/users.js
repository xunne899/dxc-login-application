const { User,Role } = require('../models')


const getAllUsers = async () => {
    const users = await User.fetchAll().map((user) => {
        return [user.get('id'), user.get('user')];
    })
  
    return users
}
// const getAllRoles = async () => {
//     const roles = await Role.fetchAll().map((role) => {
//         return [role.get('id'), role.get('role')];
//     })
  
//     return roles
// }
const getUserById = async (userId) => {
    return await User.where({
        'id': parseInt(userId)
    }).fetch({
        require: true,
    });
}

module.exports = {
    getAllUsers,
    getUserById
}