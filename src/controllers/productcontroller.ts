import { Context } from "koa";
import { Op } from "sequelize";
import { Product } from "../models/product";
import { Category } from "../models/category";
import createLiveImageURL from "../middleware/helper";
import { ProductBenefit } from "../models/productBenefits";
import { ProductUse } from "../models/productUse";
import { ProductStory } from "../models/productStory";
import { ProductImage } from "../models/productimages";
import SubCategory from "../models/subCategory";

interface FilterField {
  id?: string;
  value: string | number;
}

//Get All Products Data
const getAllProduct = async (ctx: Context) => {
  try {
    let { page, limit, price, searchvalue } = ctx.params;

    console.log("pagegggg",page,limit,price,searchvalue)

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    // Calculate offset
    const offset = (currentPage - 1) * itemsPerPage;

    const filterQuery: any = {};

    const parsedPrice = Number(price);
    if (price && !isNaN(parsedPrice)) {
      filterQuery.price = { [Op.lte]: parsedPrice };
    }
    const rawSearchValue = searchvalue?.trim?.() || "";

    const invalidSearchValues = ["", "undefined", "null", "{searchvalue}"];

    if (!invalidSearchValues.includes(rawSearchValue)) {
      filterQuery[Op.or] = [
        { name: { [Op.like]: `%${rawSearchValue}%` } },
        { description: { [Op.like]: `%${rawSearchValue}%` } },
      ];
    }

    const products = await Product.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "image",
        "inStock",
        "price",
        "categoryId",
        "discount",
      ],
      where: Object.keys(filterQuery).length > 0 ? filterQuery : undefined,

      offset: offset,
      limit: itemsPerPage,
      order: [["id", "asc"]], // Optional: Add sorting
    });

    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        let categoryIds: number[] = [];

        try {
          categoryIds = Array.isArray(product.categoryId)
            ? product.categoryId
            : JSON.parse(product.categoryId || "[]");
        } catch (e) {
          categoryIds = [];
        }

        const categories = await Category.findAll({
          where: {
            id: {
              [Op.in]: categoryIds,
            },
          },
          include: [
            {
              model: SubCategory,
              attributes: ["id", "name", "categoryId"],
            },
          ],

          attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        const originalPrice = product.price;
        const discountPercentage: any = product.discount || 0;
        const discountPrice =
          originalPrice - (originalPrice * discountPercentage) / 100;
        return {
          ...product.toJSON(),
          categories,
          discountPrice, 
        };
      })
    );

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Filtered products fetched",
      data: enrichedProducts,
    };
  } catch (error) {
    console.error("getAllProduct error -> ", error);
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
};

//Add Products Data
const addProductData = async (ctx: Context) => {
  try {
    const { body, files } = ctx.req as any;
    let imageUrl;

    if (files?.image) {
      imageUrl = createLiveImageURL(files?.image, "single");
    }
    const data: any = {
      userId:ctx?.state?.user?.id,
      name: body?.name,
      description: body?.description,
      price: body?.price,
      image: imageUrl,
      inStock: body?.inStock,
      attributes: body?.attributes,
      categoryId: body?.categoryId,
      material: body?.material,
      weight: body?.weight,
      size: body?.size,
      features: body.features,
      discount: body?.discount,
      careInstructions: body?.careInstruction,
    };
    const addProductData: any = await Product.create(data);

    if (files?.productImages && Array.isArray(files.productImages)) {
      for (const img of files.productImages) {
        const imgUrl = createLiveImageURL(img, "multiple");
        await ProductImage.create({
          productId: addProductData?.id,
          image: imgUrl,
        });
      }
    }
console.log("bodyyyy..",body?.story,body?.benefits,body?.use)

    if (body?.story) {
      const data = JSON.parse(body?.story);
      await ProductStory.create({
        title: data.title,
        description: data.description,
        productId: addProductData?.id,
        image: data.image,
      });
    }

    if (body?.benefits) {
      const data = JSON.parse(body?.benefits);
      await ProductBenefit.create({
        title: data.title,
        description: data.description,
        productId: addProductData?.id,
      });
    }
    if (body?.use) {
      const data = JSON.parse(body?.benefits);
      await ProductUse.create({
        title: data.title,
        description: data.description,
        productId: addProductData?.id,
      });
    }

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "All Users Fetched",
      data: addProductData,
    };
  } catch (error) {
    console.error("err -> ", error);
    ctx.status = 400;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
};

// Update Product by ID
const updateProduct = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const { body, files } = ctx.req as any;

    const product = await Product.findByPk(id);
    if (!product) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Product not found",
      };
      return;
    }

    let imageUrl = product.image;
    if (files?.image) {
      imageUrl = createLiveImageURL(files.image, "single");
    }

    const updateData: any = {
      userId:ctx?.state?.user?.id,
      name: body?.name,
      description: body?.description,
      price: body?.price,
      image: imageUrl,
      inStock: body?.inStock,
      attributes: body?.attributes,
      categoryId: body?.categoryId,
      material: body?.material,
      weight: body?.weight,
      size: body?.size,
      features: body?.features,
      discount: body?.discount,
      careInstructions: body?.careInstruction,
    };

    await Product.update(updateData, { where: { id } });
    if (body?.story) {
      const data = JSON.parse(body?.story);
      await ProductStory.destroy({ where: { productId: id } });

      await ProductStory.create({
        title: data.title,
        description: data.description,
        productId: id,
        image: data.image,
      });
    }

    if (body?.benefits) {
      const data = JSON.parse(body?.benefits);
      await ProductBenefit.destroy({ where: { productId: id } });

      await ProductBenefit.create({
        title: data.title,
        description: data.description,
        productId: id,
      });
    }
    if (body?.use) {
      const data = JSON.parse(body?.benefits);
      await ProductUse.destroy({ where: { productId: id } });

      await ProductUse.create({
        title: data.title,
        description: data.description,
        productId: id,
      });
    }
    if (files?.productImages && Array.isArray(files.productImages)) {
      await ProductImage.destroy({ where: { productId: id } });
      for (const img of files.productImages) {
        const imgUrl = createLiveImageURL(img, "multiple");
        await ProductImage.create({ productId: id, image: imgUrl });
      }
    }

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    console.error("updateProduct error ->", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Delete Product by ID
const deleteProduct = async (ctx: Context) => {
  try {
    const id = ctx.params.id;

    const product = await Product.findByPk(id);
    if (!product) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Product not found",
      };
      return;
    }

    await ProductImage.destroy({ where: { productId: id } });
    await ProductBenefit.destroy({ where: { productId: id } });
    await ProductUse.destroy({ where: { productId: id } });
    await ProductStory.destroy({ where: { productId: id } });
      await Product.destroy({ where: { id } });


    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("deleteProduct error ->", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

//Get Product Data By Id
const getProductById = async (ctx: Context) => {
  try {
    const productId = ctx.params.id;

    const product = await Product.findOne({
      where: { id: productId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: ProductStory,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductBenefit,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductUse,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductImage,
          attributes: ["image"],
        },
      ],
    });

    if (!product) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        message: "Product not found",
      };
      return;
    }

    // Parse categoryIds
    const categoryIds = Array.isArray(product.categoryId)
      ? product.categoryId
      : JSON.parse(product.categoryId || "[]");

    const categories = await Category.findAll({
      where: {
        id: {
          [Op.in]: categoryIds,
        },
      },
      include: [
        {
          model: SubCategory,
          attributes: ["id", "name", "categoryId"],
        },
      ],

      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    // Discount price calculation
    const discountPercentage: any = product?.discount || 0;
    const originalPrice = product.price;
    const discountPrice =
      originalPrice - (originalPrice * discountPercentage) / 100;

    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Product fetched successfully",
      data: {
        product,
        // images: product.ProductImages,
        categories,
        discountPrice,
        // story: product.ProductStories,
        // benefits: product.ProductBenefits,
        // uses: product.ProductUses,
      },
    };
  } catch (error) {
    console.error("getProductById error -> ", error);
    ctx.status = 500;
    ctx.body = {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export = {
  getAllProduct,
  addProductData,
  getProductById,
  updateProduct,
  deleteProduct,
};
