const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const Order = await queryInterface.sequelize.query(
            `SELECT * FROM Orders`,
            { type: QueryTypes.SELECT },
        );
        if (Order.length == 0) {
            await queryInterface.bulkInsert("Orders", [
                {
                    id: 1,
                    userId: 1,
                    productId: 2,
                    customerName: "John Doe",
                    email: "john@example.com",
                    phoneno: "1234567890",
                    address: JSON.stringify({
                        type: "home",
                        address: "addreslines",
                        country: "123 Main St",
                        city: "New York",
                        state: "Xyz",
                        zipcode: "10001"
                    }),
                    quantity: 2,
                    price: 500,
                    deliveryCharges: 50,
                    totalAmount: 1000,
                    status: "Inprogress",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    userId: 2,
                    productId: 3,
                    customerName: "John Doe",
                    email: "john@example.com",
                    phoneno: "1234567890",
                    address: JSON.stringify({
                        type: "home",
                        address: "addreslines",
                        country: "123 Main St",
                        city: "New York",
                        state: "Xyz",
                        zipcode: "10001"
                    }),
                    quantity: 2,
                    price: 500,
                    deliveryCharges: 50,
                    totalAmount: 1000,
                    status: "Inprogress",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }


            ]);
        }
    },
};
