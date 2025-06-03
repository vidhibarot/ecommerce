const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const DeliveryCharges = await queryInterface.sequelize.query(
      `SELECT * FROM DeliveryCharges`,
      { type: QueryTypes.SELECT },
    );
    if (DeliveryCharges.length == 0) {
      await queryInterface.bulkInsert("DeliveryCharges", [
        {
          id: 1,
          city: "Bangalore",
          zipcode: "560001",
          minOrder: "300",
          charge: "50",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          city: "Delhi",
          zipcode: "110001",
          minOrder: "500",
          charge: "30",
          status: "Inactive",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          city: "Mumbai",
          zipcode: "400001",
          minOrder: "200",
          charge: "40",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }
  },
};
