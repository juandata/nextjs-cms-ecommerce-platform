import pageModel from "~/models/webpages";
import settingsModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";

export default async function pageData(type) {
  try {
    await dbConnect();
    const pageData = await pageModel.findOne({});
    const settings = await settingsModel.findOne({});
    let page = {};
    //Check Data Scope
    switch (type) {
      case "about":
        page = pageData.aboutPage;
        break;

      case "privacy":
        page = pageData.privacyPage;
        break;

      case "terms":
        page = pageData.termsPage;
        break;

      case "return":
        page = pageData.returnPolicyPage;
        break;

      case "faq":
        page = pageData.faqPage;
        break;
    }
    return {
      success: true,
      page,
      settings,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      page,
    };
  }
}
