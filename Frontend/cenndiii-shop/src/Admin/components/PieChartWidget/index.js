import React from "react";
import Chart from "react-apexcharts";

const PieChartWidget = ({ title, data }) => {
  const options = {
    chart: {
      type: "pie",
    },
    labels: data.labels,
    legend: {
      position: "bottom",
    },
    colors: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"], // Màu sắc cho từng phần
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-center text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <Chart options={options} series={data.series} type="pie" width="100%" height={350} />
    </div>
  );
};

export default PieChartWidget;
