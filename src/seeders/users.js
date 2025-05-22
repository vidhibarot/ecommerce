const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const User = await queryInterface.sequelize.query(
            `SELECT * FROM User`,
            { type: QueryTypes.SELECT },
        );
        if (User.length == 0) {
            await queryInterface.bulkInsert("User", [
                {
                    name: "vidhi",
                    email: "vidhi123@gmail.com",
                    password: "$2b$10$d9c3tBFJKcX4k3kzWWF.K.pQekzG9St.mhwBEEQ5Vxfhy6U7Us6Cy", //vidhi@123
                    phoneno: "6756454534",
                    roleId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "nidhi",
                    email: "nidhi123@gmail.com",
                    password: "$2b$10$9yqNloHtiD.C70vwsPdHb.NptcHvjRA1HGkaJvPQ7/jh.Q5MnVQG", //nidhi@123	
                    phoneno: "7573991211",
                    roleId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "gopi",
                    email: "gopi123@gmail.com",
                    password: "$2b$10$qITh3lV6wrs8I72cSgsYEe0HwBTR0miOTkP3rM6kX1hq9ffhl4wtG", //gopi@123	
                    phoneno: "7074439520",
                    roleId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "prathama",
                    email: "prathama123@gmail.com",
                    password: "$2b$10$d9c3tBFJKcX4k3kzWWF.K.pQekzG9St.mhwBEEQ5Vxfhy6U7Us6Cy", //vidhi@123
                    phoneno: "9375582834",
                    roleId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Urmi",
                    email: "urmi123@gmail.com",
                    password: "$2b$10$d9c3tBFJKcX4k3kzWWF.K.pQekzG9St.mhwBEEQ5Vxfhy6U7Us6Cy", //vidhi@123
                    phoneno: "8401230724",
                    roleId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ]);
        }
    },
};
