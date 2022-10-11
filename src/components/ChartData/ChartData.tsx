import { HStack } from "@chakra-ui/react";
import React from "react";
import { Chart } from "react-google-charts";

export const barOptions = {
  // title: "Population of Largest U.S. Cities",
  chartArea: { width: "50%" },
  isStacked: true,
  hAxis: {
    title: "Community",
    minValue: 0,
  },
  vAxis: {
    title: "Count",
  },
};
export const barOptions2 = {
  // title: "Population of Largest U.S. Cities",
  chartArea: { width: "50%" },
  isStacked: true,
  hAxis: {
    title: "Community Name",
    minValue: 0,
  },
  vAxis: {
    title: "Count",
  },
};
export const options = {
  title: "My Daily Activities",
};
export default function ChartData({
  categorydata,
  //   barChartData2,
  agingdata,
  charttype,
}: any) {
  return (
    <HStack width={"70%"} position={"absolute"}>
      {charttype === "bar" && (
        <Chart
          // key={i}
          chartType={"ColumnChart"}
          data={categorydata}
          options={barOptions}
          width={"100%"}
          height={"400px"}
        />
      )}
      {charttype !== "bar" &&
        charttype !== "bar1" &&
        Object.keys(categorydata).map((data, i) => {
          return (
            <Chart
              key={i}
              chartType={"PieChart"}
              data={categorydata[data]}
              // options={options}
              width={"100%"}
              height={"400px"}
            />
          );
        })}
      {charttype !== "bar" &&
        charttype !== "bar1" &&
        Object.keys(agingdata).map((data, i) => {
          return (
            <Chart
              key={i}
              chartType="PieChart"
              data={agingdata[data]}
              // options={{ title: data }}
              width={"100%"}
              height={"400px"}
            />
          );
        })}
    </HStack>
  );
}
