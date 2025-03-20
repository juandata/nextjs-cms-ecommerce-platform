import sessionChecker from "~/lib/sessionPermission";
import ProductModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";
import { convertToSlug } from "~/middleware/functions";
import customIdNew from "custom-id-new";
import { Types } from "mongoose";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "product")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const product = await ProductModel.find({}).sort("-date").exec();
        res.status(200).json({ success: true, product });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const originalDocument = await ProductModel.findById(req.body.id);
        if (!originalDocument) {
          throw new Error("Original document not found.");
        }
        const clonedDocument = new ProductModel(originalDocument.toObject());
        clonedDocument._id = new Types.ObjectId();
        clonedDocument.name = `Clone ${clonedDocument.name}`;
        clonedDocument.slug = convertToSlug(
          `${clonedDocument.name} clone`,
          true
        );
        clonedDocument.date = Date.now();
        clonedDocument.productId =
          "P" + customIdNew({ randomLength: 4, upperCase: true });
        await clonedDocument.save();

        res
          .status(200)
          .json({ success: true, message: "Product Successfully Cloned" });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
