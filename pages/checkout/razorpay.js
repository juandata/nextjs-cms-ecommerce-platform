import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "~/components/Ui/Spinner";
import { postData } from "~/lib/clientFunctions";
import { resetCart } from "~/redux/cart.slice";
import classes from "~/styles/payment.module.css";

export default function RazorPay() {
  const [loading, setLoading] = useState(false);
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const exchangeRate = Number(settings.settingsData.currency.exchangeRate);
  const dispatch = useDispatch();
  const router = useRouter();
  const processOrder = async (id) => {
    try {
      const { coupon, items, billingInfo, shippingInfo, deliveryInfo } =
        cartData;
      const data = {
        coupon,
        products: items,
        billingInfo,
        shippingInfo,
        deliveryInfo,
        paymentData: {
          method: "Razorpay",
          id,
        },
      };
      const url = `/api/order/new`;
      const formData = new FormData();
      formData.append("checkoutData", JSON.stringify(data));
      const responseData = await postData(url, formData);
      if (responseData && responseData.success) {
        dispatch(resetCart());
        toast.success("Order successfully placed");
        setTimeout(() => {
          router.push(`/checkout/success/${responseData.createdOrder._id}`);
        }, 2000);
      } else {
        toast.error("Something Went Wrong (500)");
      }
    } catch (err) {
      toast.error(`Something Went Wrong ${err.message}`);
      console.log(err);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createPayment = async () => {
    if (cartData.items.length === 0) {
      toast.error(
        "Illegal request, please add items to the card then make the payment"
      );
      return;
    }
    setLoading(true);
    const res = await loadRazorpay();
    setLoading(false);
    if (!res) {
      toast.error("Razorpay SDK Failed to load");
      return;
    }

    const data = await postData(`/api/checkout/razorpay`, {
      cartData,
      exchangeRate,
    });

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      name: settings.settingsData.name,
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: `${settings.settingsData.name} Transaction`,
      image: settings.settingsData.logo[0].url,
      handler: async function (response) {
        toast.success("Payment succeeded!");
        await processOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: cartData.billingInfo.fullName,
        email: cartData.billingInfo.email,
        contact: cartData.billingInfo.phone,
      },
      theme: {
        color: settings.settingsData.color.primary,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      console.log(response);
      toast.error(
        `Your payment was not successful, please try again. - ${response.error.reason}`
      );
    });
  };

  return (
    <>
      <div className="layout_top">
        <div className="App text-center">
          {loading && (
            <div style={{ height: "70vh" }}>
              <Spinner />
            </div>
          )}
          {!loading && (
            <div className={classes.container}>
              <h2 className={classes.h2}>Pay Now</h2>
              <button
                className="btn btn-primary fw-bold"
                onClick={createPayment}
              >
                Pay with Razorpay
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

RazorPay.footer = false;
