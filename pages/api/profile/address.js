import { getToken } from "next-auth/jwt";
import AddressModel from "~/models/address";
import UserModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";

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
    case "GET":
      try {
        const user = await UserModel.findById(session.user.id)
          .populate(
            "address",
            {
              __v: 0,
              user: 0,
              orders: 0,
            },
            null,
            { sort: { _id: -1 } }
          )
          .select({ address: 1 });
        res.status(200).json({ success: true, user });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "POST":
      try {
        const data = req.body;
        data.user = session.user.id;
        if (data.addressType === "main address") {
          await AddressModel.updateMany(
            { user: session.user.id },
            { $set: { addressType: "address" } }
          );
        }
        const newAddress = await AddressModel.create(data);
        await UserModel.updateOne(
          { _id: session.user.id },
          { $push: { address: newAddress._id } }
        );
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const data = req.body;
        if (data.addressType === "main address") {
          await AddressModel.updateMany(
            { user: session.user.id },
            { $set: { addressType: "address" } }
          );
        }
        const r = await AddressModel.updateOne({ _id: data._id }, data);
        res.status(200).json({ success: r.modifiedCount > 0 });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        await AddressModel.findByIdAndDelete(req.body.id);
        await UserModel.updateOne(
          { _id: session.user.id },
          { $pull: { address: req.body.id } }
        );
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
