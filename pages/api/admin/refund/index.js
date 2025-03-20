import s3DeleteFiles from "~/lib/s3Delete";
import sessionChecker from "~/lib/sessionPermission";
import refundModel from "~/models/refund";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "order")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const data = await refundModel
          .find({})
          .sort({ _id: -1 })
          .populate("userId", {
            name: 1,
            email: 1,
            phone: 1,
          })
          .populate("product.id", {
            image: 1,
          });
        res.status(200).json({ success: true, data });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const { id, status, note } = req.body;
        const refundData = await refundModel.findById(id);
        if (!refundData || refundData.status === "Approved") {
          throw new Error(`Illigal Request with id ${id}`);
        }
        refundData.status = status;
        refundData.note = note;
        await refundData.save();
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(200).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const data = await refundModel.findById(req.query.id);
        const icon = [{ Key: data.image[0]?.name }];
        await s3DeleteFiles(icon);
        await data.deleteOne();
        res.status(200).json({ success: true });
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
