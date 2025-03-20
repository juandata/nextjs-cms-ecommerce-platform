import refundModel from "~/models/refund";
import dbConnect from "~/utils/dbConnect";
import { getToken } from "next-auth/jwt";
import order from "~/models/order";
import user from "~/models/user";

export default async function apiHandler(req, res) {
  const { method } = req;
  const secret = process.env.AUTH_SECRET;
  const session = await getToken({ req, secret });
  if (!session)
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const data = req.body;
        data.userId = session.user.id;
        const createdRefund = await refundModel.create(data);
        const orderData = await order.findOne({ orderId: data.orderId });
        if (orderData) {
          const index = orderData.products.findIndex(
            (x) => x._id === data.product.id
          );
          if (index > -1) {
            orderData.products[index].refundRequest = true;
            orderData.markModified("products");
            await orderData.save();
          }
        }
        await user.updateOne(
          { _id: session.user.id },
          { $push: { refundRequest: createdRefund._id } }
        );
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(200).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
