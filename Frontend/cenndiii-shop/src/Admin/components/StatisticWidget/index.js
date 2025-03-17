import React from "react";
import { Card } from "antd";
import PropTypes from "prop-types";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const StatisticWidget = ({ title, value, status, subtitle, prefix, imgSrc }) => {
  return (
    <Card className="p-4 rounded-xl shadow-lg text-center border border-gray-200 mb-4">
      <div className="flex items-center space-x-6">
        {imgSrc && (
          <img
            src={imgSrc}
            alt="icon"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
          />
        )}
        <div className="flex-1 text-left">
          {title && <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>}
          <div className="flex items-center mt-1">
            {prefix && <div className="mr-2">{prefix}</div>}
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">{value}</h1>
                {status !== undefined && (
                  <span
                    className={`ml-3 font-medium flex items-center text-sm px-2 py-1 rounded-lg ${
                      status > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {status}%
                    {status > 0 ? <ArrowUpOutlined className="ml-1" /> : <ArrowDownOutlined className="ml-1" />}
                  </span>
                )}
              </div>
              {subtitle && <div className="mt-1 text-xs text-gray-500">{subtitle}</div>}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

StatisticWidget.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  value: PropTypes.string,
  subtitle: PropTypes.string,
  status: PropTypes.number,
  prefix: PropTypes.element,
  imgSrc: PropTypes.string,
};

export default StatisticWidget;
