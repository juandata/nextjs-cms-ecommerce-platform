import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import HeadData from "~/components/Head";
import { appUrl, fetchData, setSettingsData } from "~/lib/clientFunctions";
import categoryPageData from "~/lib/dataLoader/category";
import { wrapper } from "~/redux/store";
import c from "~/styles/categoryPage.module.css";

const ImageLoader = dynamic(() => import("~/components/Image"));
const Link = dynamic(() => import("next/link"));
const Error500 = dynamic(() => import("~/components/error/500"));

const CategoriesPage = ({ data, error }) => {
  const { t } = useTranslation();
  function toggleItem(evt, id) {
    try {
      evt.target.toggleAttribute("aria-expanded");
      document.getElementById(`cat__${id}`).toggleAttribute("aria-expanded");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {error ? (
        <Error500 />
      ) : (
        <>
          <HeadData title="All Categories" />
          <h1 className={c.heading}>{t("all_categories")}</h1>
          <div className="custom_container">
            <div className={c.spc}>
              <div className={c.card}>
                <div className="card-body">
                  <div className={c.category}>
                    <div className="row">
                      {data &&
                        data.category.map((cat) => (
                          <div
                            className="col-12 text-left mb-3"
                            key={cat.categoryId}
                          >
                            <div className={c.img_con}>
                              <ImageLoader
                                src={cat.icon[0]?.url}
                                alt={cat.name}
                                width={60}
                                height={60}
                              />
                              <h5>
                                <Link href={`/gallery?category=${cat.slug}`}>
                                  {cat.name}
                                </Link>
                              </h5>
                            </div>
                            <div className="row">
                              {cat.subCategories &&
                                cat.subCategories.map((sub, idx) => (
                                  <div
                                    className="col-xl-3 col-lg-4 col-sm-6 text-left py-2"
                                    key={sub.slug + idx}
                                  >
                                    <div>
                                      <h6>
                                        <Link
                                          href={`/gallery?category=${sub.slug}&parent=${cat.slug}`}
                                        >
                                          {sub.name}
                                        </Link>
                                      </h6>
                                    </div>
                                    <div
                                      className={c.sub}
                                      id={`cat__${cat.slug}`}
                                      aria-expanded={
                                        sub.child && sub.child.length > 4
                                      }
                                    >
                                      {sub.child &&
                                        sub.child.map((ch, chIdx) => (
                                          <div key={ch.slug + chIdx}>
                                            <p>
                                              <Link
                                                href={`/gallery?category=${sub.slug}&child=${ch.slug}&parent=${cat.slug}`}
                                              >
                                                {ch.name}
                                              </Link>
                                            </p>
                                          </div>
                                        ))}
                                    </div>
                                    {sub.child && sub.child.length > 4 && (
                                      <div
                                        className={c.btn}
                                        onClick={(e) => toggleItem(e, cat.slug)}
                                        aria-expanded
                                      />
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, locale, ...etc }) => {
      if (res) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59"
        );
      }
      const _data = await categoryPageData();
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

export default CategoriesPage;
