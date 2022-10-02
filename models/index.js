const bookshelf = require("../bookshelf")

const User = bookshelf.model("User",{
    tableName:"users",
    role: function(){
        return this.belongsTo('Role')
    },
})

const Role = bookshelf.model('Role' , {
    tableName: 'roles',
    accounts: function(){
        return this.hasMany('User')
    }
})

module.exports = {
    User
};