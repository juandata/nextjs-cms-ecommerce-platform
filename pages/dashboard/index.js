import { useState } from "react";
import { useTranslation } from "react-i18next";
import SalesAreaChart from "~/components/Dashboard/monthlySale";
import OrderStatusChart from "~/components/Dashboard/orderStatus";
import OrderSummary from "~/components/Dashboard/orderSummary";
import PageLoader from "~/components/Ui/pageLoader";
import classes from "~/styles/dashboard.module.css";

const Dashboard = () => {
  const [data, setData] = useState({});
  const { t } = useTranslation();

  return (
    <PageLoader url={`/api/dashboard`} setData={setData} ref={null}>
      <div>
        <div className={classes.card_container}>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalOrder}</div>
                <div className={classes.label}>{t("Total Order")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalUser}</div>
                <div className={classes.label}>{t("Total Customer")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalCategory}</div>
                <div className={classes.label}>{t("Total Category")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalColor}</div>
                <div className={classes.label}>{t("Total Color")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalAttribute}</div>
                <div className={classes.label}>{t("Total Attribute")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalCoupon}</div>
                <div className={classes.label}>{t("Total Coupon")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <OrderSummary data={data} />
          </div>
          <div className="col-md-4">
            <OrderStatusChart statusData={data.orderCountByStatus || {}} />
          </div>
          <div className="col-md-12">
            <SalesAreaChart yearlySalesData={data.salesByMonth || []} />
          </div>
        </div>
      </div>
    </PageLoader>
  );
};

Dashboard.requireAuthAdmin = true;
Dashboard.dashboard = true;

export default Dashboard;
