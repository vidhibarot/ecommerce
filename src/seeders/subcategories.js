const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const SubCategories = await queryInterface.sequelize.query(
            `SELECT * FROM SubCategory`,
            { type: QueryTypes.SELECT },
        );
        if (SubCategories.length == 0) {
            await queryInterface.bulkInsert("SubCategory", [
                {
                    name: "Tradition",
                    categoryId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Modern",
                    categoryId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Hanging Basket",
                    categoryId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "planters",
                    categoryId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Wall Hangins",
                    categoryId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Table Decors",
                    categoryId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },

            ]);
        }
    },
};
