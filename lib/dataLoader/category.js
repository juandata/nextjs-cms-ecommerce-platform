import categoryModel from "~/models/category";
import settingsModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";

export default async function categoryPageData() {
  try {
    await dbConnect();
    const category = await categoryModel.find({}).select({
      _id: 0,
      categoryId: 1,
      name: 1,
      slug: 1,
      icon: 1,
      subCategories: 1,
      img: 1,
    });
    const settings = await settingsModel.findOne({});
    return {
      success: true,
      category,
      settings,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      category: [],
      settings: {},
    };
  }
}
