const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const ProductImages = await queryInterface.sequelize.query(
            `SELECT * FROM ProductImages`,
            { type: QueryTypes.SELECT },
        );
        if (ProductImages.length == 0) {
            await queryInterface.bulkInsert("ProductImages", [
                { 
                    productId:1,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    productId:1,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    productId:2,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    productId:2,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    productId:3,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    productId:3,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    productId:4,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    productId:4,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    productId:5,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                { 
                    productId:5,
                    image:"https://tse4.mm.bing.net/th?id=OIP.UCp3YdnupLNBBXClsC9e-wHaEK&pid=Api&P=0&h=180",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },

            ]);
        }
    },
};
