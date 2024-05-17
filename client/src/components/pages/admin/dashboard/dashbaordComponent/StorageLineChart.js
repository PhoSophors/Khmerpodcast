import { useEffect, useRef } from "react";
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale);

const StorageLineChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: data.map((item) => item.date),
          datasets: [
            {
              label: "Total Size (MB)",
              data: data.map((item) => (item.totalSize / 1048576).toFixed(2)),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: "Total Size (MB)",
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  return <canvas ref={chartRef} />;
};

export default StorageLineChart;