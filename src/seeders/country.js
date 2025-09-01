const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const Country = await queryInterface.sequelize.query(
            `SELECT * FROM Country`,
            { type: QueryTypes.SELECT },
        );
        if (Country.length == 0) {
            await queryInterface.bulkInsert("Country", [
                {
                    name: "India",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "United States",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Canada",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Australia",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Germany",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "France",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Brazil",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "Japan",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "South Africa",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "United Kingdom",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
        }
    },
};
