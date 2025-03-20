import customId from "custom-id-new";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";
import useSWR from "swr";
import ImageLoader from "~/components/Image";
import { fetchData, stockInfo } from "~/lib/clientFunctions";
import { addToCart, addVariableProductToCart } from "~/redux/cart.slice";
import Spinner from "../../Ui/Spinner";
import classes from "./productDetails.module.css";
import { useTranslation } from "react-i18next";
import { _simpleProductCart, _variableProductCart } from "~/lib/cartHandle";

const Carousel = dynamic(() =>
  import("react-responsive-carousel").then((com) => com.Carousel)
);

const ProductDetails = (props) => {
  const url = `/api/product/${props.productSlug}`;
  const { data, error } = useSWR(url, fetchData);
  const [selectedColor, setSelectedColor] = useState({
    name: null,
    value: null,
  });
  const [selectedAttribute, setSelectedAttribute] = useState({
    name: null,
    value: null,
    for: null,
  });
  const [price, setPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const quantityAmount = useRef();
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.product) {
      setPrice(data.product.discount);
      if (data.product.type !== "variable") {
        return;
      }
      if (data.product.colors && data.product.colors.length > 0) {
        setSelectedColor({
          name: data.product.colors[0]?.label,
          value: data.product.colors[0]?.value,
        });
      }
      if (data.product.attributes && data.product.attributes.length > 0) {
        setSelectedAttribute({
          name: data.product.attributes[0]?.label,
          value: data.product.attributes[0]?.value,
          for: data.product.attributes[0]?.for,
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && data.product) {
      const cl = data.product.colors?.length || 0;
      const al = data.product.attributes?.length || 0;
      if (cl > 0 && al > 0) {
        updatePrice(selectedColor.name, selectedAttribute.name);
      }
      if (cl > 0 && al === 0) {
        updatePrice(selectedColor.name, null);
      }
      if (cl === 0 && al > 0) {
        updatePrice(null, selectedAttribute.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, selectedAttribute]);

  if (error) return <div className="text-danger">failed to load</div>;
  if (!data) return <Spinner />;
  if (!data.product) return <div>Something Went Wrong...</div>;

  const stepUpQty = () => {
    quantityAmount.current.stepUp();
  };

  const stepDownQty = () => {
    quantityAmount.current.stepDown();
  };

  const selectPreviewImage = (vd) => {
    if (vd.imageIndex && vd.imageIndex > 0) {
      setSelectedImage(vd.imageIndex - 1);
    }
  };

  const checkVariantInfo = (color_name, attr_name) => {
    const colorName = color_name || selectedColor.name;
    const attrName = attr_name || selectedAttribute.name;
    return data.product.variants.find(
      (item) => item.color === colorName && item.attr === attrName
    );
  };

  const updatePrice = (color, attr) => {
    const variantData = checkVariantInfo(color, attr);
    if (variantData && variantData.price) {
      const itemPrice = data.product.discount + Number(variantData.price);
      setPrice(itemPrice);
      selectPreviewImage(variantData);
    }
  };

  const changeColor = (e) => {
    try {
      const value = {
        name: e.label,
        value: e.value,
      };
      setSelectedColor(value);
      updatePrice(value.name, null);
    } catch (err) {
      console.log(err);
    }
  };

  const changeVariant = (e) => {
    try {
      const value = {
        name: e.label,
        value: e.value,
        for: e.for,
      };
      setSelectedAttribute(value);
      updatePrice(null, value.name);
    } catch (err) {
      console.log(err);
    }
  };

  const simpleProductCart = _simpleProductCart(data, cartData, price, dispatch);

  const checkQty = (prevQty, currentQty, availableQty) => {
    const avQty = Number(availableQty);
    if (avQty === -1) {
      return true;
    } else {
      return prevQty + currentQty <= avQty;
    }
  };

  const variableProductCart = _variableProductCart(
    data,
    selectedColor,
    selectedAttribute,
    cartData,
    checkVariantInfo,
    checkQty,
    price,
    dispatch
  );

  const addItemToCart = () => {
    const qty = Number(quantityAmount.current.value);
    if (data.product.type === "simple") {
      simpleProductCart(qty);
    } else {
      variableProductCart(qty);
    }
  };

  const thumbs = () => {
    const thumbList = data.product.gallery.map((item, index) => (
      <ImageLoader
        key={item.name + index}
        src={item.url}
        alt={data.product.name}
        width={67}
        height={67}
        style={{ width: "100%", height: "auto" }}
      />
    ));
    return thumbList;
  };

  return (
    <div className={classes.container}>
      <div className="row">
        <div className="col-lg-6 p-0">
          <div className={classes.slider}>
            <div className={classes.image_container_main}>
              <Carousel
                showArrows={false}
                showThumbs={true}
                showIndicators={false}
                renderThumbs={thumbs}
                showStatus={false}
                emulateTouch={true}
                preventMovementUntilSwipeScrollTolerance={true}
                swipeScrollTolerance={50}
                selectedItem={selectedImage}
              >
                {data.product.gallery.map((item, index) => (
                  <InnerImageZoom
                    key={item.name + index}
                    src={item.url}
                    className={classes.magnifier_container}
                    fullscreenOnMobile={true}
                  />
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <div className="col-lg-6 p-0">
          <div className={classes.details}>
            <p className={classes.unit}>
              {data.product.unitValue} {data.product.unit}
            </p>
            <h1 className={classes.heading}>{data.product.name}</h1>
            <hr />
            <div>
              {data.product.discount < data.product.price && (
                <p className={classes.price_ori}>
                  {settings.settingsData.currency.symbol}
                  {data.product.price}
                </p>
              )}
              <p className={classes.price}>
                {settings.settingsData.currency.symbol}
                {price}
              </p>
            </div>
            <p className={classes.description}>
              {data.product.shortDescription}
            </p>
            {data.product.type === "variable" && (
              <div>
                {data.product.colors.length > 0 && (
                  <div className={classes.color_selector}>
                    <p
                      className={classes.section_heading}
                      style={{ marginBottom: "11px" }}
                    >
                      {t("color")}
                    </p>
                    <div className={classes.color_selector_container}>
                      {data.product.colors.map((color, i) => (
                        <div
                          className={classes.circle_outer}
                          key={i}
                          onClick={() => changeColor(color)}
                          title={color.name}
                        >
                          <label
                            data-selected={color.value === selectedColor.value}
                            style={{ backgroundColor: color.value }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.product.attributes.length > 0 && (
                  <div>
                    <p className={classes.section_heading}>
                      {data.product.attributes[0]?.for}
                    </p>
                    <div className={classes.select}>
                      {data.product.attributes.map((attr, i) => (
                        <span
                          key={i}
                          className={classes.attr}
                          onClick={() => changeVariant(attr)}
                          data-selected={attr.label === selectedAttribute.name}
                        >
                          {attr.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className={classes.category}>
              <p className={classes.section_heading}>{t("categories")}</p>
              {data.product.categories.map((category, index) => (
                <span key={index} className={classes.category_list}>
                  {category}
                </span>
              ))}
            </div>
            <div className={classes.cart_section}>
              <p className={classes.section_heading}>QTY</p>
              <div className={classes.number_input}>
                <button
                  onClick={stepDownQty}
                  className={classes.minus}
                ></button>
                <input
                  className={classes.quantity}
                  ref={quantityAmount}
                  min="1"
                  max={
                    data.product.quantity === -1
                      ? 100000
                      : data.product.quantity
                  }
                  defaultValue="1"
                  type="number"
                  disabled
                />
                <button onClick={stepUpQty} className={classes.plus}></button>
              </div>
              <div className={classes.button_container}>
                {stockInfo(data.product) ? (
                  <button
                    className={classes.cart_button}
                    onClick={() => addItemToCart()}
                  >
                    {t("add_to_cart")}
                  </button>
                ) : (
                  <button className={classes.cart_button} disabled>
                    {t("out_of_stock")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
