import DefaultErrorPage from "next/error";
import { useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData, postData } from "~/lib/clientFunctions";
import FileUpload from "../FileUpload/fileUpload";
import TextEditor from "../TextEditor";
import LoadingButton from "../Ui/Button";
import Spinner from "../Ui/Spinner";
import classes from "./productForm.module.css";
import CustomSelect from "../CustomSelect";
import { useTranslation } from "react-i18next";

const ProductEditForm = (props) => {
  const url = `/api/product/edit?slug=${props.slug}`;
  const { data, error } = useSWR(url, fetchData);

  const product_type = useRef();
  const seo_title = useRef("");
  const seo_desc = useRef("");
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedAttr, setSelectedAttr] = useState([]);
  const [attrItemList, setAttrItemList] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubcategory] = useState("");
  const [selectedChildcategory, setSelectedChildcategory] = useState("");
  const [subcategoryOption, setSubcategoryOption] = useState([]);
  const [childCategoryOption, setChildcategoryOption] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [variantInputList, setVariantInputList] = useState([]);
  const [displayImage, setDisplayImage] = useState([]);
  const [galleryImage, setGalleryImage] = useState([]);
  const [seoImage, setSeoImage] = useState([]);
  const [editorState, setEditorState] = useState("");
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.product) {
      const preSelectedColor = [];
      data.product.colors.forEach((color) =>
        preSelectedColor.push({ label: color.label, value: color.value })
      );

      const preSelectedAttribute = [];
      data.product.attributes.forEach((attr) =>
        preSelectedAttribute.push({
          label: attr.label,
          value: attr.value,
          for: attr.for,
        })
      );
      setSelectedColor(preSelectedColor);
      setSelectedAttr(
        data.product.attributeIndex ? data.product.attributeIndex : ""
      );
      setAttrItemList(preSelectedAttribute);
      setSelectedType(data.product.type);
      setVariantInputList(data.product.variants);
      setDisplayImage(data.product.image);
      setGalleryImage(data.product.gallery);
      setSeoImage(data.product.seo.image);
      setEditorState(data.product.description);
      if (data.product.categories[0]) {
        setSelectedCategory(data.product.categories[0]);
        setSelectedSubcategory(data.product.subcategories[0]);
        setSelectedChildcategory(data.product.childCategories[0]);
        const category = data.category.find(
          (x) => x.slug === data.product.categories[0]
        );
        const subcategory = [];
        const childCategory = [];
        category.subCategories.forEach((sub) => {
          subcategory.push({ name: sub.name, slug: sub.slug });
          sub.child?.forEach((child) => {
            childCategory.push({ name: child.name, slug: child.slug });
          });
        });
        setSubcategoryOption(subcategory);
        setChildcategoryOption(childCategory);
      }
    }
  }, [data]);

  useEffect(() => {
    const itemList = (selectedColor.length || 1) * (attrItemList.length || 1);
    if (variantInputList.length !== itemList) {
      const arrList = [];
      if (selectedColor.length && attrItemList.length) {
        selectedColor.map((color) => {
          attrItemList.map((attr) => {
            const combination = {
              color: color.label,
              attr: attr.label,
              price: "",
              sku: "",
              qty: "",
              imageIndex: 0,
            };
            arrList.push(combination);
          });
        });
      } else if (selectedColor.length && !attrItemList.length) {
        selectedColor.map((color) => {
          const combination = {
            color: color.label,
            attr: null,
            price: "",
            sku: "",
            qty: "",
            imageIndex: 0,
          };
          arrList.push(combination);
        });
      } else if (!selectedColor.length && attrItemList.length) {
        attrItemList.map((attr) => {
          const combination = {
            color: null,
            attr: attr.label,
            price: "",
            sku: "",
            qty: "",
            imageIndex: 0,
          };
          arrList.push(combination);
        });
      }
      setVariantInputList(arrList);
    }
  }, [selectedColor, attrItemList, variantInputList.length]);

  if (error) return <div>failed to load</div>;
  if (!data) return <Spinner />;
  if (!data.product) return <DefaultErrorPage statusCode={404} />;

  const colorOption = [];
  data.color &&
    data.color.map((color) =>
      colorOption.push({ label: color.name, value: color.value })
    );

  const multiList = (item) => {
    const data = [];
    item.map((x) => data.push(x.value));
    return JSON.stringify(data);
  };

  const attributeIndex = data.product.attributeIndex
    ? data.product.attributeIndex
    : "";

  const updatedValueCb = (data) => {
    setEditorState(data);
  };

  const changeAttr = (e) => {
    setSelectedAttr(e);
    setAttrItemList([]);
  };

  const attrItemOption = (index) => {
    const item = [];
    data.attribute[index] &&
      data.attribute[index].values.map((attr) =>
        item.push({
          label: attr.name,
          value: attr.name,
          for: data.attribute[index].name,
        })
      );
    return item;
  };

  const handleInputChange = (e, i) => {
    const { name, value } = e.target;
    const items = [...variantInputList];
    items[i][name] = value;
    setVariantInputList(items);
  };

  const updateDisplayImage = (files) => setDisplayImage(files);
  const updateGalleryImage = (files) => setGalleryImage(files);

  const getEditorStateData = (editorData) => {
    const regex = /(<([^>]+)>)/gi;
    const data = !!editorData.replace(regex, "").length ? editorData : "";
    return data;
  };

  function updateBrand(e) {
    setSelectedBrand(e.target.value);
  }

  function updateCategory(e) {
    setSelectedCategory(e.target.value);
    const category = data.category.find((x) => x.slug === e.target.value);
    if (category) {
      const subcategory = [];
      const childCategory = [];
      category.subCategories.forEach((sub) => {
        subcategory.push({ name: sub.name, slug: sub.slug });
        sub.child?.forEach((child) => {
          childCategory.push({ name: child.name, slug: child.slug });
        });
      });
      setSubcategoryOption(subcategory);
      setChildcategoryOption(childCategory);
    }
  }

  const formHandler = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    const form = document.querySelector("#product_form");
    const formData = new FormData(form);
    const displayImg = JSON.stringify(displayImage);
    const galleryImg = JSON.stringify(galleryImage);
    const seo = {
      title: seo_title.current.value.trim(),
      description: seo_desc.current.value.trim(),
      image: seoImage,
    };
    formData.append("displayImage", displayImg);
    formData.append("galleryImages", galleryImg);
    formData.append("type", selectedType);
    formData.append("category", JSON.stringify([selectedCategory]));
    formData.append("subcategory", JSON.stringify([selectedSubCategory]));
    formData.append("childCategory", JSON.stringify([selectedChildcategory]));
    formData.append("brand", selectedBrand);
    formData.append("color", JSON.stringify(selectedColor));
    formData.append("attribute", JSON.stringify(attrItemList));
    formData.append("selectedAttribute", selectedAttr);
    formData.append("variant", JSON.stringify(variantInputList));
    formData.append("seo", JSON.stringify(seo));
    formData.append("description", getEditorStateData(editorState));
    await postData("/api/product/edit", formData)
      .then((status) =>
        status.success
          ? toast.success("Product Updated Successfully")
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        console.log(err);
        toast.error(`Something Went Wrong ${err.message}`);
      });
    setButtonState("");
  };

  return (
    <form
      id="product_form"
      encType="multipart/form-data"
      onSubmit={formHandler}
    >
      <div className="row">
        <div className="col-lg-8">
          {productType()}
          {imageInput()}
          {productInformation()}
          {productDescription()}
          {selectedType === "digital" && digitalProductInput()}
          {productTypeInput()}
          {seoInput()}
        </div>
        <div className="col-lg-4">
          {priceSelection()}
          {categorySelection()}
          {vatTaxSelection()}
        </div>
      </div>
      <input type="hidden" name="pid" defaultValue={data.product._id} />
      {/* {imageInput()}
      {productInformation()}
      {productDescription()}
      {productType()}
      {productTypeInput()}
      {seoInput()} */}
      <div className="py-3">
        <LoadingButton
          type="submit"
          text={t("Update Product")}
          state={buttonState}
        />
      </div>
    </form>
  );

  function productDescription() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Description")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-7" className="form-label">
              {t("Short Description")}*
            </label>
            <textarea
              id="inp-7"
              className={classes.input + " form-control"}
              name="short_description"
              defaultValue={data.product.shortDescription}
            />
          </div>
          <div className="py-3">
            <label className="form-label">{t("description")}</label>
            <TextEditor
              previousValue={editorState}
              updatedValue={updatedValueCb}
              height={300}
            />
          </div>
        </div>
      </div>
    );
  }

  function productTypeInput() {
    return (
      <div>
        {selectedType === "simple" && (
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
              {t("Product Information")}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="py-3">
                    <label htmlFor="inp-6" className="form-label">
                      {t("Item Quantity")}*({t("Set -1 to make it unlimited")})
                    </label>
                    <input
                      type="number"
                      min="-1"
                      id="inp-6"
                      className={classes.input + " form-control"}
                      name="qty"
                      defaultValue={data.product.quantity}
                      required
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="py-3">
                    <label className="form-label">{t("sku")}*</label>
                    <input
                      type="text"
                      className={classes.input + " form-control"}
                      name="sku"
                      defaultValue={data.product.sku}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedType === "variable" && (
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
              {t("Product Variation")}
            </div>
            <div className="card-body">
              <div className="row py-3">
                <label className="form-label">{t("Colors")}</label>
                <MultiSelect
                  options={colorOption}
                  onChange={(e) => {
                    setSelectedColor(e);
                  }}
                  value={selectedColor}
                  labelledBy="Select Color"
                />
              </div>
              <div className="py-3">
                <label className="form-label">{t("Attributes")}</label>
                <select
                  className={classes.input + " form-control"}
                  defaultValue={attributeIndex}
                  onChange={(evt) => changeAttr(evt.target.value)}
                >
                  <option value="" disabled>
                    {t("Select Attribute")}
                  </option>
                  {data.attribute &&
                    data.attribute.map((attr, idx) => (
                      <option value={idx} key={idx}>
                        {attr.name}
                      </option>
                    ))}
                </select>
              </div>
              {selectedAttr.length > 0 && data.attribute && (
                <div className="row py-3">
                  <label className="form-label">
                    {data.attribute[selectedAttr] &&
                      data.attribute[selectedAttr].name}
                  </label>
                  <MultiSelect
                    options={attrItemOption(selectedAttr)}
                    onChange={(e) => {
                      setAttrItemList(e);
                    }}
                    value={attrItemList}
                    labelledBy="Select Item"
                  />
                </div>
              )}
              {variantInputList.length > 0 &&
                variantInputList.map((variant, index) => {
                  return (
                    <div key={index}>
                      <hr />
                      <h6>
                        {t("Variant")}:{" "}
                        {`${variant.color ? variant.color : ""} ${
                          variant.color && variant.attr ? "+" : ""
                        } ${variant.attr ? variant.attr : ""}`}
                      </h6>
                      <div className="row">
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <label className="form-label">
                              {t("Additional Price")}*
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className={classes.input + " form-control"}
                              name="price"
                              required
                              value={variant.price || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                              onWheel={(e) => e.target.blur()}
                            />
                            <div className="small text-primary">
                              {t("Set 0 to make it free")}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <label className="form-label">{t("sku")}*</label>
                            <input
                              type="text"
                              className={classes.input + " form-control"}
                              name="sku"
                              required
                              value={variant.sku || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <label className="form-label">
                              {t("Item Quantity")}*
                            </label>
                            <input
                              type="number"
                              min="-1"
                              value={variant.qty > -2 ? variant.qty : ""}
                              className={classes.input + " form-control"}
                              name="qty"
                              required
                              onChange={(evt) => handleInputChange(evt, index)}
                              onWheel={(e) => e.target.blur()}
                            />
                            <div className="small text-primary">
                              S{t("et -1 to make it unlimited")}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <CustomSelect
                              list={galleryImage || []}
                              dataChange={handleInputChange}
                              rootIndex={index}
                              preIndex={variant.imageIndex || 0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }

  function productType() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Type")}
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="py-3">
                <label htmlFor="inp-110" className="form-label">
                  {t("new_product")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-110"
                    name="new_product"
                    defaultChecked={data.product.new}
                  />
                  <label className="form-check-label" htmlFor="inp-110">
                    {t("status")}
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="py-3">
                <label htmlFor="inp-11" className="form-label">
                  {t("trending_product")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-11"
                    name="trending"
                    defaultChecked={data.product.trending}
                  />
                  <label className="form-check-label" htmlFor="inp-11">
                    {t("status")}
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="py-3">
                <label htmlFor="inp-111" className="form-label">
                  {t("best_selling_product")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-111"
                    name="best_selling"
                    defaultChecked={data.product.bestSelling}
                  />
                  <label className="form-check-label" htmlFor="inp-111">
                    {t("status")}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-type" className="form-label">
                {t("Product Type")}*
              </label>
              <select
                id="inp-type"
                ref={product_type}
                className={classes.input + " form-control"}
                required
                onChange={() => setSelectedType(product_type.current.value)}
                defaultValue={data.product.type}
              >
                <option value="" disabled>
                  {t("Select Product Type")}
                </option>
                <option value="simple">Simple Product</option>
                <option value="variable">Variable Product</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function priceSelection() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Price Information")}
        </div>
        <div className="card-body">
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-4" className="form-label">
                {t("price")}*
              </label>
              <input
                type="number"
                step="0.01"
                id="inp-4"
                className="form-control"
                name="main_price"
                required
                onWheel={(e) => e.target.blur()}
                defaultValue={data.product.price}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-5" className="form-label">
                {t("Discount in Percentage")}*
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                id="inp-5"
                placeholder="0%"
                className="form-control"
                name="sale_price"
                required
                onWheel={(e) => e.target.blur()}
                defaultValue={
                  data.product.discountType === "amount"
                    ? data.product.price - data.product.discount
                    : Math.round(
                        (100 -
                          (data.product.discount * 100) / data.product.price) *
                          10
                      ) / 10
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function vatTaxSelection() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold text-center">
          {t("Vat & Tax Information")}
        </div>
        <div className="card-body">
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-4" className="form-label">
                {t("Vat in Percentage")}*
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                id="inp-47"
                className="form-control"
                name="vat"
                placeholder="0%"
                required
                onWheel={(e) => e.target.blur()}
                defaultValue={data.product.vat}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-5" className="form-label">
                {t("Tax in Percentage")}*
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                id="inp-57"
                placeholder="0%"
                className="form-control"
                name="tax"
                required
                onWheel={(e) => e.target.blur()}
                defaultValue={data.product.tax}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function categorySelection() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Category")}
        </div>
        <div className="card-body">
          <div className="col-12">
            <div className="py-3">
              <label className="form-label">{t("categories")}*</label>
              <select
                className="form-select"
                onChange={updateCategory}
                defaultValue={data.product.categories[0]}
                key={data.product.categories[0]}
                required
              >
                <option value="">Select Category</option>
                {data?.category?.map((x, i) => (
                  <option key={i} value={x.slug}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label className="form-label">{t("Subcategories")}*</label>
              <select
                className="form-select"
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                value={selectedSubCategory}
                required
              >
                <option value="">Select Sub Category</option>
                {subcategoryOption.map((x, i) => (
                  <option key={i} value={x.slug}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label className="form-label">{t("Child Categories")}</label>
              <select
                className="form-select"
                onChange={(e) => setSelectedChildcategory(e.target.value)}
                value={selectedChildcategory}
              >
                <option value="">Select Child Category</option>
                {childCategoryOption.map((x, i) => (
                  <option key={i} value={x.slug}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="py-3">
            <label className="form-label">{t("Brands")}</label>
            <select
              className="form-control"
              onChange={updateBrand}
              defaultValue={data.product.brand}
              key={data.product.brand}
            >
              <option value="">None</option>
              {data.brand &&
                data.brand.map((x) => (
                  <option value={x.slug} key={x._id}>
                    {x.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  function productInformation() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold text-center">
          {t("Product Description")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-1" className="form-label">
              {t("name")}*
            </label>
            <input
              type="text"
              id="inp-1"
              className={classes.input + " form-control"}
              name="name"
              defaultValue={data.product.name}
              required
            />
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-2" className="form-label">
                  {t("Unit")}*
                </label>
                <input
                  type="text"
                  id="inp-2"
                  className={classes.input + " form-control"}
                  name="unit"
                  defaultValue={data.product.unit}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-3" className="form-label">
                  {t("Unit Value")}*
                </label>
                <input
                  type="text"
                  id="inp-3"
                  className={classes.input + " form-control"}
                  name="unit_val"
                  defaultValue={data.product.unitValue}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function imageInput() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Image")}
        </div>
        <div className="card-body">
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Display Image")}
            maxFileSizeInBytes={2000000}
            updateFilesCb={updateDisplayImage}
            preSelectedFiles={data.product.image}
          />

          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Gallery Images")}
            multiple
            maxFileSizeInBytes={2000000}
            updateFilesCb={updateGalleryImage}
            preSelectedFiles={data.product.gallery}
          />
        </div>
      </div>
    );
  }

  function seoInput() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("SEO Meta Tags")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-122" className="form-label">
              {t("Meta Title")}
            </label>
            <input
              type="text"
              ref={seo_title}
              id="inp-122"
              className="form-control"
              defaultValue={data.product.seo.title}
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-222" className="form-label">
              {t("Meta Description")}
            </label>
            <textarea
              ref={seo_desc}
              id="inp-222"
              className="form-control"
              defaultValue={data.product.seo.description}
            />
          </div>
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Meta Image")}
            maxFileSizeInBytes={2000000}
            updateFilesCb={setSeoImage}
            preSelectedFiles={data.product.seo.image}
          />
        </div>
      </div>
    );
  }
};

export default ProductEditForm;
