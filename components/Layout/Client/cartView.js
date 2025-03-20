import { Basket3, Cart, Trash } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OutsideClickHandler from "~/components/ClickOutside";
import { removeFromCart } from "~/redux/cart.slice";
import c from "./cartView.module.css";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { checkPercentage } from "~/lib/clientFunctions";

const ImageLoader = dynamic(() => import("~/components/Image"));

export default function CartView() {
  const [showCart, setShowCart] = useState(false);
  const cart = useSelector((state) => state.cart);
  const [cartData, setCartData] = useState(cart);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    setCartData(cart);
  }, [cart]);

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  // Getting the count of items
  const getItemsCount = () => {
    const p = cartData.items.reduce(
      (accumulator, item) => accumulator + item.qty,
      0
    );
    return decimalBalance(p);
  };
  // Getting the total price with vat and tax of all items
  const getTotalPrice = () => {
    const p = cartData.items.reduce((accumulator, item) => {
      const totalPrice = item.qty * item.price;
      return (
        accumulator +
        totalPrice +
        checkPercentage(totalPrice, item.tax) +
        checkPercentage(totalPrice, item.vat)
      );
    }, 0);
    return decimalBalance(p);
  };

  function gotoCheckout() {
    router.push("/checkout");
  }

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setShowCart(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div onClick={() => setShowCart(true)}>
      <Cart width={24} height={24} />
      <span>{getItemsCount()}</span>
      <p>{t("cart")}</p>
      <OutsideClickHandler
        show={showCart}
        onClickOutside={() => setShowCart(!showCart)}
      >
        <div className={c.card}>
          {cartData.items && cartData.items.length === 0 ? (
            <div className={c.empty}>
              <Basket3 width={30} height={30} />
              <span>Your Cart is empty</span>
            </div>
          ) : (
            <>
              <ul>
                {cartData.items.map((item, index) => (
                  <li key={index} className={c.item}>
                    <div className={c.image}>
                      <ImageLoader
                        src={item.image[0]?.url}
                        height={90}
                        width={90}
                        alt={item.name}
                      />
                    </div>
                    <div className={c.content}>
                      <p>{item.name} </p>
                      <b>
                        {`${
                          settings.settingsData.currency.symbol + item.price
                        } (X${item.qty})`}
                      </b>
                      {item.color.name && <span>Color: {item.color.name}</span>}
                      {item.attribute.name && (
                        <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                      )}
                    </div>
                    <button onClick={() => dispatch(removeFromCart(item.uid))}>
                      <Trash width={20} height={20} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className={c.total}>
                <span>{t("total_incl_vat_tax")}</span>
                <span>
                  {settings.settingsData.currency.symbol}
                  {getTotalPrice()}
                </span>
              </div>
              <div className={c.btn_container}>
                <Link href="/cart">{t("view_cart")}</Link>
                <button onClick={gotoCheckout}>{t("checkout")}</button>
              </div>
            </>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
}
