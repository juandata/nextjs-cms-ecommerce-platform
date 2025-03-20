import { connect, set } from "mongoose";
import order from "~/models/order";
import product from "~/models/product";
import user from "~/models/user";
import category from "~/models/category";
import colors from "~/models/colors";
import setting from "~/models/setting";
import attributes from "~/models/attributes";
import brand from "~/models/brand";
import newsletter from "~/models/newsletter";
import coupon from "~/models/coupon";
import notification from "~/models/notification";
import shippingCharge from "~/models/shippingCharge";
import webpages from "~/models/webpages";
import refundRequest from "~/models/refund";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB URI (MONGO_URI) environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    set("strictQuery", true);
    cached.promise = await connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
