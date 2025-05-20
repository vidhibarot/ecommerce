const { QueryTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const Product = await queryInterface.sequelize.query(
            `SELECT * FROM Product`,
            { type: QueryTypes.SELECT },
        );
        if (Product.length == 0) {
            await queryInterface.bulkInsert("Product", [
                {
                    name: "Coir-decor",
                    description: "this is the samp[le products",
                    image: "123",
                    price: 123,
                    categoryId: '[2, 3]',
                    inStock: 0,
                    material: "solid",
                    weight: "30",
                    size: "45",
                    attributes: JSON.stringify({
                        title: "Elegant Wooden Chair",
                        description: "A beautifully crafted wooden chair perfect for modern interiors.",
                        image: "https://example.com/images/wooden-chair.jpg"
                    }),
                    features: '["Handmand","Eco-Friendly"]',
                    discount: "30",
                    careInstructions: JSON.stringify([
                        {
                            "title": "Regular Shaking",
                            "description": "Shake regularly to remove dirt and debris that accumulate on the surface."
                        },
                        {
                            "title": "Avoid Soaking",
                            "description": "Do not soak in water as prolonged exposure can reduce the material's durability."
                        }
                    ]),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Coir-decor",
                    description: "this is the samp[le products",
                    image: "123",
                    price: 123,
                    categoryId: '[2, 3]',
                    inStock: 0,
                    material: "solid",
                    weight: "30",
                    size: "45",
                    attributes: JSON.stringify({
                        title: "Elegant Wooden Chair",
                        description: "A beautifully crafted wooden chair perfect for modern interiors.",
                        image: "https://example.com/images/wooden-chair.jpg"
                    }),
                    features: '["Handmand","Eco-Friendly"]',
                    discount: "30",
                    careInstructions: JSON.stringify([
                        {
                            "title": "Regular Shaking",
                            "description": "Shake regularly to remove dirt and debris that accumulate on the surface."
                        },
                        {
                            "title": "Avoid Soaking",
                            "description": "Do not soak in water as prolonged exposure can reduce the material's durability."
                        }
                    ]),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Coir-decor",
                    description: "this is the samp[le products",
                    image: "123",
                    price: 123,
                    categoryId: '[2, 3]',
                    inStock: 0,
                    material: "solid",
                    weight: "30",
                    size: "45",
                    attributes: JSON.stringify({
                        title: "Elegant Wooden Chair",
                        description: "A beautifully crafted wooden chair perfect for modern interiors.",
                        image: "https://example.com/images/wooden-chair.jpg"
                    }),
                    features: '["Handmand","Eco-Friendly"]',
                    discount: "30",
                    careInstructions: JSON.stringify([
                        {
                            "title": "Regular Shaking",
                            "description": "Shake regularly to remove dirt and debris that accumulate on the surface."
                        },
                        {
                            "title": "Avoid Soaking",
                            "description": "Do not soak in water as prolonged exposure can reduce the material's durability."
                        }
                    ]),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Coir-decor",
                    description: "this is the samp[le products",
                    image: "123",
                    price: 123,
                    categoryId: '[2, 3]',
                    inStock: 0,
                    material: "solid",
                    weight: "30",
                    size: "45",
                    attributes: JSON.stringify({
                        title: "Elegant Wooden Chair",
                        description: "A beautifully crafted wooden chair perfect for modern interiors.",
                        image: "https://example.com/images/wooden-chair.jpg"
                    }),
                    features: '["Handmand","Eco-Friendly"]',
                    discount: "30",
                    careInstructions: JSON.stringify([
                        {
                            "title": "Regular Shaking",
                            "description": "Shake regularly to remove dirt and debris that accumulate on the surface."
                        },
                        {
                            "title": "Avoid Soaking",
                            "description": "Do not soak in water as prolonged exposure can reduce the material's durability."
                        }
                    ]),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Coir-decor",
                    description: "this is the samp[le products",
                    image: "123",
                    price: 123,
                    categoryId: '[2, 3]',
                    inStock: 0,
                    material: "solid",
                    weight: "30",
                    size: "45",
                    attributes: JSON.stringify({
                        title: "Elegant Wooden Chair",
                        description: "A beautifully crafted wooden chair perfect for modern interiors.",
                        image: "https://example.com/images/wooden-chair.jpg"
                    }),
                    features: '["Handmand","Eco-Friendly"]',
                    discount: "30",
                    careInstructions: JSON.stringify([
                        {
                            "title": "Regular Shaking",
                            "description": "Shake regularly to remove dirt and debris that accumulate on the surface."
                        },
                        {
                            "title": "Avoid Soaking",
                            "description": "Do not soak in water as prolonged exposure can reduce the material's durability."
                        }
                    ]),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]);
        }
    },
};
