const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const City = await queryInterface.sequelize.query(
            `SELECT * FROM City`,
            { type: QueryTypes.SELECT },
        );
        if (City.length == 0) {
            await queryInterface.bulkInsert("City", [
                // StateId: 1 - Maharashtra (India)
                { id: 1, name: "Mumbai", stateId: 1, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, name: "Pune", stateId: 1, createdAt: new Date(), updatedAt: new Date() },

                // StateId: 2 - California (USA)
                { id: 3, name: "Los Angeles", stateId: 2, createdAt: new Date(), updatedAt: new Date() },
                { id: 4, name: "San Francisco", stateId: 2, createdAt: new Date(), updatedAt: new Date() },

                // StateId: 3 - Ontario (Canada)
                { id: 5, name: "Toronto", stateId: 3, createdAt: new Date(), updatedAt: new Date() },
                { id: 6, name: "Ottawa", stateId: 3, createdAt: new Date(), updatedAt: new Date() },

                // StateId: 4 - New South Wales (Australia)
                { id: 7, name: "Sydney", stateId: 4, createdAt: new Date(), updatedAt: new Date() },
                { id: 8, name: "Newcastle", stateId: 4, createdAt: new Date(), updatedAt: new Date() },

                // StateId: 5 - Bavaria (Germany)
                { id: 9, name: "Munich", stateId: 5, createdAt: new Date(), updatedAt: new Date() },
                { id: 10, name: "Nuremberg", stateId: 5, createdAt: new Date(), updatedAt: new Date() },

                // StateId: 6 - Île-de-France (France)
                { id: 11, name: "Paris", stateId: 6, createdAt: new Date(), updatedAt: new Date() },
                { id: 12, name: "Versailles", stateId: 6, createdAt: new Date(), updatedAt: new Date() },

                // StateId: 7 - São Paulo (Brazil)
                { id: 13, name: "São Paulo", stateId: 7, createdAt: new Date(), updatedAt: new Date() },
                { id: 14, name: "Campinas", stateId: 7, createdAt: new Date(), updatedAt: new Date() },

                // StateId: 8 - Tokyo (Japan)
                { id: 15, name: "Tokyo", stateId: 8, createdAt: new Date(), updatedAt: new Date() },
                { id: 16, name: "Hachioji", stateId: 8, createdAt: new Date(), updatedAt: new Date() },

                // StateId: 9 - Gauteng (South Africa)
                { id: 17, name: "Johannesburg", stateId: 9, createdAt: new Date(), updatedAt: new Date() },
                { id: 18, name: "Pretoria", stateId: 9, createdAt: new Date(), updatedAt: new Date() },

                // StateId: 10 - England (UK)
                { id: 19, name: "London", stateId: 10, createdAt: new Date(), updatedAt: new Date() },
                { id: 20, name: "Manchester", stateId: 10, createdAt: new Date(), updatedAt: new Date() },

            ]);
        }
    },
};
