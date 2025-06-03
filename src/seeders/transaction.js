// const { QueryTypes } = require("sequelize");

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface) {
//     const Transaction = await queryInterface.sequelize.query(
//       `SELECT * FROM Transaction`,
//       { type: QueryTypes.SELECT }
//     );

//     if (Transaction.length === 0) {
//       await queryInterface.bulkInsert("Transaction", [
//         {
//           id: 1,
//           orderId: 1,
//           paymentMethod: "online",
//           transationId: "TXN1001",
//           paymentId: "PAY1001",
//           status: "success",
//           createdAt: new Date(),
//           updatedAt: new Date()
//         },
//         {
//           id: 2,
//           orderId: 2,
//           paymentMethod: "offline",
//           transationId: "TXN1002",
//           paymentId: "PAY1002",
//           status: "fail",
//           createdAt: new Date(),
//           updatedAt: new Date()
//         },
//         {
//           id: 3,
//           orderId: 2,
//           paymentMethod: "offline",
//           transationId: "TXN1003",
//           paymentId: "PAY1003",
//           status: "inprogress",
//           createdAt: new Date(),
//           updatedAt: new Date()
//         },
//         {
//           id: 4,
//           orderId: 2,
//           paymentMethod: "online",
//           transationId: "TXN1004",
//           paymentId: "PAY1004",
//           status: "refundable",
//           createdAt: new Date(),
//           updatedAt: new Date()
//         }
//       ]);
//     }
//   },

//   async down(queryInterface) {
//     await queryInterface.bulkDelete("Transaction", null, {});
//   }
// };
const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const Transaction = await queryInterface.sequelize.query(
      `SELECT * FROM Transaction`,
      { type: QueryTypes.SELECT },
    );
    if (Transaction.length == 0) {
      await queryInterface.bulkInsert("Transaction", [
        {
          id: 1,
          orderId: 1,
          paymentMethod: "online",
          transationId: "TXN1001",
          paymentId: "PAY1001",
          status: "success",
          createdAt: new Date(),
          updatedAt: new Date()
        },

      ]);
    }
  },
};
