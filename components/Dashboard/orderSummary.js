import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import Card from "../Ui/Card";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OrderSummary({ data }) {
  const { t } = useTranslation();
  let ORData = [];

  if (data && data.success) {
    const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    month.map((mn) => {
      const bb = data.order.find((x) => x._id.month === mn);
      if (bb) {
        ORData.push(bb.results);
      } else {
        ORData.push(0);
      }
    });
  }

  const chData = {
    series: [{ name: "Order", data: ORData }],
    options: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return Math.round(value);
          },
        },
      },
    },
  };
  return (
    <Card
      title={`${t("Order summary of the year")} ${new Date().getFullYear()}`}
    >
      <Chart
        options={chData.options}
        series={chData.series}
        type="bar"
        width={"100%"}
        height={320}
      />
    </Card>
  );
}
