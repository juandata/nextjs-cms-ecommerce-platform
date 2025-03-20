import dynamic from "next/dynamic";
import DefaultErrorPage from "next/error";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/ProductForm/productForm.module.css";
import { fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const NewCategory = (props) => {
  const url = `/api/categories/subcategories`;
  const { data, error } = useSWR(url, fetchData);
  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [buttonState, setButtonState] = useState("");
  useEffect(() => {
    if (data && data.category) {
      setCategoryData(data.category);
    }
  }, [data]);
  const { t } = useTranslation();

  function createSubcategoryList(e) {
    const res = categoryData.find((x) => x._id === e.target.value);
    if (res) {
      setSubcategoryData(res.subCategories);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setButtonState("loading");
      const form = document.querySelector("#childcategory_form");
      const formData = new FormData(form);
      const response = await postData(
        "/api/categories/childcategories",
        formData
      );
      response.success
        ? toast.success("Child Category Added Successfully")
        : toast.error("Something Went Wrong");
      setButtonState("");
    } catch (err) {
      setButtonState("");
      toast.error(`Something Went Wrong ${err.message}`);
    }
  };

  return (
    <>
      {error ? (
        <DefaultErrorPage statusCode={500} />
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">
            {t("Create New Child Category")}
          </h4>
          <form id="childcategory_form" onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="inp-1" className="form-label" required>
                {t("name")}*
              </label>
              <input
                type="text"
                id="inp-1"
                className={classes.input + " form-control"}
                name="name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="inp-2" className="form-label" required>
                {t("Select Category")}*
              </label>
              <select
                id="inp-2"
                name="category"
                className={classes.input + " form-control"}
                onChange={createSubcategoryList}
              >
                <option value="">Select Category</option>
                {categoryData.map((data, index) => {
                  return (
                    <option key={index} value={data._id}>
                      {data.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="inp-2" className="form-label" required>
                {t("Select Subcategory")}*
              </label>
              <select
                id="inp-2"
                name="subcategory"
                className={classes.input + " form-control"}
              >
                {subcategoryData.map((data, idx) => {
                  return (
                    <option key={idx} value={data._id}>
                      {data.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-4">
              <LoadingButton
                type="submit"
                text={t("Add Subcategory")}
                state={buttonState}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

NewCategory.requireAuthAdmin = true;
NewCategory.dashboard = true;

export default NewCategory;
