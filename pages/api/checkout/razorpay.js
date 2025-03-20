import customId from "custom-id-new";
import settingModel from "~/models/setting";
import { currencyConvert } from "~/lib/clientFunctions";
import axios from "axios";

const discountPrice = (discount, total) => (discount / 100) * total;
function checkPercentage(number, percentage) {
  return (number * percentage) / 100;
}

const generateBasicAuthHeader = (keyId, keySecret) => {
  // Combine keyId and keySecret with a colon
  const credentials = `${keyId}:${keySecret}`;

  // Base64 encode the combined string
  const base64Credentials = Buffer.from(credentials, "utf-8").toString(
    "base64"
  );

  // Create the Basic Auth header value
  const authHeaderValue = `Basic ${base64Credentials}`;

  return authHeaderValue;
};

export default async function apiHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const settingData = await settingModel.findOne({});
        const _currency = settingData.currency.name;
        const exchangeRate = settingData.currency.exchangeRate;
        const { cartData } = req.body;
        const delivery_charge = +cartData.deliveryInfo?.cost;
        const price = cartData.items.reduce(
          (accumulator, item) => accumulator + item.qty * item.price,
          0
        );
        const vat = cartData.items.reduce((accumulator, item) => {
          const totalPrice = item.qty * item.price;
          return accumulator + checkPercentage(totalPrice, item.vat);
        }, 0);

        const tax = cartData.items.reduce((accumulator, item) => {
          const totalPrice = item.qty * item.price;
          return accumulator + checkPercentage(totalPrice, item.tax);
        }, 0);
        const discount = discountPrice(cartData.coupon.discount, +price);
        const payAmount = price + vat + tax + delivery_charge - discount;
        const payAmountUsd = currencyConvert(payAmount, exchangeRate);
        const authHeader = generateBasicAuthHeader(
          process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          process.env.NEXT_PUBLIC_RAZORPAY_SECRET
        );

        const currency = _currency === "INR" ? "INR" : "USD";
        const paymentAmountFinal =
          _currency === "INR" ? payAmount : payAmountUsd;
        const tid = "T" + customId({ randomLength: 4, upperCase: true });
        const options = {
          amount: (paymentAmountFinal * 100).toString(),
          currency,
          receipt: tid,
        };
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api.razorpay.com/v1/orders",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          data: JSON.stringify(options),
        };
        const response = await axios
          .request(config)
          .then((response) => response.data);

        res.status(200).json({
          id: response.id,
          currency: response.currency,
          amount: response.amount,
        });
      } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
