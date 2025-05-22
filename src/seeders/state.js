const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const State = await queryInterface.sequelize.query(
            `SELECT * FROM State`,
            { type: QueryTypes.SELECT },
        );
        if (State.length == 0) {
            await queryInterface.bulkInsert("State", [
                { 
                    name:"Home",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    name:"Garden",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    name:"Decor",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    name:"Kitchen",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                               { 
                    name:"Fitness",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },

            ]);
        }
    },
};
