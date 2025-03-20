import brandModel from "~/models/brand";
import categoryModel from "~/models/category";
import ProductModel from "~/models/product";
import settingsModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";

export default async function galleryPageData(type, query) {
  try {
    await dbConnect();
    const category = await categoryModel.find({});
    const brand = await brandModel.find({});
    const settings = await settingsModel.findOne({});
    const product_length = await ProductModel.estimatedDocumentCount();
    const priceItem = await ProductModel.find({})
      .sort({ discount: -1 })
      .select("discount")
      .exec();
    const maxPrice = priceItem[0]?.discount || 1;
    const minPrice =
      priceItem.length > 0 ? priceItem[priceItem.length - 1].discount : 0;
    const priceRange = { min: minPrice, max: maxPrice };
    const productItemField = {
      name: 1,
      slug: 1,
      image: 1,
      unit: 1,
      unitValue: 1,
      price: 1,
      discount: 1,
      type: 1,
      variants: 1,
      quantity: 1,
      date: 1,
      review: 1,
    };
    if (type && query) {
      return {
        success: true,
        product: [],
        product_length: 0,
        category,
        settings,
        brand,
        priceRange,
      };
    } else {
      const product = await ProductModel.find({})
        .sort("-date")
        .limit(8)
        .select(productItemField)
        .exec();
      return {
        success: true,
        product: product,
        product_length: product_length,
        category,
        settings,
        brand,
        priceRange,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      product: [],
      product_length: 0,
      category: [],
      settings: {},
      brand: [],
    };
  }
}
