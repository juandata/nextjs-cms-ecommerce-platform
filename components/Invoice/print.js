import React from "react";
import { useSelector } from "react-redux";
import {
  checkPercentage,
  dateFormat,
  decimalBalance,
} from "~/lib/clientFunctions";
import ImageLoader from "../Image";

const InvoicePrint = ({ data }) => {
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  return (
    <div className="confirmation" id="su-inv">
      <div className="confirmation_heading">
        {settings.settingsData.logo[0] && (
          <ImageLoader
            src={settings.settingsData.logo[0]?.url}
            width={166}
            height={60}
            alt={settings.settingsData.name}
            quality={100}
          />
        )}
        <br />
      </div>
      <div className="confirmation_body">
        <div className="row mb-3">
          <div className="col-6">
            <h6>Invoice #{data.orderId}</h6>
          </div>
          <div className="col-6">
            <h6>Date : {dateFormat(data.orderDate)}</h6>
          </div>
        </div>
        <h5>Delivery details</h5>
        <div className="row">
          <div className="col-6">
            <h6>Delivery for</h6>
            <p>Name : {data?.shippingInfo?.fullName || ""}</p>
            <p>Email : {data?.shippingInfo?.email || ""}</p>
            <p>Phone no : {data?.shippingInfo?.phone || ""}</p>
            <p>
              Address :
              {` ${data?.shippingInfo?.house || ""}, ${
                data?.shippingInfo?.city || ""
              }, ${data?.shippingInfo?.state || ""}, ${
                data?.shippingInfo?.zipCode || ""
              } ${data?.shippingInfo?.country || ""}`}
            </p>
          </div>
          <div className="col-6">
            <h6>Delivery method</h6>
            <p>{data.deliveryInfo?.description}</p>
            <br />
            <h6>Payment details</h6>
            <p>Payment method : {data.paymentMethod}</p>
            <p>Payment status : {data.paymentStatus}</p>
          </div>
        </div>
        <h5>Order summary</h5>
        <div className="cart_item_list">
          <table className="table">
            <thead className="cart_item_header">
              <tr>
                <th>Product</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.products?.map((item, index) => (
                <tr className="cart_item" key={index}>
                  <td>
                    <div className="cart_container">
                      <span className="cart_image">
                        <ImageLoader
                          src={item.image[0]?.url}
                          height={50}
                          width={50}
                          alt={item.name}
                        />
                      </span>
                      <span className="cart_disc">
                        <b>{item.name}</b>
                        {item.color.name && (
                          <span>Color: {item.color.name}</span>
                        )}
                        {item.attribute.name && (
                          <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                        )}
                        <span>Qty: {item.qty}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    {currencySymbol}
                    {decimalBalance(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="confirmation_pay">
          <div>
            <span>Sub Total</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.totalPrice)}
            </span>
          </div>
          <div>
            <span>Discount</span>
            <span>
              {currencySymbol}
              {decimalBalance(
                checkPercentage(data.totalPrice, data.coupon?.discount || 0)
              )}
            </span>
          </div>
          <div>
            <span>Delivery Charge</span>
            <span>
              {currencySymbol}
              {data.deliveryInfo.cost}
            </span>
          </div>
          <div>
            <span>Vat</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.vat)}
            </span>
          </div>
          <div>
            <span>Tax</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.tax)}
            </span>
          </div>
          <div>
            <span>Total</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.payAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
