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
          discountPrice, // ✅ added here
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
    console.log("bodyyyyy", body);
    console.log("files,,mmm", files);
    if (body?.careInstruction) {
      console.log("f...........................", files);
    }

    if (files?.image) {
      imageUrl = createLiveImageURL(files?.image, "single");
    }
    console.log("imageurllll", imageUrl);
    const data: any = {
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
    console.log("adproductdattatata...", addProductData, data?.story);

    if (files?.productImages && Array.isArray(files.productImages)) {
      for (const img of files.productImages) {
        const imgUrl = createLiveImageURL(img, "multiple");
        await ProductImage.create({
          productId: addProductData?.id,
          image: imgUrl,
        });
      }
    }

    if (body?.story) {
      const data = JSON.parse(body?.story);
      console.log("data?.storyyy", data);
      await ProductStory.create({
        title: data.title,
        description: data.description,
        productId: addProductData?.id,
        image: data.image,
      });
    }

    if (body?.benefits) {
      console.log("data?.benefits", typeof body?.benefits);
      const data = JSON.parse(body?.benefits);
      console.log("data?.storyyy", data);
      await ProductBenefit.create({
        title: data.title,
        description: data.description,
        productId: addProductData?.id,
      });
    }
    if (body?.use) {
      console.log("data?.data?.use", typeof body?.use);
      const data = JSON.parse(body?.benefits);
      console.log("data?.storyyy", data);
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
};
