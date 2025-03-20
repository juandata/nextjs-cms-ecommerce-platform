import { CardText, ChatLeftDots, StarHalf } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";
import classes from "~/components/Shop/Product/productDetails.module.css";
import { _simpleProductCart, _variableProductCart } from "~/lib/cartHandle";
import { postData, setSettingsData, stockInfo } from "~/lib/clientFunctions";
import productDetailsData from "~/lib/dataLoader/productDetails";
import { wrapper } from "~/redux/store";

const Error404 = dynamic(() => import("~/components/error/404"));
const Error500 = dynamic(() => import("~/components/error/500"));
const HeadData = dynamic(() => import("~/components/Head"));
const ImageLoader = dynamic(() => import("~/components/Image"));
const Question = dynamic(() => import("~/components/question"));
const Review = dynamic(() => import("~/components/Review"));
const Product = dynamic(() => import("~/components/Shop/Product/product"));
const InnerImageZoom = dynamic(() => import("react-inner-image-zoom"));
const Carousel = dynamic(() =>
  import("react-responsive-carousel").then((com) => com.Carousel)
);

function ProductDetailsPage({ data, error }) {
  const [selectedColor, setSelectedColor] = useState({
    name: null,
    value: null,
  });
  const [selectedAttribute, setSelectedAttribute] = useState({
    name: null,
    value: null,
    for: null,
  });
  const { session } = useSelector((state) => state.localSession);
  const [price, setPrice] = useState(0);
  const [tabId, setTabId] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const quantityAmount = useRef();
  const question = useRef();
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const router = useRouter();
  const relatedItem =
    data.related &&
    data.related.filter((obj) => {
      return obj._id !== data.product._id;
    });
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

  const checkVariantInfo = (color, attr) => {
    const colorName = color || selectedColor.name;
    const attrName = attr || selectedAttribute.name;
    return data.product.variants.find(
      (item) => item.color === colorName && item.attr === attrName
    );
  };

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

  const _showTab = (i) => {
    setTabId(i);
  };

  const refreshData = () => router.replace(router.asPath);

  async function postQuestion(e) {
    try {
      e.preventDefault();
      const _data = {
        pid: data.product._id,
        question: question.current.value.trim(),
      };
      const _r = await postData("/api/question", _data);
      _r.success
        ? (toast.success("Question Added Successfully"), refreshData())
        : toast.error("Something Went Wrong 500");
    } catch (err) {
      console.log(err);
      toast.error(`Something Went Wrong - ${err.message}`);
    }
  }

  useEffect(() => {
    if (data.product) {
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

  if (error) return <Error500 />;
  if (!data.product) return <Error404 />;

  return (
    <>
      <HeadData
        title={data.product.name}
        seo={data.product.seo}
        url={`product/${data.product.slug}`}
      />
      <div className="py-1">
        <div className="custom_container">
          <div className="mt-5 px-2 py-3">
            <div className={classes.container}>
              <div className="row m-0">
                <div className="col-lg-6 p-0">
                  <div className={classes.slider}>
                    <div className={classes.image_container_main}>
                      <Carousel
                        showArrows={false}
                        showThumbs={true}
                        showIndicators={false}
                        renderThumbs={thumbs}
                        preventMovementUntilSwipeScrollTolerance={true}
                        swipeScrollTolerance={50}
                        emulateTouch={true}
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
                                    data-selected={
                                      color.value === selectedColor.value
                                    }
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
                                  data-selected={
                                    attr.label === selectedAttribute.name
                                  }
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
                      <p className={classes.section_heading}>
                        {t("categories")}
                      </p>
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
                        <button
                          onClick={stepUpQty}
                          className={classes.plus}
                        ></button>
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
            <div className={classes.tab_button}>
              <button
                onClick={() => _showTab(1)}
                className={tabId === 1 ? classes.active : classes.not}
              >
                {t("description")}
              </button>
              <button
                onClick={() => _showTab(2)}
                className={tabId === 2 ? classes.active : classes.not}
              >
                {t("review")} ({data.product.review.length})
              </button>
              <button
                onClick={() => _showTab(3)}
                className={tabId === 3 ? classes.active : classes.not}
              >
                {t("questions")} ({data.product.question.length})
              </button>
            </div>
            <div className={classes.details_card}>
              {tabId === 1 && (
                <>
                  {data.product.description &&
                  data.product.description.length > 0 ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.product.description,
                      }}
                    />
                  ) : (
                    <EmptyContent
                      icon={<CardText width={40} height={40} />}
                      text="This product has no description"
                    />
                  )}
                </>
              )}
              {tabId === 2 && (
                <>
                  {data.product.review && data.product.review.length > 0 ? (
                    <Review review={data.product.review} />
                  ) : (
                    <EmptyContent
                      icon={<StarHalf width={40} height={40} />}
                      text="This product has no reviews yet"
                    />
                  )}
                </>
              )}
              {tabId === 3 && (
                <>
                  {session && (
                    <form
                      className="border border-2 rounded p-3 mb-3"
                      onSubmit={postQuestion}
                    >
                      <div className="mb-3">
                        <label className="form-label">Ask a question</label>
                        <textarea
                          className="form-control"
                          maxLength={300}
                          placeholder="Maximum 300 words"
                          ref={question}
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className={classes.c_btn}>
                        ASK QUESTION
                      </button>
                    </form>
                  )}
                  {data.product.question && data.product.question.length > 0 ? (
                    <Question
                      qtn={data.product.question}
                      user={session}
                      pid={data.product._id}
                      refresh={refreshData}
                    />
                  ) : (
                    <EmptyContent
                      icon={<ChatLeftDots width={40} height={40} />}
                      text="There are no questions asked yet. Please login or register to ask question"
                    />
                  )}
                </>
              )}
            </div>
            {relatedItem.length > 0 && (
              <div className={classes.related}>
                <p className={classes.related_header}>{t("Related Items")}</p>
                <ul className={classes.related_list}>
                  {relatedItem.map((product, index) => (
                    <Product key={index} product={product} hideLink border />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyContent({ icon, text }) {
  return (
    <div className={classes.empty_content}>
      <div className={classes.empty_icon}>{icon}</div>
      <div className={classes.empty_text}>{text}</div>
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, query }) => {
      if (res) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59"
        );
      }
      const _data = await productDetailsData(query.name);
      const data = JSON.parse(JSON.stringify(_data));
      if (data.success) {
        setSettingsData(store, data);
      }
      return {
        props: {
          data,
          error: !data.success,
        },
      };
    }
);

export default ProductDetailsPage;
