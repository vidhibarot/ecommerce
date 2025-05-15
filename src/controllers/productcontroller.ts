import { Context } from "koa";
import { Op } from "sequelize";
import { Product } from "../models/product";
import { Category } from "../models/category";
import createLiveImageURL from "../middleware/helper";
import { ProductBenefit } from "../models/productBenefits";
import { ProductUse } from "../models/productUse";
import { ProductStory } from "../models/productStory";
import { ProductImage } from "../models/productimages";
interface ProductFilterRequest {
  filters?: FilterField[];
}

interface FilterField {
  id: string;
  value: string | number;
}

//Gell All Products Data
// const getAllProduct = async (ctx: Context) => {
//   try {
//     const bodyData = ctx?.request?.body as ProductFilterRequest;

//     const productWhere: any = {};
//     const categoryWhere: any = {};

//     if ((bodyData.filters ?? []).length > 0) {
//       for (const filter of bodyData.filters!) {
//         if (filter.id && filter.value !== "") {
//           if (filter.id === "price") {
//             productWhere["price"] = { [Op.lt]: filter.value };
//           } else if (
//             filter.id === "category.name" &&
//             typeof filter.value === "string"
//           ) {
//             categoryWhere["name"] = { [Op.like]: `%${filter.value.trim()}%` };
//           } else {
//             productWhere[filter.id] = {
//               [Op.like]: `%${String(filter.value).trim()}%`,
//             };
//           }
//         }
//       }
//     }
//     const findProducts = await Product.findAll({
//       where: productWhere,
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },

//       include: [
//         {
//           model: Category,
//           where:
//             Object.keys(categoryWhere).length > 0 ? categoryWhere : undefined,
//           attributes: {
//             exclude: ["createdAt", "updatedAt"],
//           },
//         },
//       ],
//     });

//     ctx.status = 200;
//     ctx.body = {
//       status: true,
//       message: "Filtered products fetched",
//       data: findProducts,
//       count: findProducts.length,
//     };
//   } catch (error) {
//     console.error("err -> ", error);
//     ctx.status = 400;
//     ctx.body = {
//       status: false,
//       message: error instanceof Error ? error.message : "Unknown Error",
//     };
//   }
// };
const getAllProduct = async (ctx: Context) => {
  try {
    const bodyData = ctx?.request?.body as ProductFilterRequest;

    const productWhere: any = {};
    let filterCategoryIds: number[] = [];
    let allMatchingCategories: Category[] = [];

    // Step 1: Handle filters
    if ((bodyData.filters ?? []).length > 0) {
      for (const filter of bodyData.filters!) {
        if (filter.id && filter.value !== "") {
          if (filter.id === "price") {
            productWhere["price"] = { [Op.lt]: filter.value };
          } else if (
            filter.id === "category.name" &&
            typeof filter.value === "string"
          ) {
            // Fetch matching categories by name
            allMatchingCategories = await Category.findAll({
              where: {
                name: { [Op.like]: `%${filter.value.trim()}%` },
              },
              attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            filterCategoryIds = allMatchingCategories.map((cat) => cat.id);
          } else {
            productWhere[filter.id] = {
              [Op.like]: `%${String(filter.value).trim()}%`,
            };
          }
        }
      }
    }

    // Step 2: Fetch products matching filters (except category filtering for now)
    let products = await Product.findAll({
      where: productWhere,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
            include: [
              {
                model: ProductImage,
              },
            ],
      
    });

    // Step 3: Manually filter products by categoryId if filter applied
    // if (filterCategoryIds.length > 0) {
    //   products = products.filter((product: any) => {
    //     // Parse string to array safely
    //     let categoryIdsArray: number[] = [];
    //     try {
    //       categoryIdsArray = JSON.parse(product.categoryId);
    //     } catch {
    //       categoryIdsArray = [];
    //     }

    //     return categoryIdsArray.some((id) => filterCategoryIds.includes(id));
    //   });
    // }

    // // Step 4: Get all category IDs used by products
    // const allCategoryIdsInProducts = new Set<number>();
    // for (const product of products) {
    //   try {
    //     const catIds: number[] = JSON.parse(product.categoryId);
    //     catIds.forEach((id) => allCategoryIdsInProducts.add(id));
    //   } catch {
    //     // ignore parse errors
    //   }
    // }

    // // Step 5: Fetch category details for all these IDs
    // const categoryList = await Category.findAll({
    //   where: { id: Array.from(allCategoryIdsInProducts) },
    //   attributes: { exclude: ["createdAt", "updatedAt"] },
    // });

    // // Step 6: Create map for quick lookup
    // const categoryMap = new Map<number, any>();
    // for (const cat of categoryList) {
    //   categoryMap.set(cat.id, cat);
    // }

    // Step 7: Attach category data to each product
    // const enrichedProducts = products.map((product: any) => {
    //   let categoryIdsArray: number[] = [];
    //   try {
    //     categoryIdsArray = JSON.parse(product.categoryId);
    //   } catch {
    //     categoryIdsArray = [];
    //   }

    //   return {
    //     ...product.toJSON(),
    //     categories: categoryIdsArray
    //       .map((id) => categoryMap.get(id))
    //       .filter(Boolean),
    //   };
    // });

    // Step 8: Send response
    ctx.status = 200;
    ctx.body = {
      status: true,
      message: "Filtered products fetched",
      data: products,
      // count: enrichedProducts.length,
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

//const Add Products Data
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
      attributes:body?.attributes
    };
    const addProductData: any = await Product.create(data);
    console.log("adproductdattatata...", addProductData, data?.story);
    if (files?.productImages) {
      const productImageUrls = files?.productImages.map((img: any) =>
        createLiveImageURL(img, "multiple")
      );
      console.log("prpduct.....", productImageUrls);
    }

    if (body?.story) {
      console.log("data?.storyyy", typeof body?.story);
    }

    if (body?.benefits) {
      console.log("data?.benefits", typeof body?.benefits);
    }
    if (body?.use) {
      console.log("data?.data?.use", typeof body?.use);
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

// const getProductById = async (ctx: Context) => {
//   try {
//     const productId = ctx.params.id;

//     // Fetch product
//     const product = await Product.findOne({
//       where: { id: productId },
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//     });

//     if (!product) {
//       ctx.status = 404;
//       ctx.body = {
//         status: false,
//         message: "Product not found",
//       };
//       return;
//     }
//     const categoryIds = Array.isArray(product.categoryId)
//       ? product.categoryId
//       : JSON.parse(product.categoryId || "[]");
//     console.log("categoryidvvvv", typeof categoryIds);
//     const [story, benefits, uses, images, categories] = await Promise.all([
//       ProductStory.findAll({
//         where: { productId },
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//       }),
//       ProductBenefit.findAll({
//         where: { productId },
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//       }),
//       ProductUse.findAll({
//         where: { productId },
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//       }),
//       ProductImage.findAll({
//         where: { productId },
//         attributes: ["image"],
//       }),
//       Category.findAll({
//         where: {
//           id: {
//             [Op.in]: categoryIds,
//           },
//         },
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//       }),
//     ]);

//     // Calculate discount price
//     const discountPercentage: any = product?.discount || 0;
//     const originalPrice = product.price;
//     const discountPrice =
//       originalPrice - (originalPrice * discountPercentage) / 100;

//     // // Fetch categories
//     // const categoryIds = product.categoryId || [];
//     // const categories = await Category.findAll({
//     //   where: {
//     //     id: {
//     //       [Op.in]: categoryIds,
//     //     },
//     //   },
//     //   attributes: {
//     //     exclude: ["createdAt", "updatedAt"],
//     //   },
//     // });

//     // // Fetch product images
//     // const images = await ProductImage.findAll({
//     //   where: {
//     //     productId: product.id,
//     //   },
//     //   attributes: ["image"],
//     // });

//     // const productImages = images.map((img) => img.image);

//     // Return the full response

//     ctx.status = 200;
//     ctx.body = {
//       status: true,
//       message: "Product fetched successfully",
//       data: {
//         product,
//         images,
//         categories,
//         discountPrice,
//         story,
//         benefits,
//         uses,
//         // id: product.id,
//         // name: product.name,
//         // description: product.description,
//         // originalPrice,
//         // discount: discountPercentage,
//         // discountPrice,
//         // inStock: product.inStock,
//         // story: product.story,
//         // benefits: product.benefits,
//         // use: product.use,
//         // categories,
//         // productImages,
//         // descriptionArray
//       },
//     };
//   } catch (error) {
//     console.error("getProductById error -> ", error);
//     ctx.status = 500;
//     ctx.body = {
//       status: false,
//       message: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// };
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
