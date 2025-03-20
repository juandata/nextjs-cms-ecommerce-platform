import React from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Card from "../Ui/Card";
import { useTranslation } from "react-i18next";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OrderStatusChart = ({ statusData }) => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    setChartData({
      options: {
        labels: data.map((status) => status[0]),
      },
      series: data.map((status) => status[1]),
    });
  }, [data]);

  useEffect(() => {
    if (statusData?.orderCounts) {
      const __d = Object.entries(statusData?.orderCounts).map((x) => x);
      setData(__d);
    }
  }, [statusData]);

  return (
    <Card title={t("Yearly order status summary")}>
      {chartData && (
        <ApexChart
          options={chartData.options}
          series={chartData.series}
          type="polarArea"
          height={320}
        />
      )}
    </Card>
  );
};

export default OrderStatusChart;
