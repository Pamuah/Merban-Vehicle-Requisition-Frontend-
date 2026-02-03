import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useAdminAnalytics } from "../../hooks/useAdminAnalytics.hook";
import type { DepartmentStats } from "../../types/admin.types";

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DepartmentUsageChart = () => {
  const { fetchDepartmentUsage, loading } = useAdminAnalytics();
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDepartmentUsage();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to load department stats:", err);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading chart...</div>;

  const labels = departments.map((d) => d.department || "N/A");

  const data = {
    labels,
    datasets: [
      {
        label: "Completed",
        data: departments.map((d) => d.completedTrips),
        backgroundColor: "#22c55e", // green
        borderRadius: 12, //
      },
      {
        label: "Pending",
        data: departments.map((d) => d.pendingRequests),
        backgroundColor: "#eab308", // yellow
        borderRadius: 12, //
      },
      {
        label: "Rejected",
        data: departments.map((d) => d.rejectedRequests),
        backgroundColor: "#ef4444", // red
        borderRadius: 12,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Number of Requests",
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-6 min-h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default DepartmentUsageChart;
