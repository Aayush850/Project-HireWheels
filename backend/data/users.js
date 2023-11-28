const bcrypt = require("bcryptjs");

const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456",10),
        isAdmin: true
    },
    {
        name: "User 1",
        email: "userone@example.com",
        password: bcrypt.hashSync("123456",10),
        isAdmin: false
    },
    {
        name: "User 2",
        email: "usertwo@example.com",
        password: bcrypt.hashSync("123456",10),
        isAdmin: false
    },
]

module.exports = users;