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
                    id: 1,
                    name: "Maharashtra",
                    countryId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    name: "California",
                    countryId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 3,
                    name: "Ontario",
                    countryId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 4,
                    name: "New South Wales",
                    countryId: 4,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 5,
                    name: "Bavaria",
                    countryId: 5,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 6,
                    name: "Île-de-France",
                    countryId: 6,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 7,
                    name: "São Paulo",
                    countryId: 7,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 8,
                    name: "Tokyo",
                    countryId: 8,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 9,
                    name: "Gauteng",
                    countryId: 9,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 10,
                    name: "England",
                    countryId: 10,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

            ]);
        }
    },
};
