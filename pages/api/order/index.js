import sessionChecker from "~/lib/sessionPermission";
import orderModel from "../../../models/order";
import dbConnect from "../../../utils/dbConnect";

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
        const { pageNumber = 1, pageSize = 10, queryText } = req.query;
        let order = [];
        let total = 0;
        if (queryText && queryText.length > 0) {
          // Use a regular expression to perform a case-insensitive search
          const regex = new RegExp(queryText, "i");
          order = await orderModel.find({ orderId: regex });
          total = order.length;
        } else {
          total = await orderModel.countDocuments();
          const skip = (pageNumber - 1) * pageSize;
          order = await orderModel
            .find()
            .sort({ orderDate: -1 })
            .skip(skip)
            .limit(Number(pageSize));
        }
        res.status(200).json({ success: true, order, total });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const id = req.query.id;
        await orderModel.findByIdAndDelete(id);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
