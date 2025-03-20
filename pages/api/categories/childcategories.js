import sessionChecker from "~/lib/sessionPermission";
import { convertToSlug } from "../../../middleware/functions";
import categoryModel from "../../../models/category";
import dbConnect from "../../../utils/dbConnect";
import { parseForm } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "category")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const data = await categoryModel.find({});
        res.status(200).json({ success: true, category: data });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const data = await parseForm(req);
        const objectData = {
          name: data.field.name.trim(),
          slug: convertToSlug(data.field.name, false),
        };
        const r = await categoryModel.updateOne(
          {
            _id: data.field.category,
            "subCategories._id": data.field.subcategory,
          },
          {
            $push: { "subCategories.$.child": objectData },
          }
        );
        res.status(200).json({ success: r.modifiedCount > 0 });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const categoryId = req.query.categoryId;
        const subcategoryId = req.query.subcategoryId;
        const slug = req.query.slug;
        const r = await categoryModel.updateOne(
          {
            _id: categoryId,
            "subCategories._id": subcategoryId,
          },
          {
            $pull: { "subCategories.$.child": { slug: slug } },
          }
        );
        res.status(200).json({ success: r.modifiedCount > 0 });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const data = await parseForm(req);
        const body = JSON.parse(data.field.data);
        const categoryId = body.categoryId;
        const subcategoryId = body.subcategoryId;
        const slug = body.slug;
        const name = body.update;
        const r = await categoryModel.updateOne(
          {
            _id: categoryId,
          },
          {
            $set: { "subCategories.$[a].child.$[i].name": name },
          },
          {
            arrayFilters: [
              {
                "a._id": subcategoryId,
              },
              {
                "i.slug": slug,
              },
            ],
          }
        );
        res.status(200).json({ success: r.modifiedCount > 0 });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
